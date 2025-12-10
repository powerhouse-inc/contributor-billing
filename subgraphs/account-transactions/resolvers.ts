import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import {
  actions,
  type AddTransactionInput,
  type UpdateTransactionInput,
  type DeleteTransactionInput,
  type UpdateTransactionPeriodInput,
  type AddBudgetInput,
  type UpdateBudgetInput,
  type DeleteBudgetInput,
  type AccountTransactionsDocument,
} from "../../document-models/account-transactions/index.js";
import { setName } from "document-model";
import { alchemyClient } from "../../scripts/alchemy/alchemyClient.js";
import { generateId } from "document-model/core";

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
                doc.header.documentType === "powerhouse/account-transactions",
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
          "powerhouse/account-transactions",
        );

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: "powerhouse/account-transactions",
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
        args: { docId: string; input: { address: string; name?: string } },
      ) => {
        console.log('[Resolver] AccountTransactions_setAccount called with:', args);
        const { docId, input } = args;
        const doc = await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          console.error('[Resolver] Document not found:', docId);
          throw new Error("Document not found");
        }

        console.log('[Resolver] Document found, setting account with action:', input);
        const result = await reactor.addAction(
          docId,
          actions.setAccount(input),
        );

        console.log('[Resolver] setAccount action result:', result);

        if (result.status !== "SUCCESS") {
          console.error('[Resolver] setAccount failed:', result.error);
          throw new Error(result.error?.message ?? "Failed to set account");
        }

        console.log('[Resolver] Account successfully set!');
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
        console.log(`[Resolver] getTransactionsFromAlchemy called with address:`, address);
        console.log(`[Resolver] About to call alchemyClient.instance.getAllTransactionsForAddress`);

        try {
          console.log(`[Resolver] Fetching transactions for address: ${address}`);

          // Use the new AlchemyClient with proper error handling and retry logic
          const result = await alchemyClient.instance.getAllTransactionsForAddress(address, {
            fromBlock: fromBlock || "0x0",
            includeERC20: true,
            includeExternal: true,
            includeInternal: false,
            maxCount: 1000
          });

          const { transactions, summary } = result;
          console.log(`[Resolver] Successfully fetched ${transactions.length} transactions`);

          // Debug: Log what AlchemyClient is actually returning
          console.log(`[Resolver] Sample transactions from AlchemyClient (first 3):`, transactions.slice(0, 3).map(tx => ({
            hash: tx.txHash?.slice(0, 10),
            direction: tx.direction,
            from: tx.from?.slice(0, 8),
            to: tx.to?.slice(0, 8),
            hasDirection: 'direction' in tx,
            hasFrom: 'from' in tx,
            hasTo: 'to' in tx,
            allFields: Object.keys(tx)
          })));

          // Convert transactions to match the current GraphQL schema
          const formattedTransactions = transactions.map(tx => ({
            counterParty: tx.counterParty,
            amount: `${tx.amount.value} ${tx.amount.unit}`, // Convert to string for Amount_Currency scalar
            txHash: tx.txHash,
            token: tx.token,
            blockNumber: tx.blockNumber,
            datetime: tx.datetime,
            accountingPeriod: tx.accountingPeriod,
            from: tx.from,
            to: tx.to,
            direction: tx.direction
          }));

          const response = {
            success: true,
            transactions: formattedTransactions,
            message: `Successfully fetched ${transactions.length} transactions from Alchemy`,
            transactionsCount: transactions.length
          };

          // Debug: Log what we're actually returning to GraphQL
          console.log(`[Resolver] Final GraphQL response (first transaction):`, JSON.stringify(response.transactions[0], null, 2));

          return response;

        } catch (error) {
          console.error(`[Resolver] Error fetching transactions:`, error);
          return {
            success: false,
            transactions: [],
            message: `Error fetching transactions: ${error instanceof Error ? error.message : 'Unknown error'}`,
            transactionsCount: 0
          };
        }
      },

      AccountTransactions_fetchTransactionsFromAlchemy: async (
        _: unknown,
        args: { docId: string; address: string; fromBlock?: string },
      ) => {
        const { docId, address, fromBlock } = args;
        console.log(`[Resolver] fetchTransactionsFromAlchemy called with:`, { docId, address, fromBlock });

        const doc = await reactor.getDocument<AccountTransactionsDocument>(docId);
        if (!doc) {
          console.error(`[Resolver] Document with id ${docId} not found`);
          throw new Error(`Document with id ${docId} not found`);
        }

        console.log(`[Resolver] Document found:`, {
          id: doc.header.id,
          name: doc.header.name,
          documentType: doc.header.documentType
        });

        try {
          console.log(`[Resolver] Fetching transactions for address: ${address}`);

          // Use the new AlchemyClient with proper error handling and retry logic
          const result = await alchemyClient.instance.getAllTransactionsForAddress(address, {
            fromBlock: fromBlock || "0x0",
            includeERC20: true,
            includeExternal: true,
            includeInternal: false,
            maxCount: 1000
          });

          const { transactions, summary } = result;

          // Check if there are any transactions returned
          if (!transactions || transactions.length === 0) {
            return {
              success: true,
              transactionsAdded: 0,
              message: "No new transactions found. All transactions are up to date."
            };
          }

          // Get existing transactions for deduplication
          // Use txHash + blockNumber + token + counterParty + amount as unique identifier
          // Note: Multiple ERC20 transfers can share the same txHash and blockNumber, so we include amount
          const existingTransactions = doc.state.global.transactions || [];
          const existingTxKeys = new Set(
            existingTransactions.map((tx: any) => {
              const txHash = tx.details?.txHash || tx.txHash || "";
              const blockNumber = tx.details?.blockNumber || tx.blockNumber || "";
              const token = tx.details?.token || tx.token || "";
              const counterParty = tx.counterParty || "";
              // Include amount to handle multiple transfers in same transaction
              const amount = tx.amount;
              const amountStr = typeof amount === 'object' && amount?.value && amount?.unit
                ? `${amount.value}-${amount.unit}`
                : typeof amount === 'string' ? amount : "";
              return `${txHash}-${blockNumber}-${token}-${counterParty}-${amountStr}`;
            })
          );

          // Add only new transactions that don't already exist
          let successfullyAdded = 0;
          let skippedDuplicates = 0;
          for (const tx of transactions) {
            // Create unique key for this transaction (include amount to handle multiple transfers in same tx)
            const amountStr = `${tx.amount.value}-${tx.amount.unit}`;
            const txKey = `${tx.txHash}-${tx.blockNumber}-${tx.token}-${tx.counterParty}-${amountStr}`;
            
            // Skip if transaction already exists
            if (existingTxKeys.has(txKey)) {
              skippedDuplicates++;
              continue;
            }

            const addResult = await reactor.addAction(
              docId,
              actions.addTransaction({
                id: generateId(),
                ...tx
              }),
            );

            if (addResult.status === "SUCCESS") {
              successfullyAdded++;
            } else {
              console.error(`[Resolver] Failed to add transaction ${tx.txHash}:`, addResult.error?.message);
            }
          }

          console.log(`[Resolver] Summary: ${summary.outgoing} outgoing, ${summary.incoming} incoming, ${summary.unique} unique, ${successfullyAdded} added to document, ${skippedDuplicates} skipped (duplicates)`);

          if (successfullyAdded === 0) {
            return {
              success: true,
              transactionsAdded: 0,
              message: skippedDuplicates > 0
                ? `No new transactions found. All ${skippedDuplicates} transaction(s) already exist in the document.`
                : "No new transactions found. All transactions are up to date."
            };
          }

          return {
            success: true,
            transactionsAdded: successfullyAdded,
            message: skippedDuplicates > 0
              ? `Successfully added ${successfullyAdded} new transaction(s) (${skippedDuplicates} skipped - already exist)`
              : `Successfully added ${successfullyAdded} new transaction(s)`
          };

        } catch (error) {
          console.error("[Resolver] Error fetching transactions from Alchemy:", error);
          throw new Error(`Failed to fetch transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
    },
  };
};
