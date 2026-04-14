# Deploying Connect to Swarm

## Prerequisites

- A Bee node with a usable postage stamp (mutable or immutable)
- `ph-cli` installed (`npm i -g @powerhousedao/cli`)
- `curl` for uploading to the Bee node

## Step 1: Build

```bash
PH_CONNECT_INSPECTOR_ENABLED=false npx ph-cli connect build
```

This creates a production build at `.ph/connect-build/dist/`.

## Step 2: Empty external packages

The `ph-packages.json` file references external package registries that won't be
available when served from Swarm. Empty it since all packages are bundled locally:

```bash
echo '{"packages":[]}' > .ph/connect-build/dist/ph-packages.json
```

## Step 3: Fix paths for Swarm hosting

Swarm's bzz manifest serves files from a content hash URL (`/bzz/{hash}/`).
Vite builds with absolute paths (`/assets/...`) which resolve to the Bee node
root instead of the bzz manifest root. Fix them:

```bash
cd .ph/connect-build/dist

# 1. Add <base> tag so relative URLs resolve from the bzz root
sed -i 's|<head>|<head>\n    <base href="./">|' index.html

# 2. Fix absolute paths in index.html
sed -i 's|"/assets/|"assets/|g; s|"/icon.ico"|"icon.ico"|g' index.html

# 3. Fix the Vite preload helper (prefixes module URLs)
sed -i 's|return`/`+e|return`./`+e|' assets/preload-helper-*.js

# 4. Fix ph-packages.json path in reactor JS
sed -i 's|`/ph-packages.json`|`./ph-packages.json`|g' assets/reactor-BZe1KJFd-*.js

# 5. Fix ALL absolute /assets/ paths in JS files to relative ./
#    JS files live inside assets/, so ./ resolves to assets/ in the manifest
find assets -name "*.js" -exec sed -i 's|`/assets/|`./|g' {} +

cd -
```

### Why these fixes are needed

- **`<base href="./">`**: Tells the browser to resolve relative URLs from the
  document's directory (the bzz manifest root)
- **HTML paths**: `"/assets/file.js"` resolves to `bee-node:1633/assets/file.js`
  (wrong) instead of `bee-node:1633/bzz/{hash}/assets/file.js` (correct)
- **Preload helper**: Vite's module preloader prefixes chunks with `/` — needs `./`
- **JS `/assets/` paths**: PGlite WASM/data files and other assets use `new URL("/assets/...", import.meta.url)`.
  Changing to `./` makes them resolve relative to the JS file's location inside `assets/`

## Step 4: Create a postage stamp (if needed)

Check wallet balance and create a stamp. The build is ~78MB, so depth 20 (680MB) works:

```bash
BEE_URL="https://your-bee-node:1633"

# Check balance
curl -s "$BEE_URL/wallet"

# Check current price
curl -s "$BEE_URL/chainstate"

# Create stamp (amount = blocks * price * 2x safety, depth 20 for 680MB, 30 days)
# Calculate amount: ceil(30 * 86400 / 5) * currentPrice * 2
curl -s -X POST "$BEE_URL/stamps/{amount}/{depth}" -H "Immutable: true"
```

Wait 1-2 minutes for the stamp to confirm on Gnosis Chain before uploading.

## Step 5: Upload to Swarm

```bash
BEE_URL="https://your-bee-node:1633"
BATCH_ID="your-stamp-batch-id"

tar -C .ph/connect-build/dist -cf - . | curl -s -X POST "$BEE_URL/bzz" \
  -H "Swarm-Postage-Batch-Id: $BATCH_ID" \
  -H "Swarm-Index-Document: index.html" \
  -H "Swarm-Collection: true" \
  -H "Content-Type: application/x-tar" \
  --data-binary @-
```

This returns a JSON with the Swarm reference hash:

```json
{"reference":"eb841126f3dae60991f546a2513d37ff54492fa522995519a8916e9dcd25863d"}
```

## Step 6: Verify

Open in browser:
```
https://your-bee-node:1633/bzz/{reference}/
```

## Step 7: Attach to ENS (optional)

Update your ENS domain's content hash to:
```
bzz://{reference}
```

Then access via `https://{your-ens-name}.eth.limo` or any Swarm gateway.

## One-liner deploy script

```bash
#!/bin/bash
BEE_URL="${BEE_URL:-https://your-bee-node:1633}"
BATCH_ID="${BATCH_ID:-your-batch-id}"

# Build
PH_CONNECT_INSPECTOR_ENABLED=false npx ph-cli connect build

# Patch for Swarm
cd .ph/connect-build/dist
echo '{"packages":[]}' > ph-packages.json
sed -i 's|<head>|<head>\n    <base href="./">|' index.html
sed -i 's|"/assets/|"assets/|g; s|"/icon.ico"|"icon.ico"|g' index.html
sed -i 's|return`/`+e|return`./`+e|' assets/preload-helper-*.js
sed -i 's|`/ph-packages.json`|`./ph-packages.json`|g' assets/reactor-BZe1KJFd-*.js
find assets -name "*.js" -exec sed -i 's|`/assets/|`./|g' {} +
cd -

# Upload
HASH=$(tar -C .ph/connect-build/dist -cf - . | curl -s -X POST "$BEE_URL/bzz" \
  -H "Swarm-Postage-Batch-Id: $BATCH_ID" \
  -H "Swarm-Index-Document: index.html" \
  -H "Swarm-Collection: true" \
  -H "Content-Type: application/x-tar" \
  --data-binary @- | python3 -c "import sys,json; print(json.load(sys.stdin)['reference'])")

echo "Deployed to: $BEE_URL/bzz/$HASH/"
echo "ENS content hash: bzz://$HASH"
```

## Notes

- The stamp duration determines how long the content stays available on Swarm
- Immutable stamps are recommended for static website hosting
- The `reactor-BZe1KJFd-*.js` filename may change between builds — the sed
  command uses a wildcard to handle this
- If the build structure changes, you may need to adjust the path fixes
