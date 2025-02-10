/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-bind */
import { useMemo } from "react";
import { EditorProps } from "document-model/document";
import {
  InvoiceState,
  InvoiceAction,
  InvoiceLineItem,
  InvoiceLocalState,
  actions,
  EditIssuerInput,
  EditIssuerBankInput,
  EditPayerInput,
  DeleteLineItemInput,
  Status,
  EditStatusInput,
  EditInvoiceInput,
  EditIssuerWalletInput,
} from "../../document-models/invoice";

import { DateTimeLocalInput } from "./dateTimeLocalInput";
import { LegalEntityForm } from "./legalEntity";
import { LineItemsTable } from "./lineItems";
import { loadUBLFile } from "./ingestUBL";
import RequestFinance from "./requestFinance";
import InvoiceToGnosis from "./invoiceToGnosis";

export default function Editor(
  props: EditorProps<InvoiceState, InvoiceAction, InvoiceLocalState>,
) {
  const { document, dispatch } = props;
  const state = document.state.global;
  console.log("State: ", state);

  const itemsTotalTaxExcl = useMemo(() => {
    return state.lineItems.reduce((total, lineItem) => {
      return total + lineItem.quantity * lineItem.unitPriceTaxExcl;
    }, 0.0);
  }, [state.lineItems]);

  const itemsTotalTaxIncl = useMemo(() => {
    return state.lineItems.reduce((total, lineItem) => {
      return total + lineItem.quantity * lineItem.unitPriceTaxIncl;
    }, 0.0);
  }, [state.lineItems]);

  function handleAddItem(newItem: InvoiceLineItem) {
    dispatch(actions.addLineItem(newItem));
  }

  function handleUpdateItem(updatedItem: InvoiceLineItem) {
    dispatch(actions.editLineItem(updatedItem));
  }

  function handleDeleteItem(input: DeleteLineItemInput) {
    dispatch(actions.deleteLineItem(input));
  }

  function handleUpdateDateIssued(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      actions.editInvoice({
        dateIssued: e.target.value,
      }),
    );
  }

  function handleUpdateDateDelivered(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      actions.editInvoice({
        dateDelivered: e.target.value,
      }),
    );
  }

  function handleUpdateDateDue(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      actions.editInvoice({
        dateDue: e.target.value,
      }),
    );
  }

  function handleUpdateInvoiceNo(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      actions.editInvoice({
        invoiceNo: e.target.value,
      }),
    );
  }

  function handleUpdateCurrency(input: EditInvoiceInput) {
    dispatch(actions.editInvoice(input));
  }

  function handleUpdateIssuerInfo(input: EditIssuerInput) {
    console.log("input: ", input);
    dispatch(actions.editIssuer(input));
  }

  function handleUpdateIssuerBank(input: EditIssuerBankInput) {
    dispatch(actions.editIssuerBank(input));
  }

  function handleUpdateIssuerWallet(input: EditIssuerWalletInput) {
    dispatch(actions.editIssuerWallet(input));
  }

  function handleUpdatePayerInfo(input: EditPayerInput) {
    dispatch(actions.editPayer(input));
  }

  function handleUpdateStatus(event: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = event.target.value;
    if (isValidStatus(newStatus)) {
      const input: EditStatusInput = {
        status: newStatus,
      };
      dispatch(actions.editStatus(input));
    }
  }

  function isValidStatus(status: string): status is Status {
    return ["DRAFT", "ISSUED", "ACCEPTED", "REJECTED", "PAID"].includes(status);
  }

  const getStatusStyle = (status: Status) => {
    const baseStyle = "px-4 py-2 rounded-full font-semibold text-sm";
    switch (status) {
      case "DRAFT":
        return `${baseStyle} bg-gray-200 text-gray-800`;
      case "ISSUED":
        return `${baseStyle} bg-blue-100 text-blue-800`;
      case "ACCEPTED":
        return `${baseStyle} bg-green-100 text-green-800`;
      case "REJECTED":
        return `${baseStyle} bg-red-100 text-red-800`;
      case "PAID":
        return `${baseStyle} bg-purple-100 text-purple-800`;
      default:
        return baseStyle;
    }
  };

  const STATUS_OPTIONS: Status[] = [
    "DRAFT",
    "ISSUED",
    "ACCEPTED",
    "REJECTED",
    "PAID",
  ];

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await loadUBLFile({ file, dispatch });
    } catch (error) {
      // Handle error presentation to user
      console.error("Failed to load UBL file:", error);
    }
  };

  const handleReset = () => {
    dispatch(actions.editStatus({ status: "DRAFT" }));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Invoice</h1>
          <div className="flex items-center">
            <label className="mr-2">Invoice No:</label>
            <input
              className="rounded-md border px-3 py-2"
              onChange={handleUpdateInvoiceNo}
              placeholder={new Date()
                .toISOString()
                .substring(0, 10)
                .replaceAll("-", "")}
              type="text"
              value={state.invoiceNo || ""}
            />
            <label className="mx-3 inline-flex cursor-pointer items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              Upload UBL
              <input
                accept=".xml"
                className="hidden"
                onChange={handleFileUpload}
                type="file"
              />
            </label>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className={getStatusStyle(state.status)}>{state.status}</span>
          <select
            className="rounded-md border bg-white px-3 py-2"
            onChange={handleUpdateStatus}
            value={state.status}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-8 flex justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Issuer</h3>

          <div className="flex gap-8">
            <div className="flex flex-col">
              <label className="mb-2">Issue Date:</label>
              <DateTimeLocalInput
                className="w-64"
                inputType="date"
                onChange={handleUpdateDateIssued}
                value={state.dateIssued}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2">Delivery Date:</label>
              <DateTimeLocalInput
                className="w-64"
                inputType="date"
                onChange={handleUpdateDateDelivered}
                value={state.dateDelivered || state.dateIssued}
              />
            </div>
          </div>

          <LegalEntityForm
            legalEntity={state.issuer}
            onChangeBank={handleUpdateIssuerBank}
            onChangeInfo={handleUpdateIssuerInfo}
            onChangeWallet={handleUpdateIssuerWallet}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Payer</h3>
          <label className="mr-2">Due Date:</label>
          <DateTimeLocalInput
            className="ml-2 w-64"
            inputType="date"
            onChange={handleUpdateDateDue}
            value={state.dateDue}
          />
          <LegalEntityForm
            bankDisabled
            legalEntity={state.payer}
            onChangeInfo={handleUpdatePayerInfo}
          />
        </div>
      </div>

      <LineItemsTable
        currency={state.currency}
        lineItems={state.lineItems}
        onAddItem={handleAddItem}
        onDeleteItem={handleDeleteItem}
        onUpdateCurrency={handleUpdateCurrency}
        onUpdateItem={handleUpdateItem}
      />

      {/* Totals */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal (excl. tax):</span>
            <span className="font-medium">
              {itemsTotalTaxExcl.toFixed(2)} {state.currency}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold text-gray-900">
            <span>Total (incl. tax):</span>
            <span>
              {itemsTotalTaxIncl.toFixed(2)} {state.currency}
            </span>
          </div>
        </div>
      </div>
      {state.status === "ACCEPTED" ? (
        state.currency === "USDS" ? (
          state.issuer.paymentRouting?.wallet?.chainName === "base" ? (
            <div>
              <br />
              <InvoiceToGnosis docState={state} />
            </div>
          ) : (
            <div>
              <br />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg relative">
                  <button
                    className="absolute top-2 right-2 text-white"
                    onClick={handleReset}
                  >
                    &times;
                  </button>
                  <h1>Use 'base' chain name instead</h1>
                </div>
              </div>
            </div>
          )
        ) : (
          <div>
            <br />
            <RequestFinance docState={state} />
          </div>
        )
      ) : null}
      {/* JSON representation of the state */}
      {/* <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-xl font-semibold">State JSON</h3>
        <pre className="whitespace-pre-wrap break-words text-sm text-gray-600">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div> */}
    </div>
  );
}
