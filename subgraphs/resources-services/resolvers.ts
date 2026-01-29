import { type ISubgraph } from "@powerhousedao/reactor-api";
import type { PHDocument } from "document-model";
import type {
  ResourceTemplateDocument,
  TemplateStatus,
} from "../../document-models/resource-template/index.js";
import type {
  ServiceOfferingDocument,
  ServiceStatus,
} from "../../document-models/service-offering/index.js";

// Filter types
interface ResourceTemplatesFilter {
  id?: string;
  status?: TemplateStatus[];
  operatorId?: string;
}

interface ServiceOfferingsFilter {
  id?: string;
  status?: ServiceStatus[];
  operatorId?: string;
  resourceTemplateId?: string;
}

export const getResolvers = (subgraph: ISubgraph): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      resourceTemplates: async (
        _: unknown,
        args: { filter?: ResourceTemplatesFilter },
      ) => {
        const { id, status, operatorId } = args.filter || {};

        // If filtering by specific id, try to fetch directly
        if (id) {
          try {
            const doc = await reactor.getDocument<ResourceTemplateDocument>(id);
            if (
              doc &&
              doc.header.documentType === "powerhouse/resource-template"
            ) {
              const state = doc.state.global;
              // Check status filter if provided
              if (
                status &&
                status.length > 0 &&
                !status.includes(state.status)
              ) {
                return [];
              }
              // Check operatorId filter if provided
              if (operatorId && state.operatorId !== operatorId) {
                return [];
              }
              return [mapResourceTemplateState(state, doc)];
            }
          } catch {
            // Document not found
          }
          return [];
        }

        // Scan all drives for resource template documents
        const drives = await reactor.getDrives();
        const resourceTemplates: ReturnType<typeof mapResourceTemplateState>[] =
          [];

        for (const driveId of drives) {
          try {
            const docIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              docIds.map(async (docId) => {
                try {
                  return await reactor.getDocument<PHDocument>(docId);
                } catch {
                  return null;
                }
              }),
            );

            for (const doc of docs) {
              if (
                doc &&
                doc.header.documentType === "powerhouse/resource-template"
              ) {
                const resourceDoc = doc as ResourceTemplateDocument;
                const state = resourceDoc.state.global;

                // Apply status filter if provided
                if (
                  status &&
                  status.length > 0 &&
                  !status.includes(state.status)
                ) {
                  continue;
                }

                // Apply operatorId filter if provided
                if (operatorId && state.operatorId !== operatorId) {
                  continue;
                }

                resourceTemplates.push(mapResourceTemplateState(state, doc));
              }
            }
          } catch (error) {
            console.warn(`Failed to inspect drive ${driveId}:`, error);
          }
        }

        return resourceTemplates;
      },

      serviceOfferings: async (
        _: unknown,
        args: { filter?: ServiceOfferingsFilter },
      ) => {
        const { id, status, operatorId, resourceTemplateId } =
          args.filter || {};

        // If filtering by specific id, try to fetch directly
        if (id) {
          try {
            const doc = await reactor.getDocument<ServiceOfferingDocument>(id);
            if (
              doc &&
              doc.header.documentType === "powerhouse/service-offering"
            ) {
              const state = doc.state.global;
              // Check status filter if provided
              if (
                status &&
                status.length > 0 &&
                !status.includes(state.status)
              ) {
                return [];
              }
              // Check operatorId filter if provided
              if (operatorId && state.operatorId !== operatorId) {
                return [];
              }
              // Check resourceTemplateId filter if provided
              if (
                resourceTemplateId &&
                state.resourceTemplateId !== resourceTemplateId
              ) {
                return [];
              }
              return [mapServiceOfferingState(state, doc)];
            }
          } catch {
            // Document not found
          }
          return [];
        }

        // Scan all drives for service offering documents
        const drives = await reactor.getDrives();
        const serviceOfferings: ReturnType<typeof mapServiceOfferingState>[] =
          [];

        for (const driveId of drives) {
          try {
            const docIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              docIds.map(async (docId) => {
                try {
                  return await reactor.getDocument<PHDocument>(docId);
                } catch {
                  return null;
                }
              }),
            );

            for (const doc of docs) {
              if (
                doc &&
                doc.header.documentType === "powerhouse/service-offering"
              ) {
                const offeringDoc = doc as ServiceOfferingDocument;
                const state = offeringDoc.state.global;

                // Apply status filter if provided
                if (
                  status &&
                  status.length > 0 &&
                  !status.includes(state.status)
                ) {
                  continue;
                }

                // Apply operatorId filter if provided
                if (operatorId && state.operatorId !== operatorId) {
                  continue;
                }

                // Apply resourceTemplateId filter if provided
                if (
                  resourceTemplateId &&
                  state.resourceTemplateId !== resourceTemplateId
                ) {
                  continue;
                }

                serviceOfferings.push(mapServiceOfferingState(state, doc));
              }
            }
          } catch (error) {
            console.warn(`Failed to inspect drive ${driveId}:`, error);
          }
        }

        return serviceOfferings;
      },
    },
  };
};

/**
 * Map ResourceTemplateState from document model to GraphQL response
 */
