import { SelectOption } from "@powerhousedao/document-engineering/ui";

const billingTagMapping = [
    { fusion: "Budget", xero: "Revenue" },
    { fusion: "Current Liability", xero: "Current Liability" },
    { fusion: "Interest Income", xero: "Revenue" },
    { fusion: "Travel & Entertainment", xero: "Expense" },
    { fusion: "Cost of Goods Sold", xero: "Direct Costs" },
    { fusion: "Marketing Expense", xero: "Expense" },
    { fusion: "Professional Services", xero: "Expense" },
    { fusion: "Software Development Expense", xero: "Expense" },
    { fusion: "Compensation & Benefits", xero: "Expense" },
    { fusion: "Admin Expense", xero: "Expense" },
    { fusion: "Other Income Expense (Non-operating)", xero: "Bank Revaluations" },
    { fusion: "Other Income", xero: "Unrealized Currency Gains" },
    { fusion: "Other Income", xero: "Realized Currency Gains" },
    { fusion: "Income Tax Expense", xero: "Expense" },
    { fusion: "Current Asset", xero: "Accounts Receivable" },
    { fusion: "Current Asset", xero: "Current Asset" },
    { fusion: "Current Asset", xero: "Inventory" },
    { fusion: "Software Expense", xero: "Expense" },
    { fusion: "Fixed Asset", xero: "Fixed Asset" },
    { fusion: "Non-Current Asset", xero: "Fixed Asset" },
    { fusion: "Current Liability", xero: "Accounts Payable" },
    { fusion: "Gas Expense", xero: "Expense" },
    { fusion: "Current Liability", xero: "Unpaid Expense Claims" },
    { fusion: "Current Liability", xero: "Wages Payable" },
    { fusion: "Current Liability", xero: "Sales Tax" },
    { fusion: "Adjustment A/C", xero: "Historical Adjustment" },
    { fusion: "Temporary Holding Account", xero: "Current Liability" },
    { fusion: "Other", xero: "Rounding" },
    { fusion: "Internal Transfers", xero: "Tracking" },
    { fusion: "Owner Equity", xero: "Current Liability" },
    { fusion: "Non-current Liability", xero: "Non-current Liability" },
    { fusion: "Equity", xero: "Retained Earnings" },
    { fusion: "Equity", xero: "Equity" }
]

export const expenseAccountOptions: SelectOption[] = Array.from(new Set(billingTagMapping.map((tag) => tag.fusion))).map((tag) => {
    return {
        label: tag,
        value: tag
    }
})

export const budgetOptions: SelectOption[] = [
    { label: "Powerhouse", value: "PH-001" },
    { label: "Jetstream", value: "JTS-001" },
]