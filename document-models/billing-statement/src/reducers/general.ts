import type { BillingStatementGeneralOperations } from "@powerhousedao/contributor-billing/document-models/billing-statement";
import { BillingStatementStatusInputSchema } from "@powerhousedao/contributor-billing/document-models/billing-statement";

export const billingStatementGeneralOperations: BillingStatementGeneralOperations = {
  editBillingStatementOperation(state, action, dispatch) {
    state.dateIssued = action.input.dateIssued ?? state.dateIssued;
    state.dateDue = action.input.dateDue ?? state.dateDue;
    state.currency = action.input.currency ?? state.currency;
    state.notes = action.input.notes ?? state.notes;

  },

  editContributorOperation(state, action, dispatch) {
    state.contributor = action.input.contributor ?? state.contributor;

  },

  editStatusOperation(state, action, dispatch) {
    if (!BillingStatementStatusInputSchema.safeParse(action.input.status).success) {
      throw new Error("Invalid status value");
    }
    state.status = action.input.status ?? state.status;

  },
};
