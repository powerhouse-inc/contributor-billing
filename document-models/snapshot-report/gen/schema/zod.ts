import { z } from "zod";
import type {
  AccountType,
  AccountTypeInput,
  AddSnapshotAccountInput,
  AddTransactionInput,
  RecalculateFlowTypesInput,
  RemoveEndingBalanceInput,
  RemoveSnapshotAccountInput,
  RemoveStartingBalanceInput,
  RemoveTransactionInput,
  SetAccountsDocumentInput,
  SetEndingBalanceInput,
  SetOwnerIdInput,
  SetPeriodInput,
  SetReportConfigInput,
  SetStartingBalanceInput,
  SnapshotAccount,
  SnapshotReportState,
  SnapshotTransaction,
  TokenBalance,
  TransactionDirection,
  TransactionDirectionInput,
  TransactionFlowType,
  TransactionFlowTypeInput,
  UpdateSnapshotAccountTypeInput,
  UpdateTransactionFlowTypeInput,
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

export const AccountTypeSchema = z.enum([
  "Destination",
  "External",
  "Internal",
  "Source",
]);

export const AccountTypeInputSchema = z.enum([
  "Destination",
  "External",
  "Internal",
  "Source",
]);

export const TransactionDirectionSchema = z.enum(["INFLOW", "OUTFLOW"]);

export const TransactionDirectionInputSchema = z.enum(["INFLOW", "OUTFLOW"]);

export const TransactionFlowTypeSchema = z.enum([
  "External",
  "Internal",
  "Return",
  "TopUp",
]);

export const TransactionFlowTypeInputSchema = z.enum([
  "External",
  "Internal",
  "Return",
  "TopUp",
]);

export function AddSnapshotAccountInputSchema(): z.ZodObject<
  Properties<AddSnapshotAccountInput>
> {
  return z.object({
    accountAddress: z.string(),
    accountId: z.string(),
    accountName: z.string(),
    accountTransactionsId: z.string().nullish(),
    id: z.string(),
    type: z.lazy(() => AccountTypeInputSchema),
  });
}

export function AddTransactionInputSchema(): z.ZodObject<
  Properties<AddTransactionInput>
> {
  return z.object({
    accountId: z.string(),
    amount: z.object({ unit: z.string(), value: z.string() }),
    blockNumber: z.number().nullish(),
    counterParty: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullish(),
    counterPartyAccountId: z.string().nullish(),
    datetime: z.string().datetime(),
    direction: z.lazy(() => TransactionDirectionInputSchema),
    flowType: z.lazy(() => TransactionFlowTypeInputSchema.nullish()),
    id: z.string(),
    token: z.string(),
    transactionId: z.string(),
    txHash: z.string(),
  });
}

export function RecalculateFlowTypesInputSchema(): z.ZodObject<
  Properties<RecalculateFlowTypesInput>
> {
  return z.object({
    _: z.string().nullish(),
  });
}

export function RemoveEndingBalanceInputSchema(): z.ZodObject<
  Properties<RemoveEndingBalanceInput>
> {
  return z.object({
    accountId: z.string(),
    balanceId: z.string(),
  });
}

export function RemoveSnapshotAccountInputSchema(): z.ZodObject<
  Properties<RemoveSnapshotAccountInput>
> {
  return z.object({
    id: z.string(),
  });
}

export function RemoveStartingBalanceInputSchema(): z.ZodObject<
  Properties<RemoveStartingBalanceInput>
> {
  return z.object({
    accountId: z.string(),
    balanceId: z.string(),
  });
}

export function RemoveTransactionInputSchema(): z.ZodObject<
  Properties<RemoveTransactionInput>
> {
  return z.object({
    id: z.string(),
  });
}

export function SetAccountsDocumentInputSchema(): z.ZodObject<
  Properties<SetAccountsDocumentInput>
> {
  return z.object({
    accountsDocumentId: z.string(),
  });
}

export function SetEndingBalanceInputSchema(): z.ZodObject<
  Properties<SetEndingBalanceInput>
> {
  return z.object({
    accountId: z.string(),
    amount: z.object({ unit: z.string(), value: z.string() }),
    balanceId: z.string(),
    token: z.string(),
  });
}

export function SetOwnerIdInputSchema(): z.ZodObject<
  Properties<SetOwnerIdInput>
> {
  return z.object({
    ownerId: z.string(),
  });
}

export function SetPeriodInputSchema(): z.ZodObject<
  Properties<SetPeriodInput>
> {
  return z.object({
    endDate: z.string().datetime(),
    startDate: z.string().datetime(),
  });
}

export function SetReportConfigInputSchema(): z.ZodObject<
  Properties<SetReportConfigInput>
> {
  return z.object({
    accountsDocumentId: z.string().nullish(),
    endDate: z.string().datetime().nullish(),
    ownerId: z.string().nullish(),
    reportName: z.string().nullish(),
    startDate: z.string().datetime().nullish(),
  });
}

export function SetStartingBalanceInputSchema(): z.ZodObject<
  Properties<SetStartingBalanceInput>
> {
  return z.object({
    accountId: z.string(),
    amount: z.object({ unit: z.string(), value: z.string() }),
    balanceId: z.string(),
    token: z.string(),
  });
}

export function SnapshotAccountSchema(): z.ZodObject<
  Properties<SnapshotAccount>
> {
  return z.object({
    __typename: z.literal("SnapshotAccount").optional(),
    accountAddress: z.string(),
    accountId: z.string(),
    accountName: z.string(),
    accountTransactionsId: z.string().nullable(),
    endingBalances: z.array(TokenBalanceSchema()),
    id: z.string(),
    startingBalances: z.array(TokenBalanceSchema()),
    transactions: z.array(SnapshotTransactionSchema()),
    type: AccountTypeSchema,
  });
}

export function SnapshotReportStateSchema(): z.ZodObject<
  Properties<SnapshotReportState>
> {
  return z.object({
    __typename: z.literal("SnapshotReportState").optional(),
    accountsDocumentId: z.string().nullable(),
    endDate: z.string().datetime().nullable(),
    ownerId: z.string().nullable(),
    reportName: z.string().nullable(),
    snapshotAccounts: z.array(SnapshotAccountSchema()),
    startDate: z.string().datetime().nullable(),
  });
}

export function SnapshotTransactionSchema(): z.ZodObject<
  Properties<SnapshotTransaction>
> {
  return z.object({
    __typename: z.literal("SnapshotTransaction").optional(),
    amount: z.object({ unit: z.string(), value: z.string() }),
    blockNumber: z.number().nullable(),
    counterParty: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullable(),
    counterPartyAccountId: z.string().nullable(),
    datetime: z.string().datetime(),
    direction: TransactionDirectionSchema,
    flowType: TransactionFlowTypeSchema.nullable(),
    id: z.string(),
    token: z.string(),
    transactionId: z.string(),
    txHash: z.string(),
  });
}

export function TokenBalanceSchema(): z.ZodObject<Properties<TokenBalance>> {
  return z.object({
    __typename: z.literal("TokenBalance").optional(),
    amount: z.object({ unit: z.string(), value: z.string() }),
    id: z.string(),
    token: z.string(),
  });
}

export function UpdateSnapshotAccountTypeInputSchema(): z.ZodObject<
  Properties<UpdateSnapshotAccountTypeInput>
> {
  return z.object({
    id: z.string(),
    type: z.lazy(() => AccountTypeInputSchema),
  });
}

export function UpdateTransactionFlowTypeInputSchema(): z.ZodObject<
  Properties<UpdateTransactionFlowTypeInput>
> {
  return z.object({
    flowType: z.lazy(() => TransactionFlowTypeInputSchema),
    id: z.string(),
  });
}
