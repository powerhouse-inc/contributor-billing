import { ChangeEvent, useState } from "react";
import type { EditorProps } from "document-model";
import {
  type BillingStatementDocument,
  actions,
} from "../../document-models/billing-statement/index.js";
import { generateId } from "document-model";
import { CurrencyForm } from "../invoice/components/currencyForm.js";
import { Textarea } from "@powerhousedao/document-engineering";
import ObjectSetTableComponent from "./components/objectSetTable.js";

export type IProps = EditorProps<BillingStatementDocument>;

export default function Editor(props: IProps) {
  const { document: doc, dispatch } = props;
  const state = doc.state.global;
  // console.log("global state", state);

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
            <span>1234567890</span>
          </div>
          <div className="col-span-1 space-x-2">
            <span>Status</span>
            <span>status here</span>
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
              dispatch(actions.editBillingStatement({ currency: e.target.value }));
            }}
          />
        </div>
      </div>
      <div className="">
        <ObjectSetTableComponent state={state} dispatch={dispatch} />
      </div>
      <button
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
        </button>
      <div className="mt-6 p-2">
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
    </div>
  );
}
