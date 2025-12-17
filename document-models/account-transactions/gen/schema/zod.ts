import { z } from "zod";
import type {
  Account,
  AccountTransactionsState,
  AddBudgetInput,
  AddTransactionInput,
  Budget,
  DeleteBudgetInput,
  DeleteTransactionInput,
  SetAccountInput,
  TransactionDetails,
  TransactionDirection,
  TransactionDirectionInput,
  TransactionEntry,
  UpdateBudgetInput,
  UpdateTransactionInput,
  UpdateTransactionPeriodInput,
} from "./types.js";

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export const TransactionDirectionSchema = z.enum(["INFLOW", "OUTFLOW"]);

export const TransactionDirectionInputSchema = z.enum(["INFLOW", "OUTFLOW"]);

export function AccountSchema(): z.ZodObject<Properties<Account>> {
  return z.object({
    __typename: z.literal("Account").optional(),
    KycAmlStatus: z.string().nullable(),
    account: z.string(),
    accountTransactionsId: z.string().nullable(),
    budgetPath: z.string().nullable(),
    chain: z.array(z.string()).nullable(),
    id: z.string(),
    name: z.string(),
    owners: z.array(z.string()).nullable(),
    type: z.string().nullable(),
  });
}

export function AccountTransactionsStateSchema(): z.ZodObject<
  Properties<AccountTransactionsState>
> {
  return z.object({
    __typename: z.literal("AccountTransactionsState").optional(),
    account: AccountSchema(),
    budgets: z.array(BudgetSchema()),
    transactions: z.array(TransactionEntrySchema()),
  });
}

export function AddBudgetInputSchema(): z.ZodObject<
  Properties<AddBudgetInput>
> {
  return z.object({
    id: z.string(),
    name: z.string().nullish(),
  });
}

export function AddTransactionInputSchema(): z.ZodObject<
  Properties<AddTransactionInput>
> {
  return z.object({
    accountingPeriod: z.string(),
    amount: z.object({ unit: z.string(), value: z.string() }),
    blockNumber: z.number().nullish(),
    budget: z.string().nullish(),
    counterParty: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Invalid Ethereum address format",
    }),
    datetime: z.string().datetime(),
    direction: z.lazy(() => TransactionDirectionInputSchema),
    id: z.string(),
    token: z.string(),
    txHash: z.string(),
  });
}

export function BudgetSchema(): z.ZodObject<Properties<Budget>> {
  return z.object({
    __typename: z.literal("Budget").optional(),
    id: z.string(),
    name: z.string().nullable(),
  });
}

export function DeleteBudgetInputSchema(): z.ZodObject<
  Properties<DeleteBudgetInput>
> {
  return z.object({
    id: z.string(),
  });
}

export function DeleteTransactionInputSchema(): z.ZodObject<
  Properties<DeleteTransactionInput>
> {
  return z.object({
    id: z.string(),
  });
}

export function SetAccountInputSchema(): z.ZodObject<
  Properties<SetAccountInput>
> {
  return z.object({
    address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Invalid Ethereum address format",
    }),
    name: z.string().nullish(),
  });
}

export function TransactionDetailsSchema(): z.ZodObject<
  Properties<TransactionDetails>
> {
  return z.object({
    __typename: z.literal("TransactionDetails").optional(),
    blockNumber: z.number().nullable(),
    token: z.string(),
    txHash: z.string(),
  });
}

export function TransactionEntrySchema(): z.ZodObject<
  Properties<TransactionEntry>
> {
  return z.object({
    __typename: z.literal("TransactionEntry").optional(),
    accountingPeriod: z.string(),
    amount: z.object({ unit: z.string(), value: z.string() }),
    budget: z.string().nullable(),
    counterParty: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullable(),
    datetime: z.string().datetime(),
    details: TransactionDetailsSchema(),
    direction: TransactionDirectionSchema,
    id: z.string(),
  });
}

export function UpdateBudgetInputSchema(): z.ZodObject<
  Properties<UpdateBudgetInput>
> {
  return z.object({
    id: z.string(),
    name: z.string().nullish(),
  });
}

export function UpdateTransactionInputSchema(): z.ZodObject<
  Properties<UpdateTransactionInput>
> {
  return z.object({
    accountingPeriod: z.string().nullish(),
    amount: z.object({ unit: z.string(), value: z.string() }).nullish(),
    blockNumber: z.number().nullish(),
    budget: z.string().nullish(),
    counterParty: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullish(),
    datetime: z.string().datetime().nullish(),
    direction: z.lazy(() => TransactionDirectionInputSchema.nullish()),
    id: z.string(),
    token: z.string().nullish(),
    txHash: z.string().nullish(),
  });
}

export function UpdateTransactionPeriodInputSchema(): z.ZodObject<
  Properties<UpdateTransactionPeriodInput>
> {
  return z.object({
    accountingPeriod: z.string(),
    id: z.string(),
  });
}
