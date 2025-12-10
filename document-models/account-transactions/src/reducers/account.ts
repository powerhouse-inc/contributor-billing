import type { AccountTransactionsAccountOperations } from "../../gen/account/operations.js";

export const reducer: AccountTransactionsAccountOperations = {
    setAccountOperation(state, action) {
        state.account.account = action.input.address;
        state.account.name = action.input.name || action.input.address;
    }
};