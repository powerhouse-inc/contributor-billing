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

// Mapping of labels to values
const fusionLabelToValue: Record<string, string> = {
    "Budget": "budget",
    "Current Liability": "liabilities/current",
    "Interest Income": "income/interest",
    "Travel & Entertainment": "expenses/travel-and-entertainment",
    "Cost of Goods Sold": "expenses/cost-of-goods",
    "Marketing Expense": "expenses/marketing",
    "Professional Services": "expenses/professional-services",
    "Software Development Expense": "expenses/software-development",
    "Compensation & Benefits": "expenses/compensation-and-benefits",
    "Admin Expense": "expenses/admin",
    "Other Income Expense (Non-operating)": "income/non-operating",
    "Other Income": "income/other",
    "Income Tax Expense": "expenses/income-tax",
    "Current Asset": "assets/current",
    "Software Expense": "expenses/software",
    "Fixed Asset": "assets/fixed",
    "Non-Current Asset": "assets/non-current",
    "Gas Expense": "expenses/gas",
    "Adjustment A/C": "accounts/adjustment",
    "Temporary Holding Account": "accounts/temporary",
    "Other": "accounts/other",
    "Internal Transfers": "accounts/internal-transfers",
    "Owner Equity": "equity/owner",
    "Non-current Liability": "liabilities/non-current",
    "Equity": "equity/retained"
};

export const expenseAccountOptions: SelectOption[] = Array.from(new Set(billingTagMapping.map((tag) => tag.fusion))).map((tag) => {
    return {
        label: tag,
        value: fusionLabelToValue[tag] || tag // Fallback to tag name if no code mapping exists
    }
})

export const budgetOptions: SelectOption[] = [
    { label: "Powerhouse", value: "PH-001" },
    { label: "Jetstream", value: "JTS-001" },
]