function mapResourceTemplateState(
  state: ResourceTemplateDocument["state"]["global"],
  doc: PHDocument,
) {
  return {
    id: doc.header.id,
    operatorId: state.operatorId,
    title: state.title,
    summary: state.summary,
    description: state.description || null,
    thumbnailUrl: state.thumbnailUrl || null,
    infoLink: state.infoLink || null,
    status: state.status,
    lastModified: state.lastModified,
    targetAudiences: state.targetAudiences.map((audience) => ({
      id: audience.id,
      label: audience.label,
      color: audience.color || null,
    })),
    setupServices: state.setupServices,
    recurringServices: state.recurringServices,
    facetTargets: state.facetTargets.map((facet) => ({
      id: facet.id,
      categoryKey: facet.categoryKey,
      categoryLabel: facet.categoryLabel,
      selectedOptions: facet.selectedOptions,
    })),
    services: state.services.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description || null,
      displayOrder: service.displayOrder ?? null,
      parentServiceId: service.parentServiceId || null,
      isSetupFormation: service.isSetupFormation,
      optionGroupId: service.optionGroupId || null,
      facetBindings: service.facetBindings.map((binding) => ({
        id: binding.id,
        facetName: binding.facetName,
        facetType: binding.facetType,
        supportedOptions: binding.supportedOptions,
      })),
    })),
    optionGroups: state.optionGroups.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description || null,
      isAddOn: group.isAddOn,
      defaultSelected: group.defaultSelected,
    })),
    faqFields: (state.faqFields || []).map((faq) => ({
      id: faq.id,
      question: faq.question || null,
      answer: faq.answer || null,
      displayOrder: faq.displayOrder,
    })),
    contentSections: state.contentSections.map((section) => ({
      id: section.id,
      title: section.title,
      content: section.content,
      displayOrder: section.displayOrder,
    })),
  };
}

/**
 * Map ServiceOfferingState from document model to GraphQL response
 */
function mapServiceOfferingState(
  state: ServiceOfferingDocument["state"]["global"],
  doc: PHDocument,
) {
  return {
    id: doc.header.id,
    operatorId: state.operatorId,
    resourceTemplateId: state.resourceTemplateId || null,
    title: state.title,
    summary: state.summary,
    description: state.description || null,
    thumbnailUrl: state.thumbnailUrl || null,
    infoLink: state.infoLink || null,
    status: state.status,
    lastModified: state.lastModified,
    targetAudiences: state.targetAudiences.map((audience) => ({
      id: audience.id,
      label: audience.label,
      color: audience.color || null,
    })),
    setupServices: state.setupServices,
    recurringServices: state.recurringServices,
    facetTargets: state.facetTargets.map((facet) => ({
      id: facet.id,
      categoryKey: facet.categoryKey,
      categoryLabel: facet.categoryLabel,
      selectedOptions: facet.selectedOptions,
    })),
    services: state.services.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description || null,
      displayOrder: service.displayOrder ?? null,
      parentServiceId: service.parentServiceId || null,
      isSetupFormation: service.isSetupFormation,
      isPremiumExclusive: service.isPremiumExclusive,
      optionGroupId: service.optionGroupId || null,
      facetBindings: service.facetBindings.map((binding) => ({
        id: binding.id,
        facetName: binding.facetName,
        facetType: binding.facetType,
        supportedOptions: binding.supportedOptions,
      })),
    })),
    tiers: state.tiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      description: tier.description || null,
      isCustomPricing: tier.isCustomPricing,
      pricing: {
        amount: tier.pricing.amount ?? null,
        currency: tier.pricing.currency,
        billingCycle: tier.pricing.billingCycle,
        setupFee: tier.pricing.setupFee ?? null,
        perSeatAmount: tier.pricing.perSeatAmount ?? null,
        perSeatCurrency: tier.pricing.perSeatCurrency || null,
        perSeatBillingCycle: tier.pricing.perSeatBillingCycle || null,
        perSeatLabel: tier.pricing.perSeatLabel || null,
      },
      pricingOptions: tier.pricingOptions.map((option) => ({
        id: option.id,
        billingCycle: option.billingCycle,
        amount: option.amount,
        currency: option.currency,
        setupFee: option.setupFee ?? null,
        isDefault: option.isDefault,
        perSeatAmount: option.perSeatAmount ?? null,
      })),
      serviceLevels: tier.serviceLevels.map((level) => ({
        id: level.id,
        serviceId: level.serviceId,
        level: level.level,
        customValue: level.customValue || null,
        variations: level.variations || null,
        annexes: level.annexes || null,
        setupFee: level.setupFee ?? null,
        optionGroupId: level.optionGroupId || null,
      })),
      usageLimits: tier.usageLimits.map((limit) => ({
        id: limit.id,
        serviceId: limit.serviceId,
        metric: limit.metric,
        unitName: limit.unitName || null,
        limit: limit.limit ?? null,
        resetPeriod: limit.resetPeriod || null,
        notes: limit.notes || null,
        unitPrice: limit.unitPrice ?? null,
        unitPriceCurrency: limit.unitPriceCurrency || null,
        unitPriceBillingCycle: limit.unitPriceBillingCycle || null,
      })),
    })),
    optionGroups: state.optionGroups.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description || null,
      isAddOn: group.isAddOn,
      defaultSelected: group.defaultSelected,
    })),
  };
}
