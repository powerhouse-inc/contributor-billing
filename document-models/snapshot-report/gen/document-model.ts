import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Powerhouse",
    website: "https://www.powerhouse.inc/",
  },
  description:
    "Document model for creating snapshot reports that track fund flows through categorized accounts over a specified accounting period",
  extension: "phsr",
  id: "powerhouse/snapshot-report",
  name: "Snapshot Report",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          description: "Operations for configuring the snapshot report",
          id: "config",
          name: "configuration",
          operations: [
            {
              description:
                "Set the report configuration including name, period, and accounts document reference",
              errors: [],
              examples: [],
              id: "set-report-config",
              name: "SET_REPORT_CONFIG",
              reducer:
                "if (action.input.reportName !== undefined && action.input.reportName !== null) {\n  state.reportName = action.input.reportName;\n}\nif (action.input.startDate !== undefined && action.input.startDate !== null) {\n  state.startDate = action.input.startDate;\n}\nif (action.input.endDate !== undefined && action.input.endDate !== null) {\n  state.endDate = action.input.endDate;\n}\nif (action.input.accountsDocumentId !== undefined && action.input.accountsDocumentId !== null) {\n  state.accountsDocumentId = action.input.accountsDocumentId;\n}",
              schema:
                "input SetReportConfigInput {\n  reportName: String\n  startDate: DateTime\n  endDate: DateTime\n  accountsDocumentId: PHID\n}",
              scope: "global",
              template:
                "Set the report configuration including name, period, and accounts document reference",
            },
            {
              description: "Link the snapshot report to an Accounts document",
              errors: [],
              examples: [],
              id: "set-accounts-document",
              name: "SET_ACCOUNTS_DOCUMENT",
              reducer:
                "state.accountsDocumentId = action.input.accountsDocumentId;",
              schema:
                "input SetAccountsDocumentInput {\n  accountsDocumentId: PHID!\n}",
              scope: "global",
              template: "Link the snapshot report to an Accounts document",
            },
            {
              description: "Set the accounting period for the snapshot report",
              errors: [],
              examples: [],
              id: "set-period",
              name: "SET_PERIOD",
              reducer:
                "state.startDate = action.input.startDate;\nstate.endDate = action.input.endDate;",
              schema:
                "input SetPeriodInput {\n  startDate: DateTime!\n  endDate: DateTime!\n}",
              scope: "global",
              template: "Set the accounting period for the snapshot report",
            },
          ],
        },
        {
          description: "Operations for managing snapshot accounts",
          id: "accounts",
          name: "accounts",
          operations: [
            {
              description: "Add an account to the snapshot report",
              errors: [],
              examples: [],
              id: "add-snapshot-account",
              name: "ADD_SNAPSHOT_ACCOUNT",
              reducer:
                "const existingAccount = state.snapshotAccounts.find(a => a.id === action.input.id);\nif (existingAccount) {\n  throw new DuplicateAccountError(`Account with ID ${action.input.id} already exists`);\n}\n\nconst newAccount = {\n  id: action.input.id,\n  accountId: action.input.accountId,\n  accountAddress: action.input.accountAddress,\n  accountName: action.input.accountName,\n  type: action.input.type,\n  accountTransactionsId: action.input.accountTransactionsId || null,\n  startingBalances: [],\n  endingBalances: [],\n  transactions: []\n};\n\nstate.snapshotAccounts.push(newAccount);",
              schema:
                "input AddSnapshotAccountInput {\n  id: OID!\n  accountId: OID!\n  accountAddress: String!\n  accountName: String!\n  type: AccountTypeInput!\n  accountTransactionsId: PHID\n}",
              scope: "global",
              template: "Add an account to the snapshot report",
            },
            {
              description:
                "Update the type categorization of a snapshot account",
              errors: [],
              examples: [],
              id: "update-account-type",
              name: "UPDATE_SNAPSHOT_ACCOUNT_TYPE",
              reducer:
                "const account = state.snapshotAccounts.find(a => a.id === action.input.id);\nif (!account) {\n  throw new AccountNotFoundError(`Account with ID ${action.input.id} not found`);\n}\n\naccount.type = action.input.type;",
              schema:
                "input UpdateSnapshotAccountTypeInput {\n  id: OID!\n  type: AccountTypeInput!\n}",
              scope: "global",
              template: "Update the type categorization of a snapshot account",
            },
            {
              description: "Remove an account from the snapshot report",
              errors: [],
              examples: [],
              id: "remove-snapshot-account",
              name: "REMOVE_SNAPSHOT_ACCOUNT",
              reducer:
                "const accountIndex = state.snapshotAccounts.findIndex(a => a.id === action.input.id);\nif (accountIndex === -1) {\n  throw new AccountNotFoundError(`Account with ID ${action.input.id} not found`);\n}\n\nstate.snapshotAccounts.splice(accountIndex, 1);",
              schema: "input RemoveSnapshotAccountInput {\n  id: OID!\n}",
              scope: "global",
              template: "Remove an account from the snapshot report",
            },
          ],
        },
        {
          description: "Operations for managing account token balances",
          id: "balances",
          name: "balances",
          operations: [
            {
              description:
                "Set or update a starting balance for a token in a snapshot account",
              errors: [],
              examples: [],
              id: "set-starting-balance",
              name: "SET_STARTING_BALANCE",
              reducer:
                "const account = state.snapshotAccounts.find(a => a.id === action.input.accountId);\nif (!account) {\n  throw new AccountNotFoundError(`Account with ID ${action.input.accountId} not found`);\n}\n\nconst existingBalance = account.startingBalances.find(b => b.id === action.input.balanceId);\nif (existingBalance) {\n  existingBalance.token = action.input.token;\n  existingBalance.amount = action.input.amount;\n} else {\n  account.startingBalances.push({\n    id: action.input.balanceId,\n    token: action.input.token,\n    amount: action.input.amount\n  });\n}",
              schema:
                "input SetStartingBalanceInput {\n  accountId: OID!\n  balanceId: OID!\n  token: Currency!\n  amount: Amount_Currency!\n}",
              scope: "global",
              template:
                "Set or update a starting balance for a token in a snapshot account",
            },
            {
              description:
                "Set or update an ending balance for a token in a snapshot account",
              errors: [],
              examples: [],
              id: "set-ending-balance",
              name: "SET_ENDING_BALANCE",
              reducer:
                "const account = state.snapshotAccounts.find(a => a.id === action.input.accountId);\nif (!account) {\n  throw new AccountNotFoundError(`Account with ID ${action.input.accountId} not found`);\n}\n\nconst existingBalance = account.endingBalances.find(b => b.id === action.input.balanceId);\nif (existingBalance) {\n  existingBalance.token = action.input.token;\n  existingBalance.amount = action.input.amount;\n} else {\n  account.endingBalances.push({\n    id: action.input.balanceId,\n    token: action.input.token,\n    amount: action.input.amount\n  });\n}",
              schema:
                "input SetEndingBalanceInput {\n  accountId: OID!\n  balanceId: OID!\n  token: Currency!\n  amount: Amount_Currency!\n}",
              scope: "global",
              template:
                "Set or update an ending balance for a token in a snapshot account",
            },
            {
              description:
                "Remove a starting balance entry from a snapshot account",
              errors: [],
              examples: [],
              id: "remove-starting-balance",
              name: "REMOVE_STARTING_BALANCE",
              reducer:
                "const account = state.snapshotAccounts.find(a => a.id === action.input.accountId);\nif (!account) {\n  throw new AccountNotFoundError(`Account with ID ${action.input.accountId} not found`);\n}\n\nconst balanceIndex = account.startingBalances.findIndex(b => b.id === action.input.balanceId);\nif (balanceIndex === -1) {\n  throw new BalanceNotFoundError(`Balance with ID ${action.input.balanceId} not found`);\n}\n\naccount.startingBalances.splice(balanceIndex, 1);",
              schema:
                "input RemoveStartingBalanceInput {\n  accountId: OID!\n  balanceId: OID!\n}",
              scope: "global",
              template:
                "Remove a starting balance entry from a snapshot account",
            },
            {
              description:
                "Remove an ending balance entry from a snapshot account",
              errors: [],
              examples: [],
              id: "remove-ending-balance",
              name: "REMOVE_ENDING_BALANCE",
              reducer:
                "const account = state.snapshotAccounts.find(a => a.id === action.input.accountId);\nif (!account) {\n  throw new AccountNotFoundError(`Account with ID ${action.input.accountId} not found`);\n}\n\nconst balanceIndex = account.endingBalances.findIndex(b => b.id === action.input.balanceId);\nif (balanceIndex === -1) {\n  throw new BalanceNotFoundError(`Balance with ID ${action.input.balanceId} not found`);\n}\n\naccount.endingBalances.splice(balanceIndex, 1);",
              schema:
                "input RemoveEndingBalanceInput {\n  accountId: OID!\n  balanceId: OID!\n}",
              scope: "global",
              template:
                "Remove an ending balance entry from a snapshot account",
            },
          ],
        },
        {
          description: "Operations for managing snapshot transactions",
          id: "transactions",
          name: "transactions",
          operations: [
            {
              description:
                "Add a transaction to the snapshot with enrichment data",
              errors: [],
              examples: [],
              id: "add-transaction",
              name: "ADD_TRANSACTION",
              reducer:
                "const account = state.snapshotAccounts.find(a => a.id === action.input.accountId);\nif (!account) {\n  throw new AccountNotFoundError(`Account with ID ${action.input.accountId} not found`);\n}\n\nconst existingTransaction = account.transactions.find(t => t.id === action.input.id);\nif (existingTransaction) {\n  throw new DuplicateTransactionError(`Transaction with ID ${action.input.id} already exists`);\n}\n\nconst newTransaction = {\n  id: action.input.id,\n  transactionId: action.input.transactionId,\n  counterParty: action.input.counterParty || null,\n  amount: action.input.amount,\n  datetime: action.input.datetime,\n  txHash: action.input.txHash,\n  token: action.input.token,\n  blockNumber: action.input.blockNumber || null,\n  direction: action.input.direction,\n  flowType: action.input.flowType || null,\n  counterPartyAccountId: action.input.counterPartyAccountId || null\n};\n\naccount.transactions.push(newTransaction);",
              schema:
                "input AddTransactionInput {\n  accountId: OID!\n  id: OID!\n  transactionId: String!\n  counterParty: EthereumAddress\n  amount: Amount_Currency!\n  datetime: DateTime!\n  txHash: String!\n  token: Currency!\n  blockNumber: Int\n  direction: TransactionDirectionInput!\n  flowType: TransactionFlowTypeInput\n  counterPartyAccountId: OID\n}\n",
              scope: "global",
              template:
                "Add a transaction to the snapshot with enrichment data",
            },
            {
              description: "Remove a transaction from the snapshot",
              errors: [],
              examples: [],
              id: "remove-transaction",
              name: "REMOVE_TRANSACTION",
              reducer:
                "let found = false;\n\nfor (const account of state.snapshotAccounts) {\n  const transactionIndex = account.transactions.findIndex(t => t.id === action.input.id);\n  if (transactionIndex !== -1) {\n    account.transactions.splice(transactionIndex, 1);\n    found = true;\n    break;\n  }\n}\n\nif (!found) {\n  throw new TransactionNotFoundError(`Transaction with ID ${action.input.id} not found`);\n}",
              schema: "input RemoveTransactionInput {\n  id: OID!\n}",
              scope: "global",
              template: "Remove a transaction from the snapshot",
            },
            {
              description:
                "Update the flow type categorization of a transaction",
              errors: [],
              examples: [],
              id: "update-flow-type",
              name: "UPDATE_TRANSACTION_FLOW_TYPE",
              reducer:
                "let transaction = null;\n\nfor (const account of state.snapshotAccounts) {\n  transaction = account.transactions.find(t => t.id === action.input.id);\n  if (transaction) {\n    break;\n  }\n}\n\nif (!transaction) {\n  throw new TransactionNotFoundError(`Transaction with ID ${action.input.id} not found`);\n}\n\ntransaction.flowType = action.input.flowType;",
              schema:
                "input UpdateTransactionFlowTypeInput {\n  id: OID!\n  flowType: TransactionFlowTypeInput!\n}",
              scope: "global",
              template: "Update the flow type categorization of a transaction",
            },
          ],
        },
      ],
      state: {
        global: {
          examples: [],
          initialValue:
            '"{\\n  \\"accountsDocumentId\\": null,\\n  \\"startDate\\": null,\\n  \\"endDate\\": null,\\n  \\"reportName\\": null,\\n  \\"snapshotAccounts\\": []\\n}"',
          schema:
            "type SnapshotReportState {\n  accountsDocumentId: PHID\n  startDate: DateTime\n  endDate: DateTime\n  reportName: String\n  snapshotAccounts: [SnapshotAccount!]!\n}\n\ntype SnapshotAccount {\n  id: OID!\n  accountId: OID!\n  accountAddress: String!\n  accountName: String!\n  type: AccountType!\n  accountTransactionsId: PHID\n  startingBalances: [TokenBalance!]!\n  endingBalances: [TokenBalance!]!\n  transactions: [SnapshotTransaction!]!\n}\n\ntype TokenBalance {\n  id: OID!\n  token: Currency!\n  amount: Amount_Currency!\n}\n\ntype SnapshotTransaction {\n  id: OID!\n  transactionId: String!\n  counterParty: EthereumAddress\n  amount: Amount_Currency!\n  datetime: DateTime!\n  txHash: String!\n  token: Currency!\n  blockNumber: Int\n  direction: TransactionDirection!\n  flowType: TransactionFlowType\n  counterPartyAccountId: OID\n}\n\nenum AccountType {\n  Source\n  Internal\n  Destination\n  External\n}\n\nenum AccountTypeInput {\n  Source\n  Internal\n  Destination\n  External\n}\n\nenum TransactionDirection {\n  INFLOW\n  OUTFLOW\n}\n\nenum TransactionDirectionInput {\n  INFLOW\n  OUTFLOW\n}\n\nenum TransactionFlowType {\n  TopUp\n  Return\n  Internal\n  External\n}\n\nenum TransactionFlowTypeInput {\n  TopUp\n  Return\n  Internal\n  External\n}",
        },
        local: {
          examples: [],
          initialValue: '""',
          schema: "",
        },
      },
      version: 1,
    },
  ],
};
