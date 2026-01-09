import { useState } from "react";
import type { EditorProps } from "document-model";
import {
  type BillingStatementDocument,
  type BillingStatementState,
  actions,
} from "../../document-models/billing-statement/index.js";
import { Textarea, Select } from "@powerhousedao/document-engineering";
import LineItemsTable from "./components/lineItemsTable.js";
import { formatNumber } from "../invoice/lineItems.js";
import { useSelectedBillingStatementDocument } from "../../document-models/billing-statement/hooks.js";
import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import {
  setSelectedNode,
  useParentFolderForSelectedNode,
} from "@powerhousedao/reactor-browser";

export type IProps = EditorProps;

export const currencyList = [
  { ticker: "USDS", crypto: true },
  { ticker: "USDC", crypto: true },
  { ticker: "DAI", crypto: true },
  { ticker: "USD", crypto: false },
  { ticker: "EUR", crypto: false },
  { ticker: "DKK", crypto: false },
  { ticker: "GBP", crypto: false },
  { ticker: "JPY", crypto: false },
  { ticker: "CNY", crypto: false },
  { ticker: "CHF", crypto: false },
];

export default function Editor(
  props: Partial<EditorProps> & { documentId?: string },
) {
  const [doc, dispatch] = useSelectedBillingStatementDocument() as [
    BillingStatementDocument | undefined,
    React.Dispatch<any>,
  ];
  const state = doc?.state.global as BillingStatementState;

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [notes, setNotes] = useState(state?.notes ?? "");

  // Get the parent folder node for the currently selected node
  const parentFolder = useParentFolderForSelectedNode();

  if (!state) {
    console.log("Document state not found from document id", props.documentId);
    return null;
  }

  // Set the selected node to the parent folder node (close the editor)
  function handleClose() {
    setSelectedNode(parentFolder);
  }

  return (
    <div>
      <DocumentToolbar document={doc} onClose={handleClose} />
      <div className="ph-default-styles flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900">
        {/* Main Content */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Billing Statement
                  </h1>
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Submitter:</span>
                      <span className="text-gray-900 dark:text-white">
                        {state.contributor || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {String(state.status || "—")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Currency:</span>
                      <Select
                        className="w-28"
                        options={currencyList.map((currency) => ({
                          value: currency.ticker,
                          label: currency.ticker,
                        }))}
                        value={state.currency}
                        onChange={(value) => {
                          dispatch(
                            actions.editBillingStatement({
                              currency: value as string,
                            }),
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Line Items Section */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Line Items
                </h2>
              </div>
              <div className="p-6">
                <LineItemsTable state={state} dispatch={dispatch} />
              </div>
            </section>

            {/* Notes and Totals Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Notes */}
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Notes
                  </h2>
                </div>
                <div className="p-6">
                  <Textarea
                    placeholder="Add notes here..."
                    autoExpand={true}
                    rows={4}
                    multiline={true}
                    value={notes}
                    onBlur={(e) => {
                      const newValue = e.target.value;
                      if (newValue !== state.notes) {
                        dispatch(
                          actions.editBillingStatement({ notes: newValue }),
                        );
                      }
                    }}
                    onChange={(e) => {
                      setNotes(e.target.value);
                    }}
                    className="w-full"
                  />
                </div>
              </section>

              {/* Totals */}
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Totals
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Fiat
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatNumber(state.totalCash)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total POWT
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatNumber(state.totalPowt)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
