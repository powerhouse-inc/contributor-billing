import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isSubscriptionInstanceDocument,
  updateCustomerWallet,
  setCustomerType,
  updateTeamMemberCount,
  updateKycStatus,
  addCommunicationChannel,
  removeCommunicationChannel,
  setPrimaryCommunicationChannel,
  verifyCommunicationChannel,
  UpdateCustomerWalletInputSchema,
  SetCustomerTypeInputSchema,
  UpdateTeamMemberCountInputSchema,
  UpdateKycStatusInputSchema,
  AddCommunicationChannelInputSchema,
  RemoveCommunicationChannelInputSchema,
  SetPrimaryCommunicationChannelInputSchema,
  VerifyCommunicationChannelInputSchema,
} from "@powerhousedao/contributor-billing/document-models/subscription-instance";

describe("CustomerOperations", () => {
  it("should handle updateCustomerWallet operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateCustomerWalletInputSchema());

    const updatedDocument = reducer(document, updateCustomerWallet(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_CUSTOMER_WALLET",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle setCustomerType operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetCustomerTypeInputSchema());

    const updatedDocument = reducer(document, setCustomerType(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_CUSTOMER_TYPE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle updateTeamMemberCount operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateTeamMemberCountInputSchema());

    const updatedDocument = reducer(document, updateTeamMemberCount(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_TEAM_MEMBER_COUNT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle updateKycStatus operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateKycStatusInputSchema());

    const updatedDocument = reducer(document, updateKycStatus(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_KYC_STATUS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle addCommunicationChannel operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddCommunicationChannelInputSchema());

    const updatedDocument = reducer(document, addCommunicationChannel(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_COMMUNICATION_CHANNEL",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle removeCommunicationChannel operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RemoveCommunicationChannelInputSchema());

    const updatedDocument = reducer(
      document,
      removeCommunicationChannel(input),
    );

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_COMMUNICATION_CHANNEL",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle setPrimaryCommunicationChannel operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetPrimaryCommunicationChannelInputSchema());

    const updatedDocument = reducer(
      document,
      setPrimaryCommunicationChannel(input),
    );

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_PRIMARY_COMMUNICATION_CHANNEL",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle verifyCommunicationChannel operation", () => {
    const document = utils.createDocument();
    const input = generateMock(VerifyCommunicationChannelInputSchema());

    const updatedDocument = reducer(
      document,
      verifyCommunicationChannel(input),
    );

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "VERIFY_COMMUNICATION_CHANNEL",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
