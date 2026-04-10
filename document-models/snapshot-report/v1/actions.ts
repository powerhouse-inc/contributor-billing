import { baseActions } from "document-model";
import {
  snapshotReportConfigurationActions,
  snapshotReportAccountsActions,
  snapshotReportBalancesActions,
  snapshotReportTransactionsActions,
} from "./gen/creators.js";

/** Actions for the SnapshotReport document model */

export const actions = {
  ...baseActions,
  ...snapshotReportConfigurationActions,
  ...snapshotReportAccountsActions,
  ...snapshotReportBalancesActions,
  ...snapshotReportTransactionsActions,
};
