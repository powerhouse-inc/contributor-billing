import type { ServiceOfferingTierManagementOperations } from "@powerhousedao/contributor-billing/document-models/service-offering";

export const serviceOfferingTierManagementOperations: ServiceOfferingTierManagementOperations =
  {
    addTierOperation(state, action) {
      state.tiers.push({
        id: action.input.id,
        name: action.input.name,
        description: action.input.description || null,
        serviceLevels: [],
        usageLimits: [],
        pricing: {
          amount: action.input.amount || null,
          currency: action.input.currency,
          billingCycle: action.input.billingCycle,
          setupFee: action.input.setupFee || null,
        },
        isCustomPricing: action.input.isCustomPricing || false,
      });
      state.lastModified = action.input.lastModified;
    },
    updateTierOperation(state, action) {
      const tier = state.tiers.find((t) => t.id === action.input.id);
      if (tier) {
        if (action.input.name) {
          tier.name = action.input.name;
        }
        if (
          action.input.description !== undefined &&
          action.input.description !== null
        ) {
          tier.description = action.input.description;
        }
        if (
          action.input.isCustomPricing !== undefined &&
          action.input.isCustomPricing !== null
        ) {
          tier.isCustomPricing = action.input.isCustomPricing;
        }
      }
      state.lastModified = action.input.lastModified;
    },
    updateTierPricingOperation(state, action) {
      const tier = state.tiers.find((t) => t.id === action.input.tierId);
      if (tier) {
        if (action.input.amount !== undefined) {
          tier.pricing.amount = action.input.amount;
        }
        if (action.input.currency) {
          tier.pricing.currency = action.input.currency;
        }
        if (action.input.billingCycle) {
          tier.pricing.billingCycle = action.input.billingCycle;
        }
        if (action.input.setupFee !== undefined) {
          tier.pricing.setupFee = action.input.setupFee;
        }
      }
      state.lastModified = action.input.lastModified;
    },
    deleteTierOperation(state, action) {
      const tierIndex = state.tiers.findIndex((t) => t.id === action.input.id);
      if (tierIndex !== -1) {
        state.tiers.splice(tierIndex, 1);
      }
      state.lastModified = action.input.lastModified;
    },
    addServiceLevelOperation(state, action) {
      const tier = state.tiers.find((t) => t.id === action.input.tierId);
      if (tier) {
        tier.serviceLevels.push({
          id: action.input.serviceLevelId,
          serviceId: action.input.serviceId,
          level: action.input.level,
          optionGroupId: action.input.optionGroupId || null,
          variations: action.input.variations || null,
          annexes: action.input.annexes || null,
          customValue: action.input.customValue || null,
          setupFee: action.input.setupFee || null,
        });
      }
      state.lastModified = action.input.lastModified;
    },
    updateServiceLevelOperation(state, action) {
      const tier = state.tiers.find((t) => t.id === action.input.tierId);
      if (tier) {
        const serviceLevel = tier.serviceLevels.find(
          (sl) => sl.id === action.input.serviceLevelId,
        );
        if (serviceLevel) {
          if (action.input.level) {
            serviceLevel.level = action.input.level;
          }
          if (action.input.optionGroupId !== undefined) {
            serviceLevel.optionGroupId = action.input.optionGroupId || null;
          }
          if (action.input.variations !== undefined) {
            serviceLevel.variations = action.input.variations || null;
          }
          if (action.input.annexes !== undefined) {
            serviceLevel.annexes = action.input.annexes || null;
          }
          if (action.input.customValue !== undefined) {
            serviceLevel.customValue = action.input.customValue || null;
          }
          if (action.input.setupFee !== undefined) {
            serviceLevel.setupFee = action.input.setupFee || null;
          }
        }
      }
      state.lastModified = action.input.lastModified;
    },
    removeServiceLevelOperation(state, action) {
      const tier = state.tiers.find((t) => t.id === action.input.tierId);
      if (tier) {
        const serviceLevelIndex = tier.serviceLevels.findIndex(
          (sl) => sl.id === action.input.serviceLevelId,
        );
        if (serviceLevelIndex !== -1) {
          tier.serviceLevels.splice(serviceLevelIndex, 1);
        }
      }
      state.lastModified = action.input.lastModified;
    },
    addUsageLimitOperation(state, action) {
      const tier = state.tiers.find((t) => t.id === action.input.tierId);
      if (tier) {
        tier.usageLimits.push({
          id: action.input.limitId,
          serviceId: action.input.serviceId,
          metric: action.input.metric,
          limit: action.input.limit || null,
          resetPeriod: action.input.resetPeriod || null,
          notes: action.input.notes || null,
        });
      }
      state.lastModified = action.input.lastModified;
    },
    updateUsageLimitOperation(state, action) {
      const tier = state.tiers.find((t) => t.id === action.input.tierId);
      if (tier) {
        const usageLimit = tier.usageLimits.find(
          (ul) => ul.id === action.input.limitId,
        );
        if (usageLimit) {
          if (action.input.metric) {
            usageLimit.metric = action.input.metric;
          }
          if (action.input.limit !== undefined && action.input.limit !== null) {
            usageLimit.limit = action.input.limit;
          }
          if (action.input.resetPeriod) {
            usageLimit.resetPeriod = action.input.resetPeriod;
          }
          if (action.input.notes !== undefined && action.input.notes !== null) {
            usageLimit.notes = action.input.notes;
          }
        }
      }
      state.lastModified = action.input.lastModified;
    },
    removeUsageLimitOperation(state, action) {
      const tier = state.tiers.find((t) => t.id === action.input.tierId);
      if (tier) {
        const limitIndex = tier.usageLimits.findIndex(
          (ul) => ul.id === action.input.limitId,
        );
        if (limitIndex !== -1) {
          tier.usageLimits.splice(limitIndex, 1);
        }
      }
      state.lastModified = action.input.lastModified;
    },
  };
