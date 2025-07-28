import { z } from "zod";
import type {
  GnosisSafe,
  GoogleCloud,
  GoogleKeyFile,
  GoogleKeyFileInput,
  IntegrationsState,
  RequestFinance,
  SetGnosisSafeInput,
  SetGoogleCloudInput,
  SetRequestFinanceInput,
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

export function GnosisSafeSchema(): z.ZodObject<Properties<GnosisSafe>> {
  return z.object({
    __typename: z.literal("GnosisSafe").optional(),
    safeAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullable(),
    signerPrivateKey: z.string().nullable(),
  });
}

export function GoogleCloudSchema(): z.ZodObject<Properties<GoogleCloud>> {
  return z.object({
    __typename: z.literal("GoogleCloud").optional(),
    keyFile: GoogleKeyFileSchema().nullable(),
    location: z.string().nullable(),
    processorId: z.string().nullable(),
    projectId: z.string().nullable(),
  });
}

export function GoogleKeyFileSchema(): z.ZodObject<Properties<GoogleKeyFile>> {
  return z.object({
    __typename: z.literal("GoogleKeyFile").optional(),
    auth_provider_x509_cert_url: z.string().nullable(),
    auth_uri: z.string().nullable(),
    client_email: z.string().nullable(),
    client_id: z.string().nullable(),
    client_x509_cert_url: z.string().nullable(),
    private_key: z.string().nullable(),
    private_key_id: z.string().nullable(),
    project_id: z.string().nullable(),
    token_uri: z.string().nullable(),
    type: z.string().nullable(),
    universe_domain: z.string().nullable(),
  });
}

export function GoogleKeyFileInputSchema(): z.ZodObject<
  Properties<GoogleKeyFileInput>
> {
  return z.object({
    auth_provider_x509_cert_url: z.string().nullish(),
    auth_uri: z.string().nullish(),
    client_email: z.string().nullish(),
    client_id: z.string().nullish(),
    client_x509_cert_url: z.string().nullish(),
    private_key: z.string().nullish(),
    private_key_id: z.string().nullish(),
    project_id: z.string().nullish(),
    token_uri: z.string().nullish(),
    type: z.string().nullish(),
    universe_domain: z.string().nullish(),
  });
}

export function IntegrationsStateSchema(): z.ZodObject<
  Properties<IntegrationsState>
> {
  return z.object({
    __typename: z.literal("IntegrationsState").optional(),
    gnosisSafe: GnosisSafeSchema().nullable(),
    googleCloud: GoogleCloudSchema().nullable(),
    requestFinance: RequestFinanceSchema().nullable(),
  });
}

export function RequestFinanceSchema(): z.ZodObject<
  Properties<RequestFinance>
> {
  return z.object({
    __typename: z.literal("RequestFinance").optional(),
    apiKey: z.string().nullable(),
    email: z.string().nullable(),
  });
}

export function SetGnosisSafeInputSchema(): z.ZodObject<
  Properties<SetGnosisSafeInput>
> {
  return z.object({
    safeAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullish(),
    signerPrivateKey: z.string().nullish(),
  });
}

export function SetGoogleCloudInputSchema(): z.ZodObject<
  Properties<SetGoogleCloudInput>
> {
  return z.object({
    keyFile: z.lazy(() => GoogleKeyFileInputSchema().nullish()),
    location: z.string().nullish(),
    processorId: z.string().nullish(),
    projectId: z.string().nullish(),
  });
}

export function SetRequestFinanceInputSchema(): z.ZodObject<
  Properties<SetRequestFinanceInput>
> {
  return z.object({
    apiKey: z.string().nullish(),
    email: z.string().nullish(),
  });
}
