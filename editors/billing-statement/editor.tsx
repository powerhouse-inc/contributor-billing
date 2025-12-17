import { type ChangeEvent, useState } from "react";
import type { EditorProps } from "document-model";
import {
  type BillingStatementDocument,
  type BillingStatementState,
  actions,
} from "../../document-models/billing-statement/index.js";
import { CurrencyForm } from "../invoice/components/currencyForm.js";
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
    <div className="min-h-screen w-full bg-white text-[#14120f]">
      <DocumentToolbar document={doc} onClose={handleClose} />

      <div className="w-full bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white text-[#14120f] shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
            {/* Header */}
            <div className="border-b border-black/10 bg-[#efe8da] px-6 py-5 text-[#14120f]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                  <h1 className="font-serif text-2xl tracking-tight sm:text-3xl">
                    Billing Statement
                  </h1>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-right">
                  <div className="text-black/60">Submitter</div>
                  <div className="font-semibold text-black/90">
                    {state.contributor}
                  </div>
                  <div className="text-black/60">Status</div>
                  <div className="flex justify-start sm:justify-end">
                    <span className="inline-flex items-center rounded-full border border-black/15 bg-black/5 px-3 py-1 text-xs font-semibold tracking-wide text-black/80">
                      {String(state.status || "—")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <div className="flex flex-col gap-3 rounded-xl border border-black/10 bg-[#efe8da] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-black/60">
                  Keep edits lightweight: double‑click a row to edit, click
                  outside to auto‑save.
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="text-xs font-semibold tracking-wide text-black/60">
                    CURRENCY
                  </span>
                  <div className="rounded-lg border border-black/10 px-2 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
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

              {/* Tables */}
              <div className="mt-6">
                <LineItemsTable state={state} dispatch={dispatch} />
              </div>

              {/* Notes + Totals */}
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-black/10 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
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
                        dispatch(
                          actions.editBillingStatement({ notes: newValue }),
                        );
                      }
                    }}
                    onChange={(e) => {
                      setNotes(e.target.value);
                    }}
                    className="p-2"
                  />
                  <div className="mt-2 text-xs text-black/50">
                    Tip: notes are saved by clicking outside of the textarea or
                    pressing tab.
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <div className="flex items-baseline justify-between">
                    <div className="text-xs font-semibold tracking-[0.24em] text-black/60">
                      TOTALS
                    </div>
                    <div className="text-xs text-black/40">read‑only</div>
                  </div>
                  <div className="mt-3 overflow-hidden rounded-lg border border-black/10">
                    <table className="w-full border-collapse">
                      <thead className="bg-[#efe8da] text-[#14120f]">
                        <tr>
                          <th className="border-b border-black/10 px-4 py-3 text-left text-xs font-semibold tracking-wide text-black/70">
                            Total Fiat
                          </th>
                          <th className="border-b border-black/10 px-4 py-3 text-left text-xs font-semibold tracking-wide text-black/70">
                            Total POWT
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#fbf8f1]">
                        <tr>
                          <td className="border-t border-black/10 px-4 py-4 font-mono text-sm tabular-nums text-black/90">
                            {formatNumber(state.totalCash)}
                          </td>
                          <td className="border-t border-black/10 px-4 py-4 font-mono text-sm tabular-nums text-black/90">
                            {formatNumber(state.totalPowt)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 text-xs text-black/50">
                    Totals update from line items.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-black/40">
            This view is a styled editor shell — your document operations remain
            unchanged.
          </div>
        </div>
      </div>
    </div>
  );
}
