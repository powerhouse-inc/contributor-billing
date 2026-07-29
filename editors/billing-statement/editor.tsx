import { useState } from "react";
import type { EditorProps } from "document-model";
import {
  type BillingStatementDocument,
  type BillingStatementState,
  actions,
} from "../../document-models/billing-statement/index.js";
import { Textarea, Select } from "@powerhousedao/document-engineering";
import LineItemsTable from "./components/lineItemsTable.js";
import { formatNumber } from "../shared/formatNumber.js";
import { useSelectedBillingStatementDocument } from "../../document-models/billing-statement/v1/hooks.js";
import { DocumentToolbar } from "@powerhousedao/design-system/connect";

export type IProps = EditorProps;

export const currencyList = [
  { ticker: "USDS", crypto: true },
  { ticker: "USDC", crypto: true },
  { ticker: "DAI", crypto: true },
  { ticker: "EURC", crypto: true },
  { ticker: "EURE", crypto: true },
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

  if (!state) {
    console.log("Document state not found from document id", props.documentId);
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-primary/10 to-background">
      <DocumentToolbar document={doc} />

      <div className="w-full">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {/* Header */}
            <div className="border-b border-border bg-gradient-to-r from-background to-primary/10 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-light tracking-tight text-foreground">
                    Billing Statement
                  </h1>
                </div>

                <div className="flex items-center gap-10">
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Submitter
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {state.contributor}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </div>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {String(state.status || "—")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-8">
              <div className="flex items-center justify-between rounded-2xl border border-border bg-muted px-5 py-4">
                <div className="text-sm text-muted-foreground">
                  Keep edits lightweight: double‑click a row to edit, click
                  outside to auto‑save.
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Currency
                  </span>
                  <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
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
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
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
                  <div className="mt-3 text-xs text-muted-foreground">
                    Tip: notes are saved by clicking outside of the textarea or
                    pressing tab.
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-baseline justify-between">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Totals
                    </div>
                    <div className="text-xs text-muted-foreground">read‑only</div>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-xl border border-border">
                    <table className="w-full border-collapse">
                      <thead className="bg-gradient-to-r from-background to-primary/10">
                        <tr>
                          <th className="border-b border-border px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Total Fiat
                          </th>
                          <th className="border-b border-border px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Total POWT
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card">
                        <tr>
                          <td className="border-t border-border px-5 py-4 font-mono text-base tabular-nums text-foreground">
                            {formatNumber(state.totalCash)}
                          </td>
                          <td className="border-t border-border px-5 py-4 font-mono text-base tabular-nums text-foreground">
                            {formatNumber(state.totalPowt)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Totals update from line items.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
