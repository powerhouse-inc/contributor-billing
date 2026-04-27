/**
 * Custom build driver that fixes the "two React instances" problem when the
 * package is loaded by a deployed Connect.
 *
 * The default `ph-cli build` (via `@powerhousedao/shared/clis`) uses
 * `deps.alwaysBundle: ["**"]` and filters React out of `browserNeverBundle`,
 * which ends up emitting a chunk (e.g. `react-*.js`) that contains the full
 * React source. When Connect imports the editor module from the CDN it pulls
 * that chunk in alongside its own React, producing two React instances and
 * breaking hooks with:
 *   `TypeError: Cannot read properties of null (reading 'useState')`
 *
 * This script reuses the shared Powerhouse build configs but forces React,
 * react-dom, and their sub-paths into `deps.neverBundle`, which tsdown passes
 * to rolldown as a hard `external`. Emitted chunks then contain bare
 * `import … from "react"` / `"react-dom"` statements, which Connect resolves
 * against its own React at runtime — so there's only ever one React.
 *
 * Post-build, we patch rolldown's runtime chunk so its `__require()` shim
 * resolves React (and friends) via hoisted ESM imports instead of throwing.
 * Some transitive deps are still CommonJS (e.g. `react-confirm`,
 * `focus-trap-react` pulled in by `@powerhousedao/document-engineering`'s
 * Table/confirm/focus-trap path) and call `require("react")` from inside
 * rolldown's `__commonJSMin` wrappers. The built-in `esmExternalRequirePlugin`
 * doesn't reach into those wrappers, so without this patch the very first
 * module-init throws:
 *   `Calling 'require' for "react" in an environment that doesn't expose the
 *    'require' function.`
 */

import {
  browserBuildConfig,
  nodeBuildConfig
} from "@powerhousedao/shared/clis";
import { execSync } from "node:child_process";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { build, type InlineConfig } from "tsdown";

const REACT_EXTERNALS = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react-dom/client",
];

const outDir = "dist";

const existingBrowserNeverBundle = Array.isArray(
  browserBuildConfig.deps?.neverBundle,
)
  ? (browserBuildConfig.deps?.neverBundle as string[])
  : [];

const browserNeverBundle = Array.from(
  new Set([...existingBrowserNeverBundle, ...REACT_EXTERNALS]),
);

// tsdown exports `browserBuildConfig`/`nodeBuildConfig` as `ResolvedConfig`,
// but `build()` accepts `InlineConfig`. The shapes overlap at runtime — the
// cast tells TS "trust me" for the few non-overlapping fields (like `copy`).
await build({
  ...(browserBuildConfig as InlineConfig),
  outDir: join(outDir, "browser"),
  deps: {
    ...browserBuildConfig.deps,
    neverBundle: browserNeverBundle,
  },
});

await build({
  ...(nodeBuildConfig as InlineConfig),
  outDir: join(outDir, "node"),
});

await patchRequireShim(join(outDir, "browser"));

// Tailwind step — mirrors what ph-cli's build does after the bundle phase.
execSync("bun x @tailwindcss/cli -i ./style.css -o ./dist/style.css", {
  stdio: "inherit",
});

/**
 * Find rolldown's runtime chunk and replace its browser-throwing `__require`
 * with one backed by hoisted ESM imports for `REACT_EXTERNALS`. Every other
 * chunk imports `__require` from this file, so a single rewrite covers them
 * all. The shim still uses real `require` when present (Node) and throws
 * for any unknown specifier so the original failure mode survives.
 */
async function patchRequireShim(browserDir: string): Promise<void> {
  const files = await readdir(browserDir);
  const SHIM_MARKER = "Calling `require` for";
  const REQUIRE_DECL = /var __require = [\s\S]*?\n\}\);/;

  let patched = 0;
  for (const file of files) {
    if (!file.endsWith(".js")) continue;
    const filepath = join(browserDir, file);
    const content = await readFile(filepath, "utf8");
    if (!content.includes(SHIM_MARKER) || !REQUIRE_DECL.test(content)) continue;

    const slot = (spec: string) => `__ext_${spec.replace(/[^a-zA-Z0-9]/g, "_")}`;
    const imports = REACT_EXTERNALS.map(
      (spec) => `import * as ${slot(spec)} from ${JSON.stringify(spec)};`,
    ).join("\n");
    const cases = REACT_EXTERNALS.map(
      (spec) => `\t\tcase ${JSON.stringify(spec)}: return ${slot(spec)};`,
    ).join("\n");

    const newRequire = `var __require = (x) => {
\tswitch (x) {
${cases}
\t}
\tif (typeof require !== "undefined") return require(x);
\tthrow Error("Calling 'require' for \\"" + x + "\\" in an environment that doesn't expose 'require'. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
};`;

    const next = imports + "\n" + content.replace(REQUIRE_DECL, newRequire);
    await writeFile(filepath, next);
    patched++;
    console.log(`patched __require shim in ${file}`);
  }

  if (patched === 0) {
    throw new Error(
      "patchRequireShim: no runtime chunk found in " + browserDir,
    );
  }
}
