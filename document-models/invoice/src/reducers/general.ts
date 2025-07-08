/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import type { InvoiceGeneralOperations } from "../../gen/general/operations.js";

export const reducer: InvoiceGeneralOperations = {
  editInvoiceOperation(state, action, dispatch) {
    try {
      const newState = { ...state };

      newState.currency = action.input.currency ?? state.currency;
      newState.dateDue = action.input.dateDue ?? state.dateDue;
      newState.dateIssued = action.input.dateIssued ?? state.dateIssued;
      newState.invoiceNo = action.input.invoiceNo ?? state.invoiceNo;
      newState.notes = action.input.notes ?? state.notes;

      state = Object.assign(state, newState);
    } catch (e) {
      console.error(e);
    }
  },
  editStatusOperation(state, action, dispatch) {
    try {
      state.status = action.input.status;
    } catch (e) {
      console.error(e);
    }
  },
  addRefOperation(state, action, dispatch) {
    try {
     
    } catch (e) {
      console.error(e);
    }
  },
  editRefOperation(state, action, dispatch) {
    try {
     
    } catch (e) {
      console.error(e);
    }
  },
  deleteRefOperation(state, action, dispatch) {
    try {
      
    } catch (e) {
      console.error(e);
    }
  },
  editPaymentDataOperation(state, action, dispatch) {
    try {
      if(!action.input.paymentDate || !action.input.txnHash) throw new Error("No input.paymentDate or input.txnHash");
      // TODO
    } catch (e) {
      console.error(e);
    }
  },
  setExportedDataOperation(state, action, dispatch) {
    try {
      //TODO
    } catch (e) {
      console.error(e);
    }
  }
};
