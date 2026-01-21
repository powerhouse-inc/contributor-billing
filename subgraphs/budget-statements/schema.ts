import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Subgraph definition
  """
  type Query {
    budgetStatements(filter: budgetStatementsFilter): [BudgetStatement!]!
  }

  input budgetStatementsFilter {
    teamId: PHID!
  }

  type BudgetStatement {
    id: OID!
    owner: BudgetStatementOwner!
    month: String! ## JAN2026
    snapshotReport: BudgetStatementSnapshotReport!
    expenseReport: BudgetStatementExpenseReport!
  }

  type BudgetStatementOwner {
    id: PHID!
    name: String!
    code: String!
    logo: URL!
  }

  type BudgetStatementSnapshotReport {
    startDate: DateTime!
    endDate: DateTime!
    accounts: [SnapshotAccount!]!
  }

  type SnapshotAccount {
    id: ID!
    name: String!
    address: String!
    type: SnapAccountType!
    balances: [SnapshotAccountBalance!]!
    transactions: [SnapshotAccountTransaction!]!
  }

  type SnapshotAccountBalance {
    startingBalance: Amount_Currency!
    endingBalance: Amount_Currency!
    token: Token!
  }

  type Token {
    symbol: String!
    contractAddress: EthereumAddress!
  }

  enum SnapAccountType {
    Source
    Internal
    Destination
    External
  }

  type SnapshotAccountTransaction {
    id: ID!
    datetime: DateTime!
    txHash: String!
    counterParty: EthereumAddress!
    counterPartyName: String!
    amount: TxAmount!
    direction: AccountTransactionDirection!
    flowType: AccountTransactionFlowType!
  }

  type TxAmount {
    value: Amount_Currency!
    unit: String!
  }

  enum AccountTransactionDirection {
    INFLOW
    OUTFLOW
  }

  enum AccountTransactionFlowType {
    TopUp
    Return
    Internal
    External
  }

  type BudgetStatementExpenseReport {
    periodStart: DateTime!
    periodEnd: DateTime!
    groups: [ExpenseReportGroup!]!
    wallets: [ExpenseReportWallet!]!
  }

  type ExpenseReportGroup {
    id: ID!
    label: String!
    parentId: ID!
  }

  type ExpenseReportWallet {
    name: String
    address: EthereumAddress
    totals: [ExpenseReportGroupTotals!]!
    lineItems: [ExpenseReportLineItem!]!
    billingStatementIds: [PHID!]!
  }

  type ExpenseReportGroupTotals {
    group: ID!
    groupLabel: String!
    totalBudget: Amount_Currency!
    totalForecast: Amount_Currency!
    totalActuals: Amount_Currency!
    totalPayments: Amount_Currency!
  }

  type ExpenseReportLineItem {
    id: ID!
    label: String!
    groupId: ID!
    groupLabel: String! # resolved from groups
    budget: Amount_Currency!
    forecast: Amount_Currency!
    actuals: Amount_Currency!
    payments: Amount_Currency!
    comments: String
  }
`;
