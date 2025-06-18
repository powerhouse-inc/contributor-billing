import { SelectOption } from "@powerhousedao/document-engineering/ui";

const billingTagMapping = [
    { fusion: "Budget", xero: "Grants from Maker DAO" },
    { fusion: "Current Liability", xero: "Accounts Payable" },
    { fusion: "Current Liability", xero: "Unpaid Expense Claims" },
    { fusion: "Current Liability", xero: "Wages Payable" },
    { fusion: "Current Liability", xero: "Sales Tax" },
    { fusion: "Interest Income", xero: "Interest Income" },
    { fusion: "Travel & Entertainment", xero: "Activities and Events" },
    { fusion: "Travel & Entertainment", xero: "Meals" },
    { fusion: "Travel & Entertainment", xero: "Airfare" },
    { fusion: "Travel & Entertainment", xero: "Hotels" },
    { fusion: "Travel & Entertainment", xero: "Transportation (Uber, Taxi etc)" },
    { fusion: "Cost of Goods Sold", xero: "Cost of Goods Sold" },
    { fusion: "Marketing Expense", xero: "Advertising" },
    { fusion: "Professional Services", xero: "Legal Fees Abroad" },
    { fusion: "Professional Services", xero: "Legal Fees Switzerland" },
    { fusion: "Professional Services", xero: "Finance Team Fees Abroad" },
    { fusion: "Professional Services", xero: "Finance and Accounting Fees Switzerland" },
    { fusion: "Software Development Expense", xero: "Software Development Team Fees" },
    { fusion: "Compensation & Benefits", xero: "Contractor Fees" },
    { fusion: "Compensation & Benefits", xero: "Health Care Fees" },
    { fusion: "Compensation & Benefits", xero: "Insurance Fees Team" },
    { fusion: "Compensation & Benefits", xero: "HR Fees" },
    { fusion: "Compensation & Benefits", xero: "Team Bonus" },
    { fusion: "Admin Expense", xero: "Office Expenses" },
    { fusion: "Admin Expense", xero: "Rent" },
    { fusion: "Admin Expense", xero: "Subscriptions" },
    { fusion: "Other Income Expense (Non-operating)", xero: "Bank Revaluations" },
    { fusion: "Other Income", xero: "Unrealised Currency Gains" },
    { fusion: "Other Income", xero: "Realised Currency Gains" },
    { fusion: "Income Tax Expense", xero: "Income Tax Expense" },
    { fusion: "Current Asset", xero: "Accounts Receivable" },
    { fusion: "Current Asset", xero: "Prepayments" },
    { fusion: "Current Asset", xero: "Inventory" },
    { fusion: "Software Expense", xero: "Software/IT Subscriptions" },
    { fusion: "Fixed Asset", xero: "Office Equipment" },
    { fusion: "Fixed Asset", xero: "Less Accumulated Depreciation on Office Equipment" },
    { fusion: "Non-Current Asset", xero: "Computer Equipment" },
    { fusion: "Non-Current Asset", xero: "Less Accumulated Depreciation on Computer Equipment" },
    { fusion: "Gas Expense", xero: "Gas Fees" },
    { fusion: "Adjustment A/C", xero: "Historical Adjustment" },
    { fusion: "Temporary Holding Account", xero: "Suspense" },
    { fusion: "Other", xero: "Rounding" },
    { fusion: "Internal Transfers", xero: "Tracking Transfers" },
    { fusion: "Owner Equity", xero: "Owner A Drawings" },
    { fusion: "Owner Equity", xero: "Owner A Funds Introduced" },
    { fusion: "Non-current Liability", xero: "Loan" },
    { fusion: "Equity", xero: "Retained Earnings" },
    { fusion: "Equity", xero: "Owner A Share Capital" }
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
