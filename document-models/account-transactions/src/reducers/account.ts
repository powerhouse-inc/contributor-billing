import type { AccountTransactionsAccountOperations } from "@powerhousedao/contributor-billing/document-models/account-transactions";

export const accountTransactionsAccountOperations: AccountTransactionsAccountOperations = {
    setAccountOperation(state, action) {
        state.account.account = action.input.address;
        state.account.name = action.input.name || action.input.address;
    }
};