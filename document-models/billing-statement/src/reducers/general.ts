/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import type { BillingStatementGeneralOperations } from "../../gen/general/operations.js";
import { BillingStatementStatusInputSchema } from "../../gen/schema/zod.js";

export const reducer: BillingStatementGeneralOperations = {
  editBillingStatementOperation(state, action, dispatch) {
    try {
      state.dateIssued = action.input.dateIssued ?? state.dateIssued;
      state.dateDue = action.input.dateDue ?? state.dateDue;
      state.currency = action.input.currency ?? state.currency;
      state.notes = action.input.notes ?? state.notes;
    } catch (error) {
      console.error("Failed to edit billing statement:", error);
      return state;
    }
  },

  editContributorOperation(state, action, dispatch) {
    try {
      state.contributor = action.input.contributor ?? state.contributor;
    } catch (error) {
      console.error("Failed to edit contributor:", error);
      return state;
    }
  },

  editStatusOperation(state, action, dispatch) {
    try {
      if (!BillingStatementStatusInputSchema.safeParse(action.input.status).success) {
        throw new Error("Invalid status value");
      }
      state.status = action.input.status ?? state.status;
    } catch (error) {
      console.error("Failed to edit status:", error);
      return state;
    }
  },
};
