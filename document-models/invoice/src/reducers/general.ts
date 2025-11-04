/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import type { InvoiceGeneralOperations } from "../../gen/general/operations.js";

export const reducer: InvoiceGeneralOperations = {
  editInvoiceOperation(state, action, dispatch) {
    const newState = { ...state };

    newState.currency = action.input.currency ?? state.currency;
    newState.dateDue = action.input.dateDue ?? state.dateDue;
    newState.dateIssued = action.input.dateIssued ?? state.dateIssued;
    newState.dateDelivered = action.input.dateDelivered ?? state.dateDelivered;
    newState.invoiceNo = action.input.invoiceNo ?? state.invoiceNo;
    newState.notes = action.input.notes ?? state.notes;

    state = Object.assign(state, newState);

  },
  editStatusOperation(state, action, dispatch) {
    state.status = action.input.status;

  },
  editPaymentDataOperation(state, action, dispatch) {
    const payment = state.payments.find(
      (payment) => payment.id === action.input.id
    );
    if (payment) {
      payment.processorRef = action.input.processorRef ?? payment.processorRef;
      payment.paymentDate = action.input.paymentDate ?? payment.paymentDate;
      payment.txnRef = action.input.txnRef ?? payment.txnRef;
      payment.confirmed = action.input.confirmed ?? payment.confirmed;
      payment.issue = action.input.issue ?? payment.issue;
    }

  },
  addPaymentOperation(state, action, dispatch) {
    const payment = {
      id: action.input.id,
      processorRef: action.input.processorRef ?? "",
      paymentDate: action.input.paymentDate ?? "",
      txnRef: action.input.txnRef ?? "",
      confirmed: action.input.confirmed ?? false,
      issue: action.input.issue ?? "",
      amount: 0,
    };
    state.payments.push(payment);
  },
  setExportedDataOperation(state, action, dispatch) {
    const exportedData = {
      timestamp: action.input.timestamp,
      exportedLineItems: action.input.exportedLineItems,
    };
    state.exported = exportedData;

  }
};
