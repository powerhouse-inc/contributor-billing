import { SelectOption } from "@powerhousedao/document-engineering/ui";
import { InvoiceTag } from "../../../document-models/invoice/gen/types.js";

const billingTagMapping = [
  { fusion: "Budget", xero: "Grants from Maker DAO" },
  { fusion: "Current Asset", xero: "Clearing Account" },
  { fusion: "Current Liability", xero: "Request Finance IC account" },
  { fusion: "Interest Income", xero: "Interest Income" },
  { fusion: "Travel & Entertainment", xero: "Activities and Events" },
  { fusion: "Travel & Entertainment", xero: "Meals" },
  { fusion: "Travel & Entertainment", xero: "Airfare" },
  { fusion: "Travel & Entertainment", xero: "Hotels" },
  { fusion: "Travel & Entertainment", xero: "Transportation (Uber, Taxi etc)" },
  { fusion: "Travel & Entertainment", xero: "Other travel cost" },
  { fusion: "Cost of Goods Sold", xero: "Cost of Goods Sold" },
  { fusion: "Marketing Expense", xero: "Advertising" },
  { fusion: "Professional Services", xero: "Legal Fees Abroad" },
  { fusion: "Professional Services", xero: "Legal Fees Switzerland" },
  { fusion: "Professional Services", xero: "Finance Team Fees Abroad" },
  { fusion: "Professional Services", xero: "Fnance and Accounting Fees Switzerland" },
  { fusion: "Software Development Expense", xero: "Software Development Team Fees" },
  { fusion: "Professional Services", xero: "Research Team Fees" },
  { fusion: "Marketing Expense", xero: "Marketing Team Fees" },
  { fusion: "Compensation & Benefits", xero: "Health Care Fees" },
  { fusion: "Compensation & Benefits", xero: "Contractor Fees" },
  { fusion: "Compensation & Benefits", xero: "Insurance Fees Team" },
  { fusion: "Compensation & Benefits", xero: "HR Fees" },
  { fusion: "Compensation & Benefits", xero: "Team Bonus" },
  { fusion: "Compensation & Benefits", xero: "Refferal Fees" },
  { fusion: "Other", xero: "Depreciation" },
  { fusion: "Other", xero: "Freight & Courier" },
  { fusion: "Other", xero: "Interest Expense" },
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
  { fusion: "Software Expense", xero: "Telephone and Internet Charges" },
  { fusion: "Fixed Asset", xero: "Office Equipment" },
  { fusion: "Fixed Asset", xero: "Less Accumulated Depreciation on Office Equipment" },
  { fusion: "Non-Current Asset", xero: "Computer Equipment" },
  { fusion: "Non-Current Asset", xero: "Less Accumulated Depreciation on Computer Equipment" },
  { fusion: "Current Liability", xero: "Accounts Payable" },
  { fusion: "Other", xero: "Bank Fees" },
  { fusion: "Gas Expense", xero: "Gas Fees" },
  { fusion: "Other", xero: "Exchange Fees" },
  { fusion: "Current Liability", xero: "Unpaid Expense Claims" },
  { fusion: "Current Liability", xero: "Accrued Expenses" },
  { fusion: "Current Liability", xero: "Wages Payable" },
  { fusion: "Current Liability", xero: "Employee Tax Payable" },
  { fusion: "Current Liability", xero: "Superannuation Payable" },
  { fusion: "Current Liability", xero: "Income Tax Payable" },
  { fusion: "Other", xero: "Sales Tax" },
  { fusion: "Adjustment A/C", xero: "Historical Adjustment" },
  { fusion: "Temporary Holding Account", xero: "Suspense" },
  { fusion: "Other", xero: "Rounding" },
  { fusion: "Internal Transfers", xero: "Tracking Transfers" },
  { fusion: "Owner Equity", xero: "Owner A Drawings" },
  { fusion: "Owner Equity", xero: "Owner A Funds Introduced" },
  { fusion: "Non-current Liability", xero: "Loan" },
  { fusion: "Equity", xero: "Retained Earnings" },
  { fusion: "Equity", xero: "Owner A Share Capital" }
];

// Mapping of labels to values
const fusionLabelToValue: Record<string, string> = {
  "Budget": "budget",
  "Current Liability": "liabilities/current",
  "Interest Income": "income/interest",
  "Travel & Entertainment": "expenses/headcount/travel-and-entertainment",
  "Cost of Goods Sold": "expenses/non-headcount/direct-costs",
  "Marketing Expense": "expenses/headcount/marketing",
  "Professional Services": "expenses/headcount/professional-services",
  "Software Development Expense": "expenses/non-headcount/software-development",
  "Compensation & Benefits": "expenses/headcount/compensation-and-benefits",
  "Admin Expense": "expenses/headcount/admin",
  "Other Income Expense (Non-operating)": "income/non-operating",
  "Other Income": "income/other",
  "Income Tax Expense": "expenses/non-headcount/income-tax",
  "Current Asset": "assets/current",
  "Software Expense": "expenses/non-headcount/software",
  "Fixed Asset": "assets/fixed",
  "Non-Current Asset": "assets/non-current",
  "Gas Expense": "expenses/non-headcount/gas",
  "Adjustment A/C": "accounts/adjustment",
  "Temporary Holding Account": "accounts/temporary",
  "Other": "accounts/other",
  "Internal Transfers": "accounts/internal-transfers",
  "Owner Equity": "equity/owner",
  "Non-current Liability": "liabilities/non-current",
  "Equity": "equity/retained",
};

export const expenseAccountOptions: SelectOption[] = Array.from(
  new Set(billingTagMapping.map((tag) => tag.fusion))
).map((tag) => {
  return {
    label: tag,
    value: fusionLabelToValue[tag] || tag, // Fallback to tag name if no code mapping exists
  };
});

export const budgetOptions: SelectOption[] = [
  { label: "Powerhouse", value: "PH-001" },
  { label: "Jetstream", value: "JTS-001" },
];

export const mapTags = (lineItemTags: InvoiceTag[]) => {
  if (lineItemTags.length === 0) return [];
  const tags = lineItemTags.map((tag) => {
    const mapping = billingTagMapping.find(
      (mapping) => mapping.xero === tag.label
    );
    const fusionLabel = fusionLabelToValue[mapping?.fusion || ""];
    if (mapping && fusionLabel) {
      return {
        dimension: "expense-account",
        value: fusionLabel,
        label: mapping.fusion,
      };
    }
    if (tag.dimension === "accounting-period") {
      return tag;
    }
  });
  return tags;
};
