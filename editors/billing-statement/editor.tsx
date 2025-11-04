import { ChangeEvent, useState } from "react";
import type { EditorProps } from "document-model";
import {
  type BillingStatementDocument,
  BillingStatementState,
  actions,
} from "../../document-models/billing-statement/index.js";
import { CurrencyForm } from "../invoice/components/currencyForm.js";
import { Textarea } from "@powerhousedao/document-engineering";
import LineItemsTable from "./components/lineItemsTable.js";
import { formatNumber } from "../invoice/lineItems.js";
import { useSelectedBillingStatementDocument } from "../hooks/useBillingStatementDocument.js";

export type IProps = EditorProps;

export default function Editor(props: Partial<EditorProps> & { documentId?: string }) {
  const [doc, dispatch] = useSelectedBillingStatementDocument() as [
    BillingStatementDocument | undefined,
    React.Dispatch<any>,
  ];
  const state = doc?.state.global as BillingStatementState;

  if (!state) {
    console.log("Document state not found from document id", props.documentId);
    return null;
  }

  const [notes, setNotes] = useState(state.notes ?? "");

  return (
    <div className="editor-container">
      {/* Header */}
      <div className="grid grid-cols-2 gap-2 border border-gray-500 p-2 rounded-md bg-gray-1001">
        <div className="col-span-1 flex items-center">
          <h1 className="text-xl md:text-2xl font-bold">Billing Statement</h1>
        </div>
        <div className="grid col-span-1 grid-rows-2 gap-2 justify-end ">
          <div className="col-span-1 space-x-2">
            <span>Submitter</span>
            <span>{state.contributor}</span>
          </div>
          <div className="col-span-1 space-x-2">
            <span>Status</span>
            <span>{state.status}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mt-6 p-2">
        <div className="flex justify-end">
          <span className="mr-2 pt-2">Currency: </span>
          <CurrencyForm
            currency={state.currency}
            handleInputChange={(e: ChangeEvent<HTMLInputElement>) => {
              dispatch(
                actions.editBillingStatement({ currency: e.target.value })
              );
            }}
          />
        </div>
      </div>
      {/* Tables */}

      <div className="">
        <LineItemsTable state={state} dispatch={dispatch} />
      </div>
      {/* Text Area and Totals Table */}
      <div className="grid sm:grid-cols-2">
        <div className="mt-6 p-2 two-column-grid:mt-2">
          <Textarea
            label="Notes"
            placeholder="Add notes"
            autoExpand={true}
            rows={4}
            multiline={true}
            value={notes}
            onBlur={(e) => {
              const newValue = e.target.value;
              if (newValue !== state.notes) {
                dispatch(actions.editBillingStatement({ notes: newValue }));
              }
            }}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
            className="p-2 mb-4"
          />
        </div>
        <div className="p-2 flex justify-center items-center sm:mt-6">
          <table className="border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Total Fiat</th>
                <th className="border px-4 py-2">Total POWT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 text-center">
                  {formatNumber(state.totalCash)}
                </td>
                <td className="border px-4 py-2 text-center">
                  {formatNumber(state.totalPowt)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
