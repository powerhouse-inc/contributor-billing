import type { Action } from "document-model";
import type {
  EditIssuerInput,
  EditIssuerBankInput,
  EditIssuerWalletInput,
  EditPayerInput,
  EditPayerBankInput,
  EditPayerWalletInput,
} from "../types.js";

export type EditIssuerAction = Action & {
  type: "EDIT_ISSUER";
  input: EditIssuerInput;
};
export type EditIssuerBankAction = Action & {
  type: "EDIT_ISSUER_BANK";
  input: EditIssuerBankInput;
};
export type EditIssuerWalletAction = Action & {
  type: "EDIT_ISSUER_WALLET";
  input: EditIssuerWalletInput;
};
export type EditPayerAction = Action & {
  type: "EDIT_PAYER";
  input: EditPayerInput;
};
export type EditPayerBankAction = Action & {
  type: "EDIT_PAYER_BANK";
  input: EditPayerBankInput;
};
export type EditPayerWalletAction = Action & {
  type: "EDIT_PAYER_WALLET";
  input: EditPayerWalletInput;
};

export type InvoicePartiesAction =
  | EditIssuerAction
  | EditIssuerBankAction
  | EditIssuerWalletAction
  | EditPayerAction
  | EditPayerBankAction
  | EditPayerWalletAction;
