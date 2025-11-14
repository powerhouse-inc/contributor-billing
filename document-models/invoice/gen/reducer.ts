// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { InvoicePHState } from "./types.js";
import { z } from "./types.js";

import { reducer as GeneralReducer } from "../src/reducers/general.js";
import { reducer as PartiesReducer } from "../src/reducers/parties.js";
import { reducer as ItemsReducer } from "../src/reducers/items.js";
import { reducer as TransitionsReducer } from "../src/reducers/transitions.js";

export const stateReducer: StateReducer<InvoicePHState> = (
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
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_STATUS":
      z.EditStatusInputSchema().parse(action.input);
      GeneralReducer.editStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_PAYMENT_DATA":
      z.EditPaymentDataInputSchema().parse(action.input);
      GeneralReducer.editPaymentDataOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_EXPORTED_DATA":
      z.SetExportedDataInputSchema().parse(action.input);
      GeneralReducer.setExportedDataOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_PAYMENT":
      z.AddPaymentInputSchema().parse(action.input);
      GeneralReducer.addPaymentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_ISSUER":
      z.EditIssuerInputSchema().parse(action.input);
      PartiesReducer.editIssuerOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_ISSUER_BANK":
      z.EditIssuerBankInputSchema().parse(action.input);
      PartiesReducer.editIssuerBankOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_ISSUER_WALLET":
      z.EditIssuerWalletInputSchema().parse(action.input);
      PartiesReducer.editIssuerWalletOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_PAYER":
      z.EditPayerInputSchema().parse(action.input);
      PartiesReducer.editPayerOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_PAYER_BANK":
      z.EditPayerBankInputSchema().parse(action.input);
      PartiesReducer.editPayerBankOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_PAYER_WALLET":
      z.EditPayerWalletInputSchema().parse(action.input);
      PartiesReducer.editPayerWalletOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_LINE_ITEM":
      z.AddLineItemInputSchema().parse(action.input);
      ItemsReducer.addLineItemOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_LINE_ITEM":
      z.EditLineItemInputSchema().parse(action.input);
      ItemsReducer.editLineItemOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_LINE_ITEM":
      z.DeleteLineItemInputSchema().parse(action.input);
      ItemsReducer.deleteLineItemOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_LINE_ITEM_TAG":
      z.SetLineItemTagInputSchema().parse(action.input);
      ItemsReducer.setLineItemTagOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_INVOICE_TAG":
      z.SetInvoiceTagInputSchema().parse(action.input);
      ItemsReducer.setInvoiceTagOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "CANCEL":
      z.CancelInputSchema().parse(action.input);
      TransitionsReducer.cancelOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ISSUE":
      z.IssueInputSchema().parse(action.input);
      TransitionsReducer.issueOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "RESET":
      z.ResetInputSchema().parse(action.input);
      TransitionsReducer.resetOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REJECT":
      z.RejectInputSchema().parse(action.input);
      TransitionsReducer.rejectOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ACCEPT":
      z.AcceptInputSchema().parse(action.input);
      TransitionsReducer.acceptOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REINSTATE":
      z.ReinstateInputSchema().parse(action.input);
      TransitionsReducer.reinstateOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SCHEDULE_PAYMENT":
      z.SchedulePaymentInputSchema().parse(action.input);
      TransitionsReducer.schedulePaymentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REAPPROVE_PAYMENT":
      z.ReapprovePaymentInputSchema().parse(action.input);
      TransitionsReducer.reapprovePaymentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REGISTER_PAYMENT_TX":
      z.RegisterPaymentTxInputSchema().parse(action.input);
      TransitionsReducer.registerPaymentTxOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REPORT_PAYMENT_ISSUE":
      z.ReportPaymentIssueInputSchema().parse(action.input);
      TransitionsReducer.reportPaymentIssueOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "CONFIRM_PAYMENT":
      z.ConfirmPaymentInputSchema().parse(action.input);
      TransitionsReducer.confirmPaymentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "CLOSE_PAYMENT":
      z.ClosePaymentInputSchema().parse(action.input);
      TransitionsReducer.closePaymentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<InvoicePHState>(stateReducer);
