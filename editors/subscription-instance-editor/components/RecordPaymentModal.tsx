import { useState, useCallback } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  SubscriptionInstanceAction,
  SubscriptionInstanceDocument,
} from "@powerhousedao/contributor-billing/document-models/subscription-instance";
import type {
  Invoice,
  PaymentMethod,
} from "../../../document-models/subscription-instance/gen/schema/types.js";
import { recordInvoicePayment } from "../../../document-models/subscription-instance/gen/billing/creators.js";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: SubscriptionInstanceDocument;
  dispatch: DocumentDispatch<SubscriptionInstanceAction>;
  invoice: Invoice;
}

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "PAYPAL", label: "PayPal" },
  { value: "CRYPTO", label: "Cryptocurrency" },
  { value: "OTHER", label: "Other" },
];

export function RecordPaymentModal({
  isOpen,
  onClose,
  dispatch,
  invoice,
}: RecordPaymentModalProps) {
  const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  const amountDue = Math.max(0, invoice.total - totalPaid);

  const [amount, setAmount] = useState(amountDue.toString());
  const [method, setMethod] = useState<PaymentMethod>("CREDIT_CARD");
  const [reference, setReference] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) return;

      dispatch(
        recordInvoicePayment({
          invoiceId: invoice.id,
          paymentId: generateId(),
          amount: parsedAmount,
          currency: invoice.currency,
          paymentMethod: method,
          paymentDate: new Date().toISOString(),
          reference: reference || null,
          walletAddress:
            method === "CRYPTO" && walletAddress ? walletAddress : null,
          transactionHash:
            method === "CRYPTO" && transactionHash ? transactionHash : null,
        }),
      );

      // Reset form
      setAmount(amountDue.toString());
      setReference("");
      setWalletAddress("");
      setTransactionHash("");
      onClose();
    },
    [
      amount,
      method,
      reference,
      walletAddress,
      transactionHash,
      invoice,
      dispatch,
      onClose,
      amountDue,
    ],
  );

  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoice.currency,
    }).format(value);
  };

  return (
    <div className="si-modal-overlay" onClick={onClose}>
      <div
        className="si-modal si-modal--md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="si-modal__header">
          <h3 className="si-modal__title">Record Payment</h3>
          <span className="si-modal__subtitle">
            Invoice #{invoice.invoiceNumber}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="si-modal__body">
            <div className="si-form-summary">
              <div className="si-form-summary__row">
                <span>Invoice Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
              <div className="si-form-summary__row">
                <span>Already Paid</span>
                <span className="si-form-summary__success">
                  {formatCurrency(totalPaid)}
                </span>
              </div>
              <div className="si-form-summary__row si-form-summary__row--highlight">
                <span>Amount Due</span>
                <span>{formatCurrency(amountDue)}</span>
              </div>
            </div>

            <div className="si-form-group">
              <label className="si-form-label" htmlFor="payment-amount">
                Payment Amount
              </label>
              <div className="si-input-group">
                <span className="si-input-group__prefix">
                  {invoice.currency}
                </span>
                <input
                  id="payment-amount"
                  type="number"
                  className="si-input si-input--with-prefix"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="si-form-group">
              <label className="si-form-label" htmlFor="payment-method">
                Payment Method
              </label>
              <select
                id="payment-method"
                className="si-select"
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              >
                {paymentMethods.map((pm) => (
                  <option key={pm.value} value={pm.value}>
                    {pm.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="si-form-group">
              <label className="si-form-label" htmlFor="payment-reference">
                Reference / Transaction ID
              </label>
              <input
                id="payment-reference"
                type="text"
                className="si-input"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g., CC-****-1234 or TXN-12345"
              />
            </div>

            {method === "CRYPTO" && (
              <>
                <div className="si-form-group">
                  <label className="si-form-label" htmlFor="wallet-address">
                    Wallet Address
                  </label>
                  <input
                    id="wallet-address"
                    type="text"
                    className="si-input si-input--mono"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="0x..."
                  />
                </div>
                <div className="si-form-group">
                  <label className="si-form-label" htmlFor="tx-hash">
                    Transaction Hash
                  </label>
                  <input
                    id="tx-hash"
                    type="text"
                    className="si-input si-input--mono"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    placeholder="0x..."
                  />
                </div>
              </>
            )}
          </div>

          <div className="si-modal__footer">
            <button
              type="button"
              className="si-btn si-btn--ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="si-btn si-btn--primary">
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
