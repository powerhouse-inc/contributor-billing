import type { UpgradeManifest } from "document-model";
import { latestVersion, supportedVersions } from "./versions.js";

export const operationalHubProfileUpgradeManifest: UpgradeManifest<
  typeof supportedVersions
> = {
  documentType: "powerhouse/operational-hub-profile",
  latestVersion,
  supportedVersions,
  upgrades: {},
};
