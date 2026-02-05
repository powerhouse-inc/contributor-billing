import { useState } from "react";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  SubscriptionInstanceAction,
  SubscriptionInstanceDocument,
} from "@powerhousedao/contributor-billing/document-models/subscription-instance";
import type { Invoice } from "../../../document-models/subscription-instance/gen/schema/types.js";
import type { ViewMode } from "../types.js";
import { StatusBadge } from "./StatusBadge.js";
import { RecordPaymentModal } from "./RecordPaymentModal.js";

// Note: setInvoicePaymentUrl and paymentUrl on Invoice have been removed from the schema.
// Payment URL functionality is disabled until re-implemented.

interface BillingPanelProps {
  document: SubscriptionInstanceDocument;
  dispatch: DocumentDispatch<SubscriptionInstanceAction>;
  mode: ViewMode;
}

interface InvoiceRowProps {
  invoice: Invoice;
  mode: ViewMode;
  onRecordPayment: (invoice: Invoice) => void;
}

function InvoiceRow({ invoice, mode, onRecordPayment }: InvoiceRowProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  const amountDue = Math.max(0, invoice.total - totalPaid);
  const canRecordPayment =
    mode === "operator" &&
    invoice.status !== "PAID" &&
    invoice.status !== "CANCELLED" &&
    invoice.status !== "REFUNDED" &&
    amountDue > 0;

  return (
    <div className="si-invoice-row">
      <div className="si-invoice-row__main">
        <div className="si-invoice-row__id">
          <span className="si-invoice-row__number">
            {invoice.invoiceNumber}
          </span>
          <StatusBadge status={invoice.status} size="sm" />
        </div>
        <div className="si-invoice-row__period">
          {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
        </div>
      </div>

      <div className="si-invoice-row__amounts">
        <div className="si-invoice-row__total">
          {formatCurrency(invoice.total, invoice.currency)}
        </div>
        {invoice.status !== "PAID" &&
          invoice.status !== "CANCELLED" &&
          amountDue > 0 && (
            <div className="si-invoice-row__due">
              {formatCurrency(amountDue, invoice.currency)} due
            </div>
          )}
      </div>

      <div className="si-invoice-row__meta">
        <span className="si-invoice-row__date">
          {invoice.status === "PAID" && invoice.paidDate
            ? `Paid ${formatDate(invoice.paidDate)}`
            : `Due ${formatDate(invoice.dueDate)}`}
        </span>
        {mode === "operator" && invoice.lineItems.length > 0 && (
          <span className="si-invoice-row__items">
            {invoice.lineItems.length} item
            {invoice.lineItems.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="si-invoice-row__actions">
        {/* Operator Record Payment Button */}
        {canRecordPayment && (
          <button
            type="button"
            className="si-btn si-btn--sm si-btn--success"
            onClick={() => onRecordPayment(invoice)}
          >
            <svg
              className="si-btn__icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Record Payment
          </button>
        )}
      </div>
    </div>
  );
}

function BillingSummary({
  document,
  mode,
}: {
  document: SubscriptionInstanceDocument;
  mode: ViewMode;
}) {
  const state = document.state.global;
  const invoices = state.invoices;

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.reduce(
    (sum, inv) => sum + inv.payments.reduce((pSum, p) => pSum + p.amount, 0),
    0,
  );
  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "PAID" && inv.status !== "CANCELLED")
    .reduce(
      (sum, inv) =>
        sum + inv.total - inv.payments.reduce((pSum, p) => pSum + p.amount, 0),
      0,
    );

  const overdueCount = invoices.filter(
    (inv) => inv.status === "OVERDUE",
  ).length;

  // Get currency from first invoice or default
  const currency = invoices[0]?.currency || "USD";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <div className="si-billing-summary">
      {mode === "operator" && (
        <div className="si-billing-summary__item">
          <span className="si-billing-summary__label">Total Billed</span>
          <span className="si-billing-summary__value">
            {formatCurrency(totalBilled)}
          </span>
        </div>
      )}
      <div className="si-billing-summary__item">
        <span className="si-billing-summary__label">Total Paid</span>
        <span className="si-billing-summary__value si-billing-summary__value--success">
          {formatCurrency(totalPaid)}
        </span>
      </div>
      <div className="si-billing-summary__item">
        <span className="si-billing-summary__label">Outstanding</span>
        <span
          className={`si-billing-summary__value ${totalOutstanding > 0 ? "si-billing-summary__value--warning" : ""}`}
        >
          {formatCurrency(totalOutstanding)}
        </span>
      </div>
      {mode === "operator" && overdueCount > 0 && (
        <div className="si-billing-summary__item si-billing-summary__item--alert">
          <span className="si-billing-summary__label">Overdue</span>
          <span className="si-billing-summary__value si-billing-summary__value--danger">
            {overdueCount} invoice{overdueCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

export function BillingPanel({ document, dispatch, mode }: BillingPanelProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const invoices = document.state.global.invoices;

  // Sort invoices: most recent first
  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
  );

  // Client view: show only their relevant invoices (not draft)
  // Operator view: show all
  const visibleInvoices =
    mode === "client"
      ? sortedInvoices.filter((inv) => inv.status !== "DRAFT")
      : sortedInvoices;

  return (
    <>
      <div className="si-panel">
        <div className="si-panel__header">
          <h3 className="si-panel__title">Billing & Invoices</h3>
          <span className="si-panel__count">
            {visibleInvoices.length} invoice
            {visibleInvoices.length !== 1 ? "s" : ""}
          </span>
        </div>

        {invoices.length > 0 && (
          <BillingSummary document={document} mode={mode} />
        )}

        {visibleInvoices.length === 0 ? (
          <div className="si-empty">
            <svg
              className="si-empty__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
              />
            </svg>
            <p className="si-empty__text">No invoices yet</p>
          </div>
        ) : (
          <div className="si-invoices-list">
            {visibleInvoices.map((invoice) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                mode={mode}
                onRecordPayment={setSelectedInvoice}
              />
            ))}
          </div>
        )}
      </div>

      {selectedInvoice && (
        <RecordPaymentModal
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
          document={document}
          dispatch={dispatch}
          invoice={selectedInvoice}
        />
      )}
    </>
  );
}
