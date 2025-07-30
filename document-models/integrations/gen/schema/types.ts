export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Amount: {
    input: { unit?: string; value?: number };
    output: { unit?: string; value?: number };
  };
  Amount_Crypto: {
    input: { unit: string; value: string };
    output: { unit: string; value: string };
  };
  Amount_Currency: {
    input: { unit: string; value: string };
    output: { unit: string; value: string };
  };
  Amount_Fiat: {
    input: { unit: string; value: number };
    output: { unit: string; value: number };
  };
  Amount_Money: { input: number; output: number };
  Amount_Percentage: { input: number; output: number };
  Amount_Tokens: { input: number; output: number };
  Currency: { input: string; output: string };
  Date: { input: string; output: string };
  DateTime: { input: string; output: string };
  EmailAddress: { input: string; output: string };
  EthereumAddress: { input: string; output: string };
  OID: { input: string; output: string };
  OLabel: { input: string; output: string };
  PHID: { input: string; output: string };
  URL: { input: string; output: string };
};

export type GnosisSafe = {
  safeAddress: Maybe<Scalars["EthereumAddress"]["output"]>;
  signerPrivateKey: Maybe<Scalars["String"]["output"]>;
};

export type GoogleCloud = {
  keyFile: Maybe<GoogleKeyFile>;
  location: Maybe<Scalars["String"]["output"]>;
  processorId: Maybe<Scalars["String"]["output"]>;
  projectId: Maybe<Scalars["String"]["output"]>;
};

export type GoogleKeyFile = {
  auth_provider_x509_cert_url: Maybe<Scalars["String"]["output"]>;
  auth_uri: Maybe<Scalars["String"]["output"]>;
  client_email: Maybe<Scalars["String"]["output"]>;
  client_id: Maybe<Scalars["String"]["output"]>;
  client_x509_cert_url: Maybe<Scalars["String"]["output"]>;
  private_key: Maybe<Scalars["String"]["output"]>;
  private_key_id: Maybe<Scalars["String"]["output"]>;
  project_id: Maybe<Scalars["String"]["output"]>;
  token_uri: Maybe<Scalars["String"]["output"]>;
  type: Maybe<Scalars["String"]["output"]>;
  universe_domain: Maybe<Scalars["String"]["output"]>;
};

export type GoogleKeyFileInput = {
  auth_provider_x509_cert_url?: InputMaybe<Scalars["String"]["input"]>;
  auth_uri?: InputMaybe<Scalars["String"]["input"]>;
  client_email?: InputMaybe<Scalars["String"]["input"]>;
  client_id?: InputMaybe<Scalars["String"]["input"]>;
  client_x509_cert_url?: InputMaybe<Scalars["String"]["input"]>;
  private_key?: InputMaybe<Scalars["String"]["input"]>;
  private_key_id?: InputMaybe<Scalars["String"]["input"]>;
  project_id?: InputMaybe<Scalars["String"]["input"]>;
  token_uri?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  universe_domain?: InputMaybe<Scalars["String"]["input"]>;
};

export type IntegrationsState = {
  gnosisSafe: Maybe<GnosisSafe>;
  googleCloud: Maybe<GoogleCloud>;
  requestFinance: Maybe<RequestFinance>;
};

export type RequestFinance = {
  apiKey: Maybe<Scalars["String"]["output"]>;
  email: Maybe<Scalars["String"]["output"]>;
};

export type SetGnosisSafeInput = {
  safeAddress?: InputMaybe<Scalars["EthereumAddress"]["input"]>;
  signerPrivateKey?: InputMaybe<Scalars["String"]["input"]>;
};

export type SetGoogleCloudInput = {
  keyFile?: InputMaybe<GoogleKeyFileInput>;
  location?: InputMaybe<Scalars["String"]["input"]>;
  processorId?: InputMaybe<Scalars["String"]["input"]>;
  projectId?: InputMaybe<Scalars["String"]["input"]>;
};

export type SetRequestFinanceInput = {
  apiKey?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
};
