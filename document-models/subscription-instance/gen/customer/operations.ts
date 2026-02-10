import { type SignalDispatch } from "document-model";
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
import type { SubscriptionInstanceState } from "../types.js";

export interface SubscriptionInstanceCustomerOperations {
  updateCustomerWalletOperation: (
    state: SubscriptionInstanceState,
    action: UpdateCustomerWalletAction,
    dispatch?: SignalDispatch,
  ) => void;
  setCustomerTypeOperation: (
    state: SubscriptionInstanceState,
    action: SetCustomerTypeAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateTeamMemberCountOperation: (
    state: SubscriptionInstanceState,
    action: UpdateTeamMemberCountAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateKycStatusOperation: (
    state: SubscriptionInstanceState,
    action: UpdateKycStatusAction,
    dispatch?: SignalDispatch,
  ) => void;
  addCommunicationChannelOperation: (
    state: SubscriptionInstanceState,
    action: AddCommunicationChannelAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeCommunicationChannelOperation: (
    state: SubscriptionInstanceState,
    action: RemoveCommunicationChannelAction,
    dispatch?: SignalDispatch,
  ) => void;
  setPrimaryCommunicationChannelOperation: (
    state: SubscriptionInstanceState,
    action: SetPrimaryCommunicationChannelAction,
    dispatch?: SignalDispatch,
  ) => void;
  verifyCommunicationChannelOperation: (
    state: SubscriptionInstanceState,
    action: VerifyCommunicationChannelAction,
    dispatch?: SignalDispatch,
  ) => void;
}
