import type {
  BillingStatementLineItemsOperations,
  BillingStatementState,
  BillingStatementLineItem,
} from "@powerhousedao/contributor-billing/document-models/billing-statement";

export const billingStatementLineItemsOperations: BillingStatementLineItemsOperations = {
  addLineItemOperation(state, action, dispatch) {
    const newLineItem: BillingStatementLineItem = {
      ...action.input,
      lineItemTag: [],
    };

    // Check for duplicate ID
    if (state.lineItems.find((x) => x.id === newLineItem.id)) {
      throw new Error("Duplicate line item ID");
    }

    state.lineItems.push(newLineItem);
    updateTotals(state);

  },
  editLineItemOperation(state, action, dispatch) {
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