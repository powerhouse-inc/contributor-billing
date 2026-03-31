import type { UpgradeManifest } from "document-model";
import { latestVersion, supportedVersions } from "./versions.js";

export const snapshotReportUpgradeManifest: UpgradeManifest<
  typeof supportedVersions
> = {
  documentType: "powerhouse/snapshot-report",
  latestVersion,
  supportedVersions,
  upgrades: {},
};
