import { z } from "zod";
import type {
  AccountEntry,
  AccountType,
  AccountTypeInput,
  AccountsState,
  AddAccountInput,
  DeleteAccountInput,
  KycAmlStatusType,
  KycAmlStatusTypeInput,
  UpdateAccountInput,
  UpdateKycStatusInput,
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
  "Auditor",
  "Operational",
  "PaymentProcessor",
  "Protocol",
]);

export const AccountTypeInputSchema = z.enum([
  "Auditor",
  "Operational",
  "PaymentProcessor",
  "Protocol",
]);

export const KycAmlStatusTypeSchema = z.enum(["FAILED", "PASSED", "PENDING"]);

export const KycAmlStatusTypeInputSchema = z.enum([
  "FAILED",
  "PASSED",
  "PENDING",
]);

export function AccountEntrySchema(): z.ZodObject<Properties<AccountEntry>> {
  return z.object({
    __typename: z.literal("AccountEntry").optional(),
    KycAmlStatus: KycAmlStatusTypeSchema.nullable(),
    account: z.string(),
    accountTransactionsId: z.string().nullable(),
    budgetPath: z.string().nullable(),
    chain: z.array(z.string()).nullable(),
    id: z.string(),
    name: z.string(),
    owners: z.array(z.string()).nullable(),
    type: AccountTypeSchema.nullable(),
  });
}

export function AccountsStateSchema(): z.ZodObject<Properties<AccountsState>> {
  return z.object({
    __typename: z.literal("AccountsState").optional(),
    accounts: z.array(AccountEntrySchema()),
  });
}

export function AddAccountInputSchema(): z.ZodObject<
  Properties<AddAccountInput>
> {
  return z.object({
    KycAmlStatus: z.lazy(() => KycAmlStatusTypeInputSchema.nullish()),
    account: z.string(),
    accountTransactionsId: z.string().nullish(),
    budgetPath: z.string().nullish(),
    chain: z.array(z.string()).nullish(),
    id: z.string(),
    name: z.string(),
    owners: z.array(z.string()).nullish(),
    type: z.lazy(() => AccountTypeInputSchema.nullish()),
  });
}

export function DeleteAccountInputSchema(): z.ZodObject<
  Properties<DeleteAccountInput>
> {
  return z.object({
    id: z.string(),
  });
}

export function UpdateAccountInputSchema(): z.ZodObject<
  Properties<UpdateAccountInput>
> {
  return z.object({
    KycAmlStatus: z.lazy(() => KycAmlStatusTypeInputSchema.nullish()),
    account: z.string().nullish(),
    accountTransactionsId: z.string().nullish(),
    budgetPath: z.string().nullish(),
    chain: z.array(z.string()).nullish(),
    id: z.string(),
    name: z.string().nullish(),
    owners: z.array(z.string()).nullish(),
    type: z.lazy(() => AccountTypeInputSchema.nullish()),
  });
}

export function UpdateKycStatusInputSchema(): z.ZodObject<
  Properties<UpdateKycStatusInput>
> {
  return z.object({
    KycAmlStatus: z.lazy(() => KycAmlStatusTypeInputSchema),
    id: z.string(),
  });
}
