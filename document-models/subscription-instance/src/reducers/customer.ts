import type { SubscriptionInstanceCustomerOperations } from "@powerhousedao/contributor-billing/document-models/subscription-instance";

export const subscriptionInstanceCustomerOperations: SubscriptionInstanceCustomerOperations =
  {
    updateCustomerWalletOperation(state, action) {
      state.customerWalletAddress = action.input.walletAddress || null;
    },

    setCustomerTypeOperation(state, action) {
      const { input } = action;
      state.customerType = input.customerType;
      if (
        input.teamMemberCount !== undefined &&
        input.teamMemberCount !== null
      ) {
        state.teamMemberCount = input.teamMemberCount;
      }
    },

    updateTeamMemberCountOperation(state, action) {
      state.teamMemberCount = action.input.teamMemberCount;
    },

    updateKycStatusOperation(state, action) {
      state.kycStatus = action.input.kycStatus;
    },

    addCommunicationChannelOperation(state, action) {
      const { input } = action;

      // If this channel is primary, unset all other primary channels
      if (input.isPrimary) {
        state.communications.forEach((channel) => {
          channel.isPrimary = false;
        });
      }

      state.communications.push({
        id: input.channelId,
        type: input.type,
        identifier: input.identifier,
        isPrimary: input.isPrimary,
        verifiedAt: input.verifiedAt || null,
      });
    },

    removeCommunicationChannelOperation(state, action) {
      const index = state.communications.findIndex(
        (c) => c.id === action.input.channelId,
      );
      if (index !== -1) {
        state.communications.splice(index, 1);
      }
    },

    setPrimaryCommunicationChannelOperation(state, action) {
      const { channelId } = action.input;

      // Unset all primary flags first
      state.communications.forEach((channel) => {
        channel.isPrimary = channel.id === channelId;
      });
    },

    verifyCommunicationChannelOperation(state, action) {
      const { input } = action;
      const channel = state.communications.find(
        (c) => c.id === input.channelId,
      );
      if (channel) {
        channel.verifiedAt = input.verifiedAt;
      }
    },
  };
