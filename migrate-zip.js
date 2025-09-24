import fs from "node:fs";
import JSZip from "jszip";
import path from "node:path";
import { documentModelDocumentModelModule } from "document-model";
import { argv } from "node:process";

const docModelMap = {
  "powerhouse/document-model": documentModelDocumentModelModule,
  // add other document models here
};

async function loadFromZip(zip, entryName) {
  const entry = await zip.file(entryName).async("string");
  return JSON.parse(entry);
}

async function resolvePath(argPath) {
  if (fs.lstatSync(argPath).isDirectory()) {
    const children = fs.readdirSync(argPath);
    return children
      .filter(
        (child) =>
          child.endsWith(".zip") &&
          fs.lstatSync(path.join(argPath, child)).isFile(),
      )
      .map((child) => path.join(argPath, child));
  }
  return [path.resolve(argPath)];
}

async function migrateZip(zipPath) {
  const file = fs.readFileSync(zipPath);
  const docZip = new JSZip();
  await docZip.loadAsync(file);
  const header = await loadFromZip(docZip, "header.json");
  const operations = await loadFromZip(docZip, "operations.json");
  const documentModel = docModelMap[header.documentType];

  if (!documentModel) {
    throw new Error(
      `Unknown document type: ${header.documentType}. Add it to docModelMap.`,
    );
  }

  const result = Object.values(operations)
    .flat()
    .reduce((doc, operation) => {
      const action = "action" in operation ? operation.action : operation;
      return documentModel.reducer(doc, action);
    }, documentModel.utils.createDocument());

  const targetName = path.basename(zipPath, path.extname(zipPath));
  const targetPath = path.resolve(zipPath, "../");

  await documentModel.utils.saveToFile(
    result,
    targetPath,
    `${targetName}-migrated`,
  );
  console.info(
    `Migrated ${path.relative(process.cwd(), zipPath)} to ${path.relative(
      process.cwd(),
      path.join(
        targetPath,
        `${targetName}-migrated.${documentModel.documentModel.extension}.zip`,
      ),
    )}`,
  );
}

const paths = argv.length > 2 ? argv.slice(2) : [process.cwd()];

paths.forEach(async (val) => {
  const resolvedPaths = await resolvePath(val);
  for (const zipPath of resolvedPaths) {
    try {
      await migrateZip(zipPath);
    } catch (e) {
      console.error(`Error migrating ${zipPath}`, e);
    }
  }
});