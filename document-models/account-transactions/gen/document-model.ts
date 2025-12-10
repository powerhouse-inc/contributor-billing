import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Powerhouse",
    website: "https://powerhouse.inc",
  },
  description:
    "The AccountTransactions model is designed to track and manage all transactions associated with various accounts. Each transaction entry records critical details such as the source and destination accounts, transaction amount, timestamp, and specific transaction details tailored to the type of transaction (e.g., cryptocurrency or bank-related).",
  extension: ".phdm",
  id: "powerhouse/account-transactions",
  name: "AccountTransactions",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          description: "",
          id: "4155a659-ce1c-40af-aa15-f8daed5c8bb9",
          name: "transactions",
          operations: [
            {
              description: "",
              errors: [],
              examples: [],
              id: "455d3b21-245e-415f-a13f-0638c8621c1f",
              name: "ADD_TRANSACTION",
              reducer: "",
              schema:
                "input AddTransactionInput {\n    id: ID!\n    counterParty: EthereumAddress!\n    amount: Amount_Currency!\n    datetime: DateTime!\n    txHash: String!\n    token: Currency!\n    blockNumber: Int\n    budget: OID\n    accountingPeriod: String!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "85136596-ac66-4d51-afff-4e9d938eacf2",
              name: "UPDATE_TRANSACTION",
              reducer: "",
              schema:
                "input UpdateTransactionInput {\n    id: ID!\n    counterParty: EthereumAddress!\n    amount: Amount_Currency\n    datetime: DateTime\n    txHash: String\n    token: Currency\n    blockNumber: Int\n    budget: OID\n    accountingPeriod: String\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "a36e6833-29f5-42b0-89e7-796395b2bcfa",
              name: "DELETE_TRANSACTION",
              reducer: "",
              schema: "input DeleteTransactionInput {\n    id: ID!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "f04f4491-9ca9-4ceb-8fc7-7d181b36a4ab",
              name: "UPDATE_TRANSACTION_PERIOD",
              reducer: "",
              schema:
                "input UpdateTransactionPeriodInput {\n    id: ID!\n    accountingPeriod: String!\n}",
              scope: "global",
              template: "",
            },
          ],
        },
        {
          description: "",
          id: "eecc4935-5db5-439d-917d-0f3b9b22c014",
          name: "budgets",
          operations: [
            {
              description: "",
              errors: [],
              examples: [],
              id: "b0f87610-5ecd-4659-adad-5dccd61362f2",
              name: "ADD_BUDGET",
              reducer: "",
              schema:
                "input AddBudgetInput {\n    id: OID!\n    name: OLabel\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "3bc3dea9-9955-4c8b-8639-7e36cd1258d7",
              name: "UPDATE_BUDGET",
              reducer: "",
              schema:
                "input UpdateBudgetInput {\n    id: OID!\n    name: OLabel\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "88da5742-15c1-453e-a393-cc171e76b3cc",
              name: "DELETE_BUDGET",
              reducer: "",
              schema: "input DeleteBudgetInput {\n    id: OID!\n}",
              scope: "global",
              template: "",
            },
          ],
        },
        {
          description: "Account management operations",
          id: "1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
          name: "account",
          operations: [
            {
              description:
                "Set the account information including Ethereum address",
              errors: [],
              examples: [],
              id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
              name: "SET_ACCOUNT",
              reducer:
                "state.account.account = action.input.address;\nstate.account.name = action.input.name || action.input.address;",
              schema:
                "input SetAccountInput {\n    address: EthereumAddress!\n    name: String\n}",
              scope: "global",
              template: "",
            },
          ],
        },
      ],
      state: {
        global: {
          examples: [],
          initialValue:
            '"{\\n  \\"account\\": {\\n    \\"id\\": \\"\\",\\n    \\"account\\": \\"\\",\\n    \\"name\\": \\"\\",\\n    \\"budgetPath\\": null,\\n    \\"accountTransactionsId\\": null,\\n    \\"chain\\": null,\\n    \\"type\\": null,\\n    \\"owners\\": null,\\n    \\"KycAmlStatus\\": null\\n  },\\n  \\"transactions\\": [],\\n  \\"budgets\\": []\\n}"',
          schema:
            "type AccountTransactionsState {\n  account: Account!\n  transactions: [TransactionEntry!]!\n  budgets: [Budget!]!\n}\n\ntype Account {\n    id: OID!\n    account: String!\n    name: String!\n    budgetPath: String\n    accountTransactionsId: PHID\n    chain: [String!]\n    type: String\n    owners: [String!]\n    KycAmlStatus: String\n}\n\ntype TransactionDetails {\n    txHash: String!\n    token: Currency!\n    blockNumber: Int\n}\n\ntype TransactionEntry {\n    id: ID!\n    counterParty: EthereumAddress\n    amount: Amount_Currency!\n    datetime: DateTime!\n    details: TransactionDetails!\n    budget: OID\n    accountingPeriod: String! # Analytics engine period definition\n}\n\ntype Budget {\n    id: OID!\n    name: OLabel\n}",
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
