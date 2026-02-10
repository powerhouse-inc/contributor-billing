import { createAction } from "document-model/core";
import {
  UpdateCustomerWalletInputSchema,
  SetCustomerTypeInputSchema,
  UpdateTeamMemberCountInputSchema,
  UpdateKycStatusInputSchema,
  AddCommunicationChannelInputSchema,
  RemoveCommunicationChannelInputSchema,
  SetPrimaryCommunicationChannelInputSchema,
  VerifyCommunicationChannelInputSchema,
} from "../schema/zod.js";
import type {
  UpdateCustomerWalletInput,
  SetCustomerTypeInput,
  UpdateTeamMemberCountInput,
  UpdateKycStatusInput,
  AddCommunicationChannelInput,
  RemoveCommunicationChannelInput,
  SetPrimaryCommunicationChannelInput,
  VerifyCommunicationChannelInput,
} from "../types.js";
import type {
  UpdateCustomerWalletAction,
  SetCustomerTypeAction,
  UpdateTeamMemberCountAction,
  UpdateKycStatusAction,
  AddCommunicationChannelAction,
  RemoveCommunicationChannelAction,
  SetPrimaryCommunicationChannelAction,
  VerifyCommunicationChannelAction,
} from "./actions.js";

export const updateCustomerWallet = (input: UpdateCustomerWalletInput) =>
  createAction<UpdateCustomerWalletAction>(
    "UPDATE_CUSTOMER_WALLET",
    { ...input },
    undefined,
    UpdateCustomerWalletInputSchema,
    "global",
  );

export const setCustomerType = (input: SetCustomerTypeInput) =>
  createAction<SetCustomerTypeAction>(
    "SET_CUSTOMER_TYPE",
    { ...input },
    undefined,
    SetCustomerTypeInputSchema,
    "global",
  );

export const updateTeamMemberCount = (input: UpdateTeamMemberCountInput) =>
  createAction<UpdateTeamMemberCountAction>(
    "UPDATE_TEAM_MEMBER_COUNT",
    { ...input },
    undefined,
    UpdateTeamMemberCountInputSchema,
    "global",
  );

export const updateKycStatus = (input: UpdateKycStatusInput) =>
  createAction<UpdateKycStatusAction>(
    "UPDATE_KYC_STATUS",
    { ...input },
    undefined,
    UpdateKycStatusInputSchema,
    "global",
  );

export const addCommunicationChannel = (input: AddCommunicationChannelInput) =>
  createAction<AddCommunicationChannelAction>(
    "ADD_COMMUNICATION_CHANNEL",
    { ...input },
    undefined,
    AddCommunicationChannelInputSchema,
    "global",
  );

export const removeCommunicationChannel = (
  input: RemoveCommunicationChannelInput,
) =>
  createAction<RemoveCommunicationChannelAction>(
    "REMOVE_COMMUNICATION_CHANNEL",
    { ...input },
    undefined,
    RemoveCommunicationChannelInputSchema,
    "global",
  );

export const setPrimaryCommunicationChannel = (
  input: SetPrimaryCommunicationChannelInput,
) =>
  createAction<SetPrimaryCommunicationChannelAction>(
    "SET_PRIMARY_COMMUNICATION_CHANNEL",
    { ...input },
    undefined,
    SetPrimaryCommunicationChannelInputSchema,
    "global",
  );

export const verifyCommunicationChannel = (
  input: VerifyCommunicationChannelInput,
) =>
  createAction<VerifyCommunicationChannelAction>(
    "VERIFY_COMMUNICATION_CHANNEL",
    { ...input },
    undefined,
    VerifyCommunicationChannelInputSchema,
    "global",
  );
