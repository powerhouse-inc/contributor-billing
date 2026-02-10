import { createAction } from "document-model/core";
import {
  CreateInvoiceInputSchema,
  UpdateInvoiceStatusInputSchema,
  AddInvoiceLineItemInputSchema,
  RemoveInvoiceLineItemInputSchema,
  SetInvoiceTaxInputSchema,
  RecordInvoicePaymentInputSchema,
  SendInvoiceInputSchema,
  CancelInvoiceInputSchema,
  MarkInvoiceOverdueInputSchema,
  RefundInvoiceInputSchema,
} from "../schema/zod.js";
import type {
  CreateInvoiceInput,
  UpdateInvoiceStatusInput,
  AddInvoiceLineItemInput,
  RemoveInvoiceLineItemInput,
  SetInvoiceTaxInput,
  RecordInvoicePaymentInput,
  SendInvoiceInput,
  CancelInvoiceInput,
  MarkInvoiceOverdueInput,
  RefundInvoiceInput,
} from "../types.js";
import type {
  CreateInvoiceAction,
  UpdateInvoiceStatusAction,
  AddInvoiceLineItemAction,
  RemoveInvoiceLineItemAction,
  SetInvoiceTaxAction,
  RecordInvoicePaymentAction,
  SendInvoiceAction,
  CancelInvoiceAction,
  MarkInvoiceOverdueAction,
  RefundInvoiceAction,
} from "./actions.js";

export const createInvoice = (input: CreateInvoiceInput) =>
  createAction<CreateInvoiceAction>(
    "CREATE_INVOICE",
    { ...input },
    undefined,
    CreateInvoiceInputSchema,
    "global",
  );

export const updateInvoiceStatus = (input: UpdateInvoiceStatusInput) =>
  createAction<UpdateInvoiceStatusAction>(
    "UPDATE_INVOICE_STATUS",
    { ...input },
    undefined,
    UpdateInvoiceStatusInputSchema,
    "global",
  );

export const addInvoiceLineItem = (input: AddInvoiceLineItemInput) =>
  createAction<AddInvoiceLineItemAction>(
    "ADD_INVOICE_LINE_ITEM",
    { ...input },
    undefined,
    AddInvoiceLineItemInputSchema,
    "global",
  );

export const removeInvoiceLineItem = (input: RemoveInvoiceLineItemInput) =>
  createAction<RemoveInvoiceLineItemAction>(
    "REMOVE_INVOICE_LINE_ITEM",
    { ...input },
    undefined,
    RemoveInvoiceLineItemInputSchema,
    "global",
  );

export const setInvoiceTax = (input: SetInvoiceTaxInput) =>
  createAction<SetInvoiceTaxAction>(
    "SET_INVOICE_TAX",
    { ...input },
    undefined,
    SetInvoiceTaxInputSchema,
    "global",
  );

export const recordInvoicePayment = (input: RecordInvoicePaymentInput) =>
  createAction<RecordInvoicePaymentAction>(
    "RECORD_INVOICE_PAYMENT",
    { ...input },
    undefined,
    RecordInvoicePaymentInputSchema,
    "global",
  );

export const sendInvoice = (input: SendInvoiceInput) =>
  createAction<SendInvoiceAction>(
    "SEND_INVOICE",
    { ...input },
    undefined,
    SendInvoiceInputSchema,
    "global",
  );

export const cancelInvoice = (input: CancelInvoiceInput) =>
  createAction<CancelInvoiceAction>(
    "CANCEL_INVOICE",
    { ...input },
    undefined,
    CancelInvoiceInputSchema,
    "global",
  );

export const markInvoiceOverdue = (input: MarkInvoiceOverdueInput) =>
  createAction<MarkInvoiceOverdueAction>(
    "MARK_INVOICE_OVERDUE",
    { ...input },
    undefined,
    MarkInvoiceOverdueInputSchema,
    "global",
  );

export const refundInvoice = (input: RefundInvoiceInput) =>
  createAction<RefundInvoiceAction>(
    "REFUND_INVOICE",
    { ...input },
    undefined,
    RefundInvoiceInputSchema,
    "global",
  );
