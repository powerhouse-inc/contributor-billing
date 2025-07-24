import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { type InvoiceDocument, z } from "./types.js";

import { reducer as GeneralReducer } from "../src/reducers/general.js";
import { reducer as PartiesReducer } from "../src/reducers/parties.js";
import { reducer as ItemsReducer } from "../src/reducers/items.js";
import { reducer as TransitionsReducer } from "../src/reducers/transitions.js";

const stateReducer: StateReducer<InvoiceDocument> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "EDIT_INVOICE":
      z.EditInvoiceInputSchema().parse(action.input);
      GeneralReducer.editInvoiceOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "EDIT_STATUS":
      z.EditStatusInputSchema().parse(action.input);
      GeneralReducer.editStatusOperation(state[action.scope], action, dispatch);
      break;

    case "EDIT_PAYMENT_DATA":
      z.EditPaymentDataInputSchema().parse(action.input);
      GeneralReducer.editPaymentDataOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "SET_EXPORTED_DATA":
      z.SetExportedDataInputSchema().parse(action.input);
      GeneralReducer.setExportedDataOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "ADD_PAYMENT":
      z.AddPaymentInputSchema().parse(action.input);
      GeneralReducer.addPaymentOperation(state[action.scope], action, dispatch);
      break;

    case "EDIT_ISSUER":
      z.EditIssuerInputSchema().parse(action.input);
      PartiesReducer.editIssuerOperation(state[action.scope], action, dispatch);
      break;

    case "EDIT_ISSUER_BANK":
      z.EditIssuerBankInputSchema().parse(action.input);
      PartiesReducer.editIssuerBankOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "EDIT_ISSUER_WALLET":
      z.EditIssuerWalletInputSchema().parse(action.input);
      PartiesReducer.editIssuerWalletOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "EDIT_PAYER":
      z.EditPayerInputSchema().parse(action.input);
      PartiesReducer.editPayerOperation(state[action.scope], action, dispatch);
      break;

    case "EDIT_PAYER_BANK":
      z.EditPayerBankInputSchema().parse(action.input);
      PartiesReducer.editPayerBankOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "EDIT_PAYER_WALLET":
      z.EditPayerWalletInputSchema().parse(action.input);
      PartiesReducer.editPayerWalletOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "ADD_LINE_ITEM":
      z.AddLineItemInputSchema().parse(action.input);
      ItemsReducer.addLineItemOperation(state[action.scope], action, dispatch);
      break;

    case "EDIT_LINE_ITEM":
      z.EditLineItemInputSchema().parse(action.input);
      ItemsReducer.editLineItemOperation(state[action.scope], action, dispatch);
      break;

    case "DELETE_LINE_ITEM":
      z.DeleteLineItemInputSchema().parse(action.input);
      ItemsReducer.deleteLineItemOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "SET_LINE_ITEM_TAG":
      z.SetLineItemTagInputSchema().parse(action.input);
      ItemsReducer.setLineItemTagOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "SET_INVOICE_TAG":
      z.SetInvoiceTagInputSchema().parse(action.input);
      ItemsReducer.setInvoiceTagOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "CANCEL":
      z.CancelInputSchema().parse(action.input);
      TransitionsReducer.cancelOperation(state[action.scope], action, dispatch);
      break;

    case "ISSUE":
      z.IssueInputSchema().parse(action.input);
      TransitionsReducer.issueOperation(state[action.scope], action, dispatch);
      break;

    case "RESET":
      z.ResetInputSchema().parse(action.input);
      TransitionsReducer.resetOperation(state[action.scope], action, dispatch);
      break;

    case "REJECT":
      z.RejectInputSchema().parse(action.input);
      TransitionsReducer.rejectOperation(state[action.scope], action, dispatch);
      break;

    case "ACCEPT":
      z.AcceptInputSchema().parse(action.input);
      TransitionsReducer.acceptOperation(state[action.scope], action, dispatch);
      break;

    case "REINSTATE":
      z.ReinstateInputSchema().parse(action.input);
      TransitionsReducer.reinstateOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "SCHEDULE_PAYMENT":
      z.SchedulePaymentInputSchema().parse(action.input);
      TransitionsReducer.schedulePaymentOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "REAPPROVE_PAYMENT":
      z.ReapprovePaymentInputSchema().parse(action.input);
      TransitionsReducer.reapprovePaymentOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "REGISTER_PAYMENT_TX":
      z.RegisterPaymentTxInputSchema().parse(action.input);
      TransitionsReducer.registerPaymentTxOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "REPORT_PAYMENT_ISSUE":
      z.ReportPaymentIssueInputSchema().parse(action.input);
      TransitionsReducer.reportPaymentIssueOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "CONFIRM_PAYMENT":
      z.ConfirmPaymentInputSchema().parse(action.input);
      TransitionsReducer.confirmPaymentOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "CLOSE_PAYMENT":
      z.ClosePaymentInputSchema().parse(action.input);
      TransitionsReducer.closePaymentOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<InvoiceDocument>(stateReducer);
