import type { UpgradeManifest } from "document-model";
import { latestVersion, supportedVersions } from "./versions.js";

export const accountTransactionsUpgradeManifest: UpgradeManifest<
  typeof supportedVersions
> = {
  documentType: "powerhouse/account-transactions",
  latestVersion,
  supportedVersions,
  upgrades: {},
};
