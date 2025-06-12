import type { EditorProps } from "document-model";
import {
  type BillingStatementDocument,
  actions,
} from "../../document-models/billing-statement/index.js";
import { CurrencyForm } from "../invoice/components/currencyForm.js";
import LineItems from "./components/lineItems.js";

export type IProps = EditorProps<BillingStatementDocument>;

export default function Editor(props: IProps) {
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
            handleInputChange={() => {}}
          />
        </div>
      </div>
      <div className="">
        <LineItems />
      </div>
    </div>
  );
}
