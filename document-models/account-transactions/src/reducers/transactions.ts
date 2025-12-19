import type { AccountTransactionsTransactionsOperations } from "@powerhousedao/contributor-billing/document-models/account-transactions";

export const accountTransactionsTransactionsOperations: AccountTransactionsTransactionsOperations = {
    addTransactionOperation(state, action) {
        state.transactions.push({
            id: action.input.id,
            counterParty: action.input.counterParty,
            amount: action.input.amount,
            datetime: action.input.datetime,
            details: {
                txHash: action.input.txHash,
                token: action.input.token,
                blockNumber: action.input.blockNumber || null,
            },
            budget: action.input.budget || null,
            accountingPeriod: action.input.accountingPeriod,
            direction: action.input.direction,
        });
    },
    updateTransactionOperation(state, action) {
        const transaction = state.transactions.find((transaction) => transaction.id === action.input.id);
        if (!transaction) {
            throw new Error(`Transaction with id ${action.input.id} not found`);
        }
        if (action.input.counterParty !== undefined && action.input.counterParty !== null) {
            transaction.counterParty = action.input.counterParty;
        }
        if (action.input.amount !== undefined && action.input.amount !== null) {
            transaction.amount = action.input.amount;
        }
        if (action.input.datetime !== undefined && action.input.datetime !== null) {
            transaction.datetime = action.input.datetime;
        }
        if (action.input.txHash !== undefined && action.input.txHash !== null) {
            transaction.details.txHash = action.input.txHash;
        }
        if (action.input.token !== undefined && action.input.token !== null) {
            transaction.details.token = action.input.token;
        }
        if (action.input.blockNumber !== undefined) {
            transaction.details.blockNumber = action.input.blockNumber;
        }
        if (action.input.direction !== undefined && action.input.direction !== null) {
            transaction.direction = action.input.direction;
        }
    },
    deleteTransactionOperation(state, action) {
        state.transactions = state.transactions.filter((transaction) => transaction.id !== action.input.id);
    },
    updateTransactionPeriodOperation(state, action) {
        const transaction = state.transactions.find((transaction) => transaction.id === action.input.id);
        if (!transaction) {
            throw new Error(`Transaction with id ${action.input.id} not found`);
        }
        transaction.accountingPeriod = action.input.accountingPeriod || "";
    }
};
