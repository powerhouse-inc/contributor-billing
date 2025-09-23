import { ChangeEvent, useState } from "react";
import type { EditorProps } from "document-model";
import {
  type BillingStatementDocument,
  actions,
} from "../../document-models/billing-statement/index.js";
import { CurrencyForm } from "../invoice/components/currencyForm.js";
import { Textarea } from "@powerhousedao/document-engineering";
import LineItemsTable from "./components/lineItemsTable.js";
import { formatNumber } from "../invoice/lineItems.js";
import { useSelectedDocument } from "@powerhousedao/reactor-browser";

export type IProps = EditorProps;

export default function Editor(props: any) {
  let dispatch: any;
  const { document } = props;
  if (props?.dispatch) {
    dispatch = props.dispatch;
  } else {
    const selectedDocument = useSelectedDocument();
    dispatch = selectedDocument[1];
  }
  const state = document.state.global;

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
            currency={props.document.state.global.currency}
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
      {/* <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md text-xs"
        onClick={() => {
          dispatch(
            actions.addLineItem({
              id: generateId(),
              description: "Dummy Line Item",
              quantity: 5,
              unit: "HOUR",
              unitPriceCash: 2,
              unitPricePwt: 1,
              totalPriceCash: 5 * 2,
              totalPricePwt: 5 * 1,
            })
          );
        }}
      >
        Add Dummy Line Item
      </button> */}
      {/* Text Area and Totals Table */}
      <div className="grid sm:grid-cols-2">
        <div className="mt-6 p-2 two-column-grid:mt-2">
          <Textarea
            label="Notes"
            placeholder="Add notes"
            autoExpand={false}
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
