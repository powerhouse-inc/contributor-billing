/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { generateId } from "document-model";
import type { BillingStatementLineItemsOperations } from "../../gen/line-items/operations.js";
import { BillingStatementLineItem, BillingStatementState } from "document-models/billing-statement/gen/types.js";

export const reducer: BillingStatementLineItemsOperations = {
  addLineItemOperation(state, action, dispatch) {
    try {
      const newLineItem: BillingStatementLineItem = {
        id: generateId(),
        description: action.input.description,
        quantity: action.input.quantity,
        unitPricePwt: action.input.unitPricePwt,
        unitPriceCash: action.input.unitPriceCash,
        totalPricePwt: action.input.totalPricePwt,
        totalPriceCash: action.input.totalPriceCash,
        lineItemTag: [],
      };

      state.lineItems.push(newLineItem);
      updateTotals(state);
    } catch (error) {
      console.error("Failed to add line item:", error);
    }
  },
  editLineItemOperation(state, action, dispatch) {
    try {
      const stateItem = state.lineItems.find((x) => x.id === action.input.id);
      if (!stateItem) throw new Error("Item matching input.id not found");

      const sanitizedInput = Object.fromEntries(
        Object.entries(action.input).filter(([, value]) => value !== null),
      ) as Partial<BillingStatementLineItem>;

      const nextItem: BillingStatementLineItem = {
        ...stateItem,
        ...sanitizedInput,
      };

      Object.assign(stateItem, nextItem);
      updateTotals(state);
    } catch (error) {
      console.error("Failed to edit line item:", error);
    }
  },
};

const updateTotals = (state: BillingStatementState) => {
  state.totalCash = state.lineItems.reduce((total, lineItem) => {
    return total + lineItem.quantity * lineItem.unitPriceCash;
  }, 0.0);

  state.totalPowt = state.lineItems.reduce((total, lineItem) => {
    return total + lineItem.quantity * lineItem.unitPricePwt;
  }, 0.0);
}