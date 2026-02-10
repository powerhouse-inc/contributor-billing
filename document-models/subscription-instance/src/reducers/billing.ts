import type { SubscriptionInstanceBillingOperations } from "@powerhousedao/contributor-billing/document-models/subscription-instance";

export const subscriptionInstanceBillingOperations: SubscriptionInstanceBillingOperations =
  {
    createInvoiceOperation(state, action) {
      const { input } = action;
      state.invoices.push({
        id: input.invoiceId,
        invoiceNumber: input.invoiceNumber,
        status: "DRAFT",
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        issueDate: input.issueDate,
        dueDate: input.dueDate,
        paidDate: null,
        subtotal: 0,
        tax: null,
        total: 0,
        currency: input.currency,
        lineItems: [],
        payments: [],
        notes: input.notes || null,
      });
    },

    updateInvoiceStatusOperation(state, action) {
      const { input } = action;
      const invoice = state.invoices.find((i) => i.id === input.invoiceId);
      if (invoice) {
        invoice.status = input.status;
        if (input.paidDate) {
          invoice.paidDate = input.paidDate;
        }
      }
    },

    addInvoiceLineItemOperation(state, action) {
      const { input } = action;
      const invoice = state.invoices.find((i) => i.id === input.invoiceId);
      if (invoice) {
        const total = input.quantity * input.unitPrice;
        invoice.lineItems.push({
          id: input.lineItemId,
          description: input.description,
          serviceId: input.serviceId || null,
          metricId: input.metricId || null,
          quantity: input.quantity,
          unitPrice: input.unitPrice,
          total,
        });
        // Recalculate subtotal and total
        invoice.subtotal = invoice.lineItems.reduce(
          (sum, item) => sum + item.total,
          0,
        );
        invoice.total = invoice.subtotal + (invoice.tax ?? 0);
      }
    },

    removeInvoiceLineItemOperation(state, action) {
      const { input } = action;
      const invoice = state.invoices.find((i) => i.id === input.invoiceId);
      if (invoice) {
        const lineItemIndex = invoice.lineItems.findIndex(
          (item) => item.id === input.lineItemId,
        );
        if (lineItemIndex !== -1) {
          invoice.lineItems.splice(lineItemIndex, 1);
          // Recalculate subtotal and total
          invoice.subtotal = invoice.lineItems.reduce(
            (sum, item) => sum + item.total,
            0,
          );
          invoice.total = invoice.subtotal + (invoice.tax ?? 0);
        }
      }
    },

    setInvoiceTaxOperation(state, action) {
      const { input } = action;
      const invoice = state.invoices.find((i) => i.id === input.invoiceId);
      if (invoice) {
        invoice.tax = input.tax;
        invoice.total = invoice.subtotal + input.tax;
      }
    },

    recordInvoicePaymentOperation(state, action) {
      const { input } = action;
      const invoice = state.invoices.find((i) => i.id === input.invoiceId);
      if (invoice) {
        invoice.payments.push({
          id: input.paymentId,
          amount: input.amount,
          currency: input.currency,
          paymentMethod: input.paymentMethod,
          paymentDate: input.paymentDate,
          transactionHash: input.transactionHash || null,
          walletAddress: input.walletAddress || null,
          reference: input.reference || null,
        });

        // Calculate total paid amount
        const totalPaid = invoice.payments.reduce(
          (sum, p) => sum + p.amount,
          0,
        );

        // Update status based on payment amount
        if (totalPaid >= invoice.total) {
          invoice.status = "PAID";
          invoice.paidDate = input.paymentDate;
        } else if (totalPaid > 0) {
          invoice.status = "PARTIALLY_PAID";
        }
      }
    },

    sendInvoiceOperation(state, action) {
      const { input } = action;
      const invoice = state.invoices.find((i) => i.id === input.invoiceId);
      if (invoice) {
        invoice.status = "SENT";
      }
    },

    cancelInvoiceOperation(state, action) {
      const { input } = action;
      const invoice = state.invoices.find((i) => i.id === input.invoiceId);
      if (invoice) {
        invoice.status = "CANCELLED";
        if (input.reason) {
          invoice.notes = input.reason;
        }
      }
    },

    markInvoiceOverdueOperation(state, action) {
      const invoice = state.invoices.find(
        (i) => i.id === action.input.invoiceId,
      );
      if (invoice) {
        invoice.status = "OVERDUE";
      }
    },

    refundInvoiceOperation(state, action) {
      const { input } = action;
      const invoice = state.invoices.find((i) => i.id === input.invoiceId);
      if (invoice) {
        invoice.status = "REFUNDED";
        if (input.reason) {
          invoice.notes = input.reason;
        }
      }
    },
    // Note: setInvoicePaymentUrlOperation has been removed from the document model
  };
