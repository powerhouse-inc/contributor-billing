import type { Action } from "document-model";
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

export type UpdateCustomerWalletAction = Action & {
  type: "UPDATE_CUSTOMER_WALLET";
  input: UpdateCustomerWalletInput;
};
export type SetCustomerTypeAction = Action & {
  type: "SET_CUSTOMER_TYPE";
  input: SetCustomerTypeInput;
};
export type UpdateTeamMemberCountAction = Action & {
  type: "UPDATE_TEAM_MEMBER_COUNT";
  input: UpdateTeamMemberCountInput;
};
export type UpdateKycStatusAction = Action & {
  type: "UPDATE_KYC_STATUS";
  input: UpdateKycStatusInput;
};
export type AddCommunicationChannelAction = Action & {
  type: "ADD_COMMUNICATION_CHANNEL";
  input: AddCommunicationChannelInput;
};
export type RemoveCommunicationChannelAction = Action & {
  type: "REMOVE_COMMUNICATION_CHANNEL";
  input: RemoveCommunicationChannelInput;
};
export type SetPrimaryCommunicationChannelAction = Action & {
  type: "SET_PRIMARY_COMMUNICATION_CHANNEL";
  input: SetPrimaryCommunicationChannelInput;
};
export type VerifyCommunicationChannelAction = Action & {
  type: "VERIFY_COMMUNICATION_CHANNEL";
  input: VerifyCommunicationChannelInput;
};

export type SubscriptionInstanceCustomerAction =
  | UpdateCustomerWalletAction
  | SetCustomerTypeAction
  | UpdateTeamMemberCountAction
  | UpdateKycStatusAction
  | AddCommunicationChannelAction
  | RemoveCommunicationChannelAction
  | SetPrimaryCommunicationChannelAction
  | VerifyCommunicationChannelAction;
