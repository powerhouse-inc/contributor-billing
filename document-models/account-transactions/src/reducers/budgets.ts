import type { AccountTransactionsBudgetsOperations } from "../../gen/budgets/operations.js";

export const reducer: AccountTransactionsBudgetsOperations = {
    addBudgetOperation(state, action) {
        state.budgets.push({
            id: action.input.id,
            name: action.input.name || "",
        });
    },
    updateBudgetOperation(state, action) {
        const budget = state.budgets.find((budget) => budget.id === action.input.id);
        if (!budget) {
            throw new Error(`Budget with id ${action.input.id} not found`);
        }
        budget.name = action.input.name || "";
    },
    deleteBudgetOperation(state, action) {
        state.budgets = state.budgets.filter((budget) => budget.id !== action.input.id);
    }
};
