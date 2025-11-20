import type { InvoiceLineItem, InvoiceState, InvoiceTag } from "../../gen/types.js";
import type { InvoiceItemsOperations } from "@powerhousedao/contributor-billing/document-models/invoice";

export const invoiceItemsOperations: InvoiceItemsOperations = {
  addLineItemOperation(state, action, dispatch) {

    const item: InvoiceLineItem = {
      ...action.input,
      lineItemTag: [],
    };

    if (state.lineItems.find((x) => x.id === item.id))
      throw new Error("Duplicate input.id");

    validatePrices(item as InvoiceLineItem);
    state.lineItems.push(item as InvoiceLineItem);
    updateTotals(state);

  },

  editLineItemOperation(state, action, dispatch) {
    const stateItem = state.lineItems.find((x) => x.id === action.input.id);
    if (!stateItem) throw new Error("Item matching input.id not found");

    const sanitizedInput = Object.fromEntries(
      Object.entries(action.input).filter(([, value]) => value !== null),
    ) as Partial<InvoiceLineItem>;

    // Ensure lineItemTag is always an array if provided
    if ('lineItemTag' in action.input) {
      sanitizedInput.lineItemTag = (action.input.lineItemTag ?? []) as any;
    }

    const nextItem: InvoiceLineItem = {
      ...stateItem,
      ...sanitizedInput,
    };
    validatePrices(nextItem);
    applyInvariants(state, nextItem);
    Object.assign(stateItem, nextItem);
    updateTotals(state);

  },

  deleteLineItemOperation(state, action, dispatch) {
    state.lineItems = state.lineItems.filter((x) => x.id !== action.input.id);
    updateTotals(state);

  },

  setLineItemTagOperation(state, action, dispatch) {
    const stateItem = state.lineItems.find((x) => x.id === action.input.lineItemId);
    if (!stateItem) throw new Error("Item matching input.id not found");

    // if tag already exists with the same dimension, update the value and label
    const existingTag = stateItem.lineItemTag?.find((tag) => tag.dimension === action.input.dimension);
    if (existingTag) {
      existingTag.value = action.input.value;
      existingTag.label = action.input.label || null;
    } else {
      // if tag does not exist, add it
      const newTag: InvoiceTag = {
        dimension: action.input.dimension,
        value: action.input.value,
        label: action.input.label || null,
      };
      if (!stateItem.lineItemTag) {
        stateItem.lineItemTag = [];
      }

      // Add the new tag
      stateItem.lineItemTag?.push(newTag);

    }

  },
  setInvoiceTagOperation(state, action, dispatch) {
    // if tag already exists with the same dimension, update the value and label
    const existingTag = state.invoiceTags?.find((tag) => tag.dimension === action.input.dimension);
    if (existingTag) {
      existingTag.value = action.input.value;
      existingTag.label = action.input.label || null;
    } else {
      // if tag does not exist, add it
      const newTag: InvoiceTag = {
        dimension: action.input.dimension,
        value: action.input.value,
        label: action.input.label || null,
      };
      if (!state.invoiceTags) {
        state.invoiceTags = [];
      }
      // Add the new tag
      state.invoiceTags.push(newTag);

    }

  },
};


function updateTotals(state: InvoiceState) {
  state.totalPriceTaxExcl = state.lineItems.reduce((total, lineItem) => {
    return total + lineItem.quantity * lineItem.unitPriceTaxExcl;
  }, 0.0);

  state.totalPriceTaxIncl = state.lineItems.reduce((total, lineItem) => {
    return total + lineItem.quantity * lineItem.unitPriceTaxIncl;
  }, 0.0);
}

function validatePrices(item: InvoiceLineItem) {
  const EPSILON = 0.00001; // Small value for floating point comparisons

  // Calculate total prices from unit prices and quantity
  const calcPriceIncl = item.quantity * item.unitPriceTaxIncl;
  const calcPriceExcl = item.quantity * item.unitPriceTaxExcl;

  // Convert tax percentage to decimal rate
  const taxRate = item.taxPercent / 100;

  // Helper function to compare floating point numbers
  const isClose = (a: number, b: number) => Math.abs(a - b) < EPSILON;

  // Validate unit prices (tax-exclusive should equal tax-inclusive / (1 + taxRate))
  const expectedUnitPriceExcl = item.unitPriceTaxIncl / (1 + taxRate);
  if (!isClose(item.unitPriceTaxExcl, expectedUnitPriceExcl)) {
    throw new Error("Tax inclusive/exclusive unit prices failed comparison.");
  }

  // Validate total prices
  if (!isClose(calcPriceIncl, item.totalPriceTaxIncl)) {
    throw new Error("Calculated unitPriceTaxIncl does not match input total");
  }

  if (!isClose(calcPriceExcl, item.totalPriceTaxExcl)) {
    throw new Error("Calculated unitPriceTaxExcl does not match input total");
  }

  // Validate total prices using the tax rate
  const expectedTotalPriceExcl = calcPriceIncl / (1 + taxRate);
  if (!isClose(calcPriceExcl, expectedTotalPriceExcl)) {
    throw new Error("Tax inclusive/exclusive totals failed comparison.");
  }
}

