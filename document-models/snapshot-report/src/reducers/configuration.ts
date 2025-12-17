import type { SnapshotReportConfigurationOperations } from "@powerhousedao/contributor-billing/document-models/snapshot-report";

export const snapshotReportConfigurationOperations: SnapshotReportConfigurationOperations =
  {
    setReportConfigOperation(state, action) {
          if (action.input.reportName !== undefined && action.input.reportName !== null) {
            state.reportName = action.input.reportName;
          }
          if (action.input.startDate !== undefined && action.input.startDate !== null) {
            state.startDate = action.input.startDate;
          }
          if (action.input.endDate !== undefined && action.input.endDate !== null) {
            state.endDate = action.input.endDate;
          }
          if (action.input.accountsDocumentId !== undefined && action.input.accountsDocumentId !== null) {
            state.accountsDocumentId = action.input.accountsDocumentId;
          }
      },
    setAccountsDocumentOperation(state, action) {
        state.accountsDocumentId = action.input.accountsDocumentId;
    },
    setPeriodOperation(state, action) {
        state.startDate = action.input.startDate;
        state.endDate = action.input.endDate;
    },
  };
