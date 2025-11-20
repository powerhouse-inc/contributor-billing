/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { permittedTransitions } from "../../utils/statusTransitions.js";
import type { InvoiceTransitionsOperations } from "@powerhousedao/contributor-billing/document-models/invoice";

export const invoiceTransitionsOperations: InvoiceTransitionsOperations = {
  cancelOperation(state, action, dispatch) {
    if (permittedTransitions[state.status].includes('CANCELLED')) {
      state.status = 'CANCELLED';
    } else {
      throw new Error(`Invalid transition from ${state.status} to CANCELLED`);
    }
  },
  issueOperation(state, action, dispatch) {
    if (!action.input.invoiceNo || !action.input.dateIssued) {
      throw new Error('Invoice number and date issued are required');
    }
    if (permittedTransitions[state.status].includes('ISSUED')) {
      state.status = 'ISSUED';
      state.invoiceNo = action.input.invoiceNo;
      state.dateIssued = action.input.dateIssued;
    } else {
      throw new Error(`Invalid transition from ${state.status} to ISSUED`);
    }
  },
  resetOperation(state, action, dispatch) {
    if (permittedTransitions[state.status].includes('DRAFT')) {
      state.status = 'DRAFT';
    } else {
      throw new Error(`Invalid transition from ${state.status} to DRAFT`);
    }
  },
  rejectOperation(state, action, dispatch) {
    if (!action.input.id || !action.input.reason) {
      throw new Error('Reason, ID and final are required');
    }
    if (permittedTransitions[state.status].includes('REJECTED')) {
      state.status = 'REJECTED';
      const rejection = {
        id: action.input.id,
        reason: action.input.reason,
        final: action.input.final,
      }
      state.rejections.push(rejection);
    } else {
      throw new Error(`Invalid transition from ${state.status} to REJECTED`);
    }
  },
  acceptOperation(state, action, dispatch) {
    if(!action.input.payAfter) {
      throw new Error('Pay after is required');
    }
    if (permittedTransitions[state.status].includes('ACCEPTED')) {
      state.status = 'ACCEPTED';
      state.payAfter = action.input.payAfter;
    } else {
      throw new Error(`Invalid transition from ${state.status} to ACCEPTED`);
    }
  },
  reinstateOperation(state, action, dispatch) {
    const finalRejection = state.rejections.find(rejection => rejection.final === true);
    if (finalRejection) {
      throw new Error('Cannot reinstate an invoice that has been rejected');
    }
    if (permittedTransitions[state.status].includes('ISSUED')) {
      state.status = 'ISSUED';
    } else {
      throw new Error(`Invalid transition from ${state.status} to ISSUED`);
    }
  },
  schedulePaymentOperation(state, action, dispatch) {
    if (!action.input.id || !action.input.processorRef) {
      throw new Error('ID and processorRef are required');
    }
    if (permittedTransitions[state.status].includes('PAYMENTSCHEDULED')) {
      state.status = 'PAYMENTSCHEDULED';
      state.payments.push({
        id: action.input.id,
        processorRef: action.input.processorRef,
        paymentDate: '',
        txnRef: "",
        confirmed: false,
        issue: "",
        amount: 0,
      });
    } else {
      throw new Error(`Invalid transition from ${state.status} to PAYMENTSCHEDULED`);
    }
  },
  reapprovePaymentOperation(state, action, dispatch) {
    if (permittedTransitions[state.status].includes('ACCEPTED')) {
      state.status = 'ACCEPTED';
    } else {
      throw new Error(`Invalid transition from ${state.status} to ACCEPTED`);
    }
  },
  registerPaymentTxOperation(state, action, dispatch) {
    if(permittedTransitions[state.status].includes('PAYMENTSENT')) {
      state.status = 'PAYMENTSENT';
      const payment = state.payments.find(payment => payment.id === action.input.id);
      if(!payment) throw new Error('Payment not found');
      payment.txnRef = action.input.txRef;
      payment.paymentDate = action.input.timestamp;
    } else { 
      throw new Error(`Invalid transition from ${state.status} to PAYMENTSENT`);
    }
  },
  reportPaymentIssueOperation(state, action, dispatch) {
    if(!action.input.id || !action.input.issue) {
      throw new Error('ID and issue are required');
    }
    if(permittedTransitions[state.status].includes('PAYMENTISSUE')) {
      state.status = 'PAYMENTISSUE';
      const payment = state.payments.find(payment => payment.id === action.input.id);
      if(!payment) throw new Error('Payment not found');
      payment.issue = action.input.issue;
    } else {
      throw new Error(`Invalid transition from ${state.status} to PAYMENTISSUE`);
    }
  },
  confirmPaymentOperation(state, action, dispatch) {
    if(!action.input.id || !action.input.amount) {
      throw new Error('ID and amount are required');
    }
    if(permittedTransitions[state.status].includes('PAYMENTRECEIVED')) {
      state.status = 'PAYMENTRECEIVED';
      const payment = state.payments.find(payment => payment.id === action.input.id);
      if(!payment) throw new Error('Payment not found');
      payment.confirmed = true;
      payment.amount = action.input.amount;
    } else {
      throw new Error(`Invalid transition from ${state.status} to PAYMENTRECEIVED`);
    }
  },
  closePaymentOperation(state, action, dispatch) {
    if(!action.input.closureReason) {
      throw new Error('Closure reason is required');
    }
    if(permittedTransitions[state.status].includes('PAYMENTCLOSED')) {
      state.status = 'PAYMENTCLOSED';
      state.closureReason = action.input.closureReason;
    } else {
      throw new Error(`Invalid transition from ${state.status} to PAYMENTCLOSED`);
    }
  },
};
