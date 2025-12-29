import { type ISubgraph } from "@powerhousedao/reactor-api";
import {
  Invoice_processGnosisPayment,
  Invoice_createRequestFinancePayment,
  Invoice_uploadInvoicePdfChunk,
} from "./customResolvers.js";

export const getResolvers = (subgraph: ISubgraph): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Mutation: {
      Invoice_processGnosisPayment: Invoice_processGnosisPayment,
      Invoice_createRequestFinancePayment: Invoice_createRequestFinancePayment,
      Invoice_uploadInvoicePdfChunk: Invoice_uploadInvoicePdfChunk,
    },
  };
};
