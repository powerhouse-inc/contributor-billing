/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import type { InvoiceTransitionsOperations } from "../../gen/transitions/operations.js";

export const reducer: InvoiceTransitionsOperations = {
  cancelOperation(state, action, dispatch) {
    // TODO: Implement "cancelOperation" reducer
    throw new Error('Reducer "cancelOperation" not yet implemented');
  },
  issueOperation(state, action, dispatch) {
    // TODO: Implement "issueOperation" reducer
    throw new Error('Reducer "issueOperation" not yet implemented');
  },
  resetOperation(state, action, dispatch) {
    // TODO: Implement "resetOperation" reducer
    throw new Error('Reducer "resetOperation" not yet implemented');
  },
  rejectOperation(state, action, dispatch) {
    // TODO: Implement "rejectOperation" reducer
    throw new Error('Reducer "rejectOperation" not yet implemented');
  },
  acceptOperation(state, action, dispatch) {
    // TODO: Implement "acceptOperation" reducer
    throw new Error('Reducer "acceptOperation" not yet implemented');
  },
  reinstateOperation(state, action, dispatch) {
    // TODO: Implement "reinstateOperation" reducer
    throw new Error('Reducer "reinstateOperation" not yet implemented');
  },
  schedulePaymentOperation(state, action, dispatch) {
    // TODO: Implement "schedulePaymentOperation" reducer
    throw new Error('Reducer "schedulePaymentOperation" not yet implemented');
  },
  reapprovePaymentOperation(state, action, dispatch) {
    // TODO: Implement "reapprovePaymentOperation" reducer
    throw new Error('Reducer "reapprovePaymentOperation" not yet implemented');
  },
  registerPaymentTxOperation(state, action, dispatch) {
    // TODO: Implement "registerPaymentTxOperation" reducer
    throw new Error('Reducer "registerPaymentTxOperation" not yet implemented');
  },
  reportPaymentIssueOperation(state, action, dispatch) {
    // TODO: Implement "reportPaymentIssueOperation" reducer
    throw new Error(
      'Reducer "reportPaymentIssueOperation" not yet implemented',
    );
  },
  confirmPaymentOperation(state, action, dispatch) {
    // TODO: Implement "confirmPaymentOperation" reducer
    throw new Error('Reducer "confirmPaymentOperation" not yet implemented');
  },
  cancelPaymentOperation(state, action, dispatch) {
    // TODO: Implement "cancelPaymentOperation" reducer
    throw new Error('Reducer "cancelPaymentOperation" not yet implemented');
  },
};
