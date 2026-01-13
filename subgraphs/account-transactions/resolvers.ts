import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import { generateId } from "document-model/core";
import {
  actions,
  accountTransactionsDocumentType,
} from "@powerhousedao/contributor-billing/document-models/account-transactions";
import { alchemyClient } from "../../scripts/alchemy/alchemyClient.js";

import type {
  AccountTransactionsDocument,
  SetAccountInput,
  AddTransactionInput,
  UpdateTransactionInput,
  DeleteTransactionInput,
  UpdateTransactionPeriodInput,
  AddBudgetInput,
  UpdateBudgetInput,
  DeleteBudgetInput,
} from "@powerhousedao/contributor-billing/document-models/account-transactions";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      AccountTransactions: async () => {
        return {
          getDocument: async (args: { docId: string; driveId: string }) => {
            const { docId, driveId } = args;

            if (!docId) {
              throw new Error("Document id is required");
            }

            if (driveId) {
              const docIds = await reactor.getDocuments(driveId);
              if (!docIds.includes(docId)) {
                throw new Error(
                  `Document with id ${docId} is not part of ${driveId}`,
                );
              }
            }

            const doc =
              await reactor.getDocument<AccountTransactionsDocument>(docId);
            return {
              driveId: driveId,
              ...doc,
              ...doc.header,
              created: doc.header.createdAtUtcIso,
              lastModified: doc.header.lastModifiedAtUtcIso,
              state: doc.state.global,
              stateJSON: doc.state.global,
              revision: doc.header?.revision?.global ?? 0,
            };
          },
          getDocuments: async (args: { driveId: string }) => {
            const { driveId } = args;
            const docsIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              docsIds.map(async (docId) => {
                const doc =
                  await reactor.getDocument<AccountTransactionsDocument>(docId);
                return {
                  driveId: driveId,
                  ...doc,
                  ...doc.header,
                  created: doc.header.createdAtUtcIso,
                  lastModified: doc.header.lastModifiedAtUtcIso,
                  state: doc.state.global,
                  stateJSON: doc.state.global,
                  revision: doc.header?.revision?.global ?? 0,
                };
              }),
            );

            return docs.filter(
              (doc) =>
                doc.header.documentType === accountTransactionsDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      AccountTransactions_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(
          accountTransactionsDocumentType,
        );

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: accountTransactionsDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      AccountTransactions_setAccount: async (
        _: unknown,
        args: { docId: string; input: SetAccountInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setAccount(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setAccount");
        }

        return true;
      },

      AccountTransactions_addTransaction: async (
        _: unknown,
        args: { docId: string; input: AddTransactionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addTransaction(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addTransaction");
        }

        return true;
      },

      AccountTransactions_updateTransaction: async (
        _: unknown,
        args: { docId: string; input: UpdateTransactionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateTransaction(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateTransaction",
          );
        }

        return true;
      },

      AccountTransactions_deleteTransaction: async (
        _: unknown,
        args: { docId: string; input: DeleteTransactionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deleteTransaction(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to deleteTransaction",
          );
        }

        return true;
      },

      AccountTransactions_updateTransactionPeriod: async (
        _: unknown,
        args: { docId: string; input: UpdateTransactionPeriodInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateTransactionPeriod(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateTransactionPeriod",
          );
        }

        return true;
      },

      AccountTransactions_addBudget: async (
        _: unknown,
        args: { docId: string; input: AddBudgetInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.addBudget(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addBudget");
        }

        return true;
      },

      AccountTransactions_updateBudget: async (
        _: unknown,
        args: { docId: string; input: UpdateBudgetInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateBudget(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updateBudget");
        }

        return true;
      },

      AccountTransactions_deleteBudget: async (
        _: unknown,
        args: { docId: string; input: DeleteBudgetInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deleteBudget(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to deleteBudget");
        }

        return true;
      },

      AccountTransactions_getTransactionsFromAlchemy: async (
        _: unknown,
        args: { address: string; fromBlock?: string },
      ) => {
        const { address, fromBlock } = args;
        console.log(
          `[Resolver] getTransactionsFromAlchemy called for address:`,
          address,
        );

        try {
          const result =
            await alchemyClient.instance.getAllTransactionsForAddress(address, {
              fromBlock: fromBlock || "0x0",
              includeERC20: true,
              includeExternal: true,
              includeInternal: false,
              maxCount: 1000,
            });

          const { transactions, summary } = result;
          console.log(
            `[Resolver] Successfully fetched ${transactions.length} transactions`,
          );

          // Format transactions to match GraphQL schema - include uniqueId
          const formattedTransactions = transactions.map((tx) => ({
            counterParty: tx.counterParty,
            amount: `${tx.amount.value} ${tx.amount.unit}`,
            txHash: tx.txHash,
            token: tx.token,
            blockNumber: tx.blockNumber,
            uniqueId: tx.uniqueId || null,
            datetime: tx.datetime,
            accountingPeriod: tx.accountingPeriod,
            from: tx.from,
            to: tx.to,
            direction: tx.direction,
          }));

          return {
            success: true,
            transactions: formattedTransactions,
            message: `Successfully fetched ${transactions.length} transactions from Alchemy`,
            transactionsCount: transactions.length,
          };
        } catch (error) {
          console.error(`[Resolver] Error fetching transactions:`, error);
          return {
            success: false,
            transactions: [],
            message: `Error fetching transactions: ${error instanceof Error ? error.message : "Unknown error"}`,
            transactionsCount: 0,
          };
        }
      },

      AccountTransactions_fetchTransactionsFromAlchemy: async (
        _: unknown,
        args: { docId: string; address: string; fromBlock?: string },
      ) => {
        const { docId, address, fromBlock } = args;
        console.log(`[Resolver] fetchTransactionsFromAlchemy called:`, {
          docId,
          address,
          fromBlock,
        });

        const doc =
          await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          throw new Error(`Document with id ${docId} not found`);
        }

        try {
          const result =
            await alchemyClient.instance.getAllTransactionsForAddress(address, {
              fromBlock: fromBlock || "0x0",
              includeERC20: true,
              includeExternal: true,
              includeInternal: false,
              maxCount: 1000,
            });

          const { transactions, summary } = result;

          if (!transactions || transactions.length === 0) {
            return {
              success: true,
              transactionsAdded: 0,
              message:
                "No new transactions found. All transactions are up to date.",
            };
          }

          // Get existing transactions for deduplication using uniqueId
          const existingTransactions = doc.state.global.transactions || [];
          const existingUniqueIds = new Set(
            existingTransactions
              .map((tx: any) => tx.details?.uniqueId)
              .filter((id: string | null | undefined) => id != null),
          );

          // Add only new transactions that don't already exist (based on uniqueId)
          let successfullyAdded = 0;
          let skippedDuplicates = 0;

          for (const tx of transactions) {
            // Skip if transaction with this uniqueId already exists
            if (tx.uniqueId && existingUniqueIds.has(tx.uniqueId)) {
              skippedDuplicates++;
              console.log(
                `[Resolver] Skipping duplicate transaction with uniqueId: ${tx.uniqueId}`,
              );
              continue;
            }

            const addResult = await reactor.addAction(
              docId,
              actions.addTransaction({
                id: generateId(),
                counterParty: tx.counterParty,
                amount: tx.amount,
                datetime: tx.datetime,
                txHash: tx.txHash,
                token: tx.token,
                blockNumber: tx.blockNumber,
                uniqueId: tx.uniqueId || null,
                accountingPeriod: tx.accountingPeriod,
                direction: tx.direction,
                budget: null,
              }),
            );

            if (addResult.status === "SUCCESS") {
              successfullyAdded++;
              // Add to set to prevent duplicates within this batch
              if (tx.uniqueId) {
                existingUniqueIds.add(tx.uniqueId);
              }
            } else {
              console.error(
                `[Resolver] Failed to add transaction ${tx.txHash}:`,
                addResult.error?.message,
              );
            }
          }

          console.log(
            `[Resolver] Summary: ${successfullyAdded} added, ${skippedDuplicates} skipped (duplicates)`,
          );

          if (successfullyAdded === 0) {
            return {
              success: true,
              transactionsAdded: 0,
              message:
                skippedDuplicates > 0
                  ? `No new transactions found. All ${skippedDuplicates} transaction(s) already exist in the document.`
                  : "No new transactions found. All transactions are up to date.",
            };
          }

          return {
            success: true,
            transactionsAdded: successfullyAdded,
            message:
              skippedDuplicates > 0
                ? `Successfully added ${successfullyAdded} new transaction(s) (${skippedDuplicates} skipped - already exist)`
                : `Successfully added ${successfullyAdded} new transaction(s)`,
          };
        } catch (error) {
          console.error(
            "[Resolver] Error fetching transactions from Alchemy:",
            error,
          );
          throw new Error(
            `Failed to fetch transactions: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      },
    },
  };
};