const applyInvariants = (state: InvoiceState, nextItem: InvoiceLineItem) => {
  const EPSILON = 0.00001; // Small value for floating point comparisons

  // Helper function to compare floating point numbers
  const isClose = (a: number, b: number) => Math.abs(a - b) < EPSILON;

  // Helper function to check if a value has changed significantly
  const hasChanged = (oldValue: number, newValue: number) => !isClose(oldValue, newValue);

  // Find the current state of this line item
  const currentItem = state.lineItems.find(item => item.id === nextItem.id);
  if (!currentItem) {
    // New item, no comparison needed
    return;
  }

  const taxRate = nextItem.taxPercent / 100;

  // Check if totalPriceTaxExcl was changed and update unitPriceTaxExcl accordingly
  const expectedTotalPriceTaxExcl = nextItem.quantity * nextItem.unitPriceTaxExcl;
  if (hasChanged(expectedTotalPriceTaxExcl, nextItem.totalPriceTaxExcl)) {
    // Total was changed, update unit price
    nextItem.unitPriceTaxExcl = nextItem.totalPriceTaxExcl / nextItem.quantity;
    // Update tax-inclusive unit price to maintain tax relationship
    nextItem.unitPriceTaxIncl = nextItem.unitPriceTaxExcl * (1 + taxRate);
    // Update tax-inclusive total to maintain consistency
    nextItem.totalPriceTaxIncl = nextItem.quantity * nextItem.unitPriceTaxIncl;
  }

  // Check if totalPriceTaxIncl was changed and update unitPriceTaxIncl accordingly
  const expectedTotalPriceTaxIncl = nextItem.quantity * nextItem.unitPriceTaxIncl;
  if (hasChanged(expectedTotalPriceTaxIncl, nextItem.totalPriceTaxIncl)) {
    // Total was changed, update unit price
    nextItem.unitPriceTaxIncl = nextItem.totalPriceTaxIncl / nextItem.quantity;
    // Update tax-exclusive unit price to maintain tax relationship
    nextItem.unitPriceTaxExcl = nextItem.unitPriceTaxIncl / (1 + taxRate);
    // Update tax-exclusive total to maintain consistency
    nextItem.totalPriceTaxExcl = nextItem.quantity * nextItem.unitPriceTaxExcl;
  }

  // Check if unitPriceTaxExcl was changed and update totals accordingly
  const expectedUnitPriceTaxIncl = nextItem.unitPriceTaxExcl * (1 + taxRate);
  if (hasChanged(expectedUnitPriceTaxIncl, nextItem.unitPriceTaxIncl)) {
    // Unit price was changed, update tax-inclusive unit price and totals
    nextItem.unitPriceTaxIncl = nextItem.unitPriceTaxExcl * (1 + taxRate);
    nextItem.totalPriceTaxExcl = nextItem.quantity * nextItem.unitPriceTaxExcl;
    nextItem.totalPriceTaxIncl = nextItem.quantity * nextItem.unitPriceTaxIncl;
  }

  // Check if unitPriceTaxIncl was changed and update totals accordingly
  const expectedUnitPriceTaxExcl = nextItem.unitPriceTaxIncl / (1 + taxRate);
  if (hasChanged(expectedUnitPriceTaxExcl, nextItem.unitPriceTaxExcl)) {
    // Unit price was changed, update tax-exclusive unit price and totals
    nextItem.unitPriceTaxExcl = nextItem.unitPriceTaxIncl / (1 + taxRate);
    nextItem.totalPriceTaxExcl = nextItem.quantity * nextItem.unitPriceTaxExcl;
    nextItem.totalPriceTaxIncl = nextItem.quantity * nextItem.unitPriceTaxIncl;
  }
}