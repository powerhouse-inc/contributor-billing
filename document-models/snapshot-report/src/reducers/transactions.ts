import {
  DuplicateTransactionError,
  AccountNotFoundError,
  TransactionNotFoundError,
} from "../../gen/transactions/error.js";
import type { SnapshotReportTransactionsOperations } from "@powerhousedao/contributor-billing/document-models/snapshot-report";

export const snapshotReportTransactionsOperations: SnapshotReportTransactionsOperations =
  {
    addTransactionOperation(state, action) {
      const account = state.snapshotAccounts.find(
        (a) => a.id === action.input.accountId,
      );
      if (!account) {
        throw new AccountNotFoundError(
          `Account with ID ${action.input.accountId} not found`,
        );
      }

      const existingTransaction = account.transactions.find(
        (t) => t.id === action.input.id,
      );
      if (existingTransaction) {
        throw new DuplicateTransactionError(
          `Transaction with ID ${action.input.id} already exists`,
        );
      }

      const newTransaction = {
        id: action.input.id,
        transactionId: action.input.transactionId,
        counterParty: action.input.counterParty || null,
        amount: action.input.amount,
        datetime: action.input.datetime,
        txHash: action.input.txHash,
        token: action.input.token,
        blockNumber: action.input.blockNumber || null,
        direction: action.input.direction,
        flowType: action.input.flowType || null,
        counterPartyAccountId: action.input.counterPartyAccountId || null,
      };

      account.transactions.push(newTransaction);
    },
    removeTransactionOperation(state, action) {
      let found = false;

      for (const account of state.snapshotAccounts) {
        const transactionIndex = account.transactions.findIndex(
          (t) => t.id === action.input.id,
        );
        if (transactionIndex !== -1) {
          account.transactions.splice(transactionIndex, 1);
          found = true;
          break;
        }
      }

      if (!found) {
        throw new TransactionNotFoundError(
          `Transaction with ID ${action.input.id} not found`,
        );
      }
    },
    updateTransactionFlowTypeOperation(state, action) {
      let transaction = null;

      for (const account of state.snapshotAccounts) {
        transaction = account.transactions.find(
          (t) => t.id === action.input.id,
        );
        if (transaction) {
          break;
        }
      }

      if (!transaction) {
        throw new TransactionNotFoundError(
          `Transaction with ID ${action.input.id} not found`,
        );
      }

      transaction.flowType = action.input.flowType;
    },
  };
