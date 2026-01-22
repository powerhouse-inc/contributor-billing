import { z } from "zod";
import type {
  AddFacetBindingInput,
  AddFacetOptionInput,
  AddOptionGroupInput,
  AddServiceInput,
  AddServiceLevelInput,
  AddTargetAudienceInput,
  AddTierInput,
  AddUsageLimitInput,
  BillingCycle,
  ChangeResourceTemplateInput,
  DeleteOptionGroupInput,
  DeleteServiceInput,
  DeleteTierInput,
  FacetTarget,
  OptionGroup,
  RemoveFacetBindingInput,
  RemoveFacetOptionInput,
  RemoveFacetTargetInput,
  RemoveServiceLevelInput,
  RemoveTargetAudienceInput,
  RemoveUsageLimitInput,
  ResetPeriod,
  ResourceFacetBinding,
  SelectResourceTemplateInput,
  Service,
  ServiceLevel,
  ServiceLevelBinding,
  ServiceOfferingState,
  ServicePricing,
  ServiceStatus,
  ServiceSubscriptionTier,
  ServiceUsageLimit,
  SetFacetTargetInput,
  SetOfferingIdInput,
  SetOperatorInput,
  SetRecurringServicesInput,
  SetSetupServicesInput,
  TargetAudience,
  UpdateOfferingInfoInput,
  UpdateOfferingStatusInput,
  UpdateOptionGroupInput,
  UpdateServiceInput,
  UpdateServiceLevelInput,
  UpdateTierInput,
  UpdateTierPricingInput,
  UpdateUsageLimitInput,
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

export const BillingCycleSchema = z.enum([
  "ANNUAL",
  "MONTHLY",
  "ONE_TIME",
  "QUARTERLY",
  "SEMI_ANNUAL",
]);

export const ResetPeriodSchema = z.enum([
  "ANNUAL",
  "DAILY",
  "HOURLY",
  "MONTHLY",
  "QUARTERLY",
  "SEMI_ANNUAL",
  "WEEKLY",
]);

export const ServiceLevelSchema = z.enum([
  "CUSTOM",
  "INCLUDED",
  "NOT_APPLICABLE",
  "NOT_INCLUDED",
  "OPTIONAL",
  "VARIABLE",
]);

export const ServiceStatusSchema = z.enum([
  "ACTIVE",
  "COMING_SOON",
  "DEPRECATED",
  "DRAFT",
]);

export function AddFacetBindingInputSchema(): z.ZodObject<
  Properties<AddFacetBindingInput>
> {
  return z.object({
    bindingId: z.string(),
    facetName: z.string(),
    facetType: z.string(),
    lastModified: z.string().datetime(),
    serviceId: z.string(),
    supportedOptions: z.array(z.string()),
  });
}

export function AddFacetOptionInputSchema(): z.ZodObject<
  Properties<AddFacetOptionInput>
> {
  return z.object({
    categoryKey: z.string(),
    lastModified: z.string().datetime(),
    optionId: z.string(),
  });
}

export function AddOptionGroupInputSchema(): z.ZodObject<
  Properties<AddOptionGroupInput>
> {
  return z.object({
    defaultSelected: z.boolean(),
    description: z.string().nullish(),
    id: z.string(),
    isAddOn: z.boolean(),
    lastModified: z.string().datetime(),
    name: z.string(),
  });
}

export function AddServiceInputSchema(): z.ZodObject<
  Properties<AddServiceInput>
> {
  return z.object({
    description: z.string().nullish(),
    displayOrder: z.number().nullish(),
    id: z.string(),
    isPremiumExclusive: z.boolean().nullish(),
    isSetupFormation: z.boolean().nullish(),
    lastModified: z.string().datetime(),
    optionGroupId: z.string().nullish(),
    parentServiceId: z.string().nullish(),
    title: z.string(),
  });
}

export function AddServiceLevelInputSchema(): z.ZodObject<
  Properties<AddServiceLevelInput>
> {
  return z.object({
    annexes: z.string().nullish(),
    customValue: z.string().nullish(),
    lastModified: z.string().datetime(),
    level: ServiceLevelSchema,
    optionGroupId: z.string().nullish(),
    serviceId: z.string(),
    serviceLevelId: z.string(),
    setupFee: z.number().nullish(),
    tierId: z.string(),
    variations: z.string().nullish(),
  });
}

export function AddTargetAudienceInputSchema(): z.ZodObject<
  Properties<AddTargetAudienceInput>
> {
  return z.object({
    color: z.string().nullish(),
    id: z.string(),
    label: z.string(),
    lastModified: z.string().datetime(),
  });
}

export function AddTierInputSchema(): z.ZodObject<Properties<AddTierInput>> {
  return z.object({
    amount: z.number().nullish(),
    billingCycle: BillingCycleSchema,
    currency: z.string(),
    description: z.string().nullish(),
    id: z.string(),
    isCustomPricing: z.boolean().nullish(),
    lastModified: z.string().datetime(),
    name: z.string(),
    setupFee: z.number().nullish(),
  });
}

export function AddUsageLimitInputSchema(): z.ZodObject<
  Properties<AddUsageLimitInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    limit: z.number().nullish(),
    limitId: z.string(),
    metric: z.string(),
    notes: z.string().nullish(),
    resetPeriod: ResetPeriodSchema.nullish(),
    serviceId: z.string(),
    tierId: z.string(),
  });
}

export function ChangeResourceTemplateInputSchema(): z.ZodObject<
  Properties<ChangeResourceTemplateInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    newTemplateId: z.string(),
    previousTemplateId: z.string(),
  });
}

export function DeleteOptionGroupInputSchema(): z.ZodObject<
  Properties<DeleteOptionGroupInput>
> {
  return z.object({
    id: z.string(),
    lastModified: z.string().datetime(),
  });
}

export function DeleteServiceInputSchema(): z.ZodObject<
  Properties<DeleteServiceInput>
> {
  return z.object({
    id: z.string(),
    lastModified: z.string().datetime(),
  });
}

export function DeleteTierInputSchema(): z.ZodObject<
  Properties<DeleteTierInput>
> {
  return z.object({
    id: z.string(),
    lastModified: z.string().datetime(),
  });
}

export function FacetTargetSchema(): z.ZodObject<Properties<FacetTarget>> {
  return z.object({
    __typename: z.literal("FacetTarget").optional(),
    categoryKey: z.string(),
    categoryLabel: z.string(),
    id: z.string(),
    selectedOptions: z.array(z.string()),
  });
}

export function OptionGroupSchema(): z.ZodObject<Properties<OptionGroup>> {
  return z.object({
    __typename: z.literal("OptionGroup").optional(),
    defaultSelected: z.boolean(),
    description: z.string().nullable(),
    id: z.string(),
    isAddOn: z.boolean(),
    name: z.string(),
  });
}

export function RemoveFacetBindingInputSchema(): z.ZodObject<
  Properties<RemoveFacetBindingInput>
> {
  return z.object({
    bindingId: z.string(),
    lastModified: z.string().datetime(),
    serviceId: z.string(),
  });
}

export function RemoveFacetOptionInputSchema(): z.ZodObject<
  Properties<RemoveFacetOptionInput>
> {
  return z.object({
    categoryKey: z.string(),
    lastModified: z.string().datetime(),
    optionId: z.string(),
  });
}

export function RemoveFacetTargetInputSchema(): z.ZodObject<
  Properties<RemoveFacetTargetInput>
> {
  return z.object({
    categoryKey: z.string(),
    lastModified: z.string().datetime(),
  });
}

export function RemoveServiceLevelInputSchema(): z.ZodObject<
  Properties<RemoveServiceLevelInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    serviceLevelId: z.string(),
    tierId: z.string(),
  });
}

export function RemoveTargetAudienceInputSchema(): z.ZodObject<
  Properties<RemoveTargetAudienceInput>
> {
  return z.object({
    id: z.string(),
    lastModified: z.string().datetime(),
  });
}

export function RemoveUsageLimitInputSchema(): z.ZodObject<
  Properties<RemoveUsageLimitInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    limitId: z.string(),
    tierId: z.string(),
  });
}

export function ResourceFacetBindingSchema(): z.ZodObject<
  Properties<ResourceFacetBinding>
> {
  return z.object({
    __typename: z.literal("ResourceFacetBinding").optional(),
    facetName: z.string(),
    facetType: z.string(),
    id: z.string(),
    supportedOptions: z.array(z.string()),
  });
}

export function SelectResourceTemplateInputSchema(): z.ZodObject<
  Properties<SelectResourceTemplateInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    resourceTemplateId: z.string(),
  });
}

export function ServiceSchema(): z.ZodObject<Properties<Service>> {
  return z.object({
    __typename: z.literal("Service").optional(),
    description: z.string().nullable(),
    displayOrder: z.number().nullable(),
    facetBindings: z.array(ResourceFacetBindingSchema()),
    id: z.string(),
    isPremiumExclusive: z.boolean(),
    isSetupFormation: z.boolean(),
    optionGroupId: z.string().nullable(),
    parentServiceId: z.string().nullable(),
    title: z.string(),
  });
}

export function ServiceLevelBindingSchema(): z.ZodObject<
  Properties<ServiceLevelBinding>
> {
  return z.object({
    __typename: z.literal("ServiceLevelBinding").optional(),
    annexes: z.string().nullable(),
    customValue: z.string().nullable(),
    id: z.string(),
    level: ServiceLevelSchema,
    optionGroupId: z.string().nullable(),
    serviceId: z.string(),
    setupFee: z.number().nullable(),
    variations: z.string().nullable(),
  });
}

export function ServiceOfferingStateSchema(): z.ZodObject<
  Properties<ServiceOfferingState>
> {
  return z.object({
    __typename: z.literal("ServiceOfferingState").optional(),
    description: z.string().nullable(),
    facetTargets: z.array(FacetTargetSchema()),
    id: z.string(),
    infoLink: z.string().url().nullable(),
    lastModified: z.string().datetime(),
    operatorId: z.string(),
    optionGroups: z.array(OptionGroupSchema()),
    recurringServices: z.array(z.string()),
    resourceTemplateId: z.string().nullable(),
    services: z.array(ServiceSchema()),
    setupServices: z.array(z.string()),
    status: ServiceStatusSchema,
    summary: z.string(),
    targetAudiences: z.array(TargetAudienceSchema()),
    thumbnailUrl: z.string().url().nullable(),
    tiers: z.array(ServiceSubscriptionTierSchema()),
    title: z.string(),
  });
}

export function ServicePricingSchema(): z.ZodObject<
  Properties<ServicePricing>
> {
  return z.object({
    __typename: z.literal("ServicePricing").optional(),
    amount: z.number().nullable(),
    billingCycle: BillingCycleSchema,
    currency: z.string(),
    setupFee: z.number().nullable(),
  });
}

export function ServiceSubscriptionTierSchema(): z.ZodObject<
  Properties<ServiceSubscriptionTier>
> {
  return z.object({
    __typename: z.literal("ServiceSubscriptionTier").optional(),
    description: z.string().nullable(),
    id: z.string(),
    isCustomPricing: z.boolean(),
    name: z.string(),
    pricing: ServicePricingSchema(),
    serviceLevels: z.array(ServiceLevelBindingSchema()),
    usageLimits: z.array(ServiceUsageLimitSchema()),
  });
}

export function ServiceUsageLimitSchema(): z.ZodObject<
  Properties<ServiceUsageLimit>
> {
  return z.object({
    __typename: z.literal("ServiceUsageLimit").optional(),
    id: z.string(),
    limit: z.number().nullable(),
    metric: z.string(),
    notes: z.string().nullable(),
    resetPeriod: ResetPeriodSchema.nullable(),
    serviceId: z.string(),
  });
}

export function SetFacetTargetInputSchema(): z.ZodObject<
  Properties<SetFacetTargetInput>
> {
  return z.object({
    categoryKey: z.string(),
    categoryLabel: z.string(),
    id: z.string(),
    lastModified: z.string().datetime(),
    selectedOptions: z.array(z.string()),
  });
}

export function SetOfferingIdInputSchema(): z.ZodObject<
  Properties<SetOfferingIdInput>
> {
  return z.object({
    id: z.string(),
    lastModified: z.string().datetime(),
  });
}

export function SetOperatorInputSchema(): z.ZodObject<
  Properties<SetOperatorInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    operatorId: z.string(),
  });
}

export function SetRecurringServicesInputSchema(): z.ZodObject<
  Properties<SetRecurringServicesInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    services: z.array(z.string()),
  });
}

export function SetSetupServicesInputSchema(): z.ZodObject<
  Properties<SetSetupServicesInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    services: z.array(z.string()),
  });
}

export function TargetAudienceSchema(): z.ZodObject<
  Properties<TargetAudience>
> {
  return z.object({
    __typename: z.literal("TargetAudience").optional(),
    color: z.string().nullable(),
    id: z.string(),
    label: z.string(),
  });
}

export function UpdateOfferingInfoInputSchema(): z.ZodObject<
  Properties<UpdateOfferingInfoInput>
> {
  return z.object({
    description: z.string().nullish(),
    infoLink: z.string().url().nullish(),
    lastModified: z.string().datetime(),
    summary: z.string().nullish(),
    thumbnailUrl: z.string().url().nullish(),
    title: z.string().nullish(),
  });
}

export function UpdateOfferingStatusInputSchema(): z.ZodObject<
  Properties<UpdateOfferingStatusInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    status: ServiceStatusSchema,
  });
}

export function UpdateOptionGroupInputSchema(): z.ZodObject<
  Properties<UpdateOptionGroupInput>
> {
  return z.object({
    defaultSelected: z.boolean().nullish(),
    description: z.string().nullish(),
    id: z.string(),
    isAddOn: z.boolean().nullish(),
    lastModified: z.string().datetime(),
    name: z.string().nullish(),
  });
}

export function UpdateServiceInputSchema(): z.ZodObject<
  Properties<UpdateServiceInput>
> {
  return z.object({
    description: z.string().nullish(),
    displayOrder: z.number().nullish(),
    id: z.string(),
    isPremiumExclusive: z.boolean().nullish(),
    isSetupFormation: z.boolean().nullish(),
    lastModified: z.string().datetime(),
    optionGroupId: z.string().nullish(),
    parentServiceId: z.string().nullish(),
    title: z.string().nullish(),
  });
}

export function UpdateServiceLevelInputSchema(): z.ZodObject<
  Properties<UpdateServiceLevelInput>
> {
  return z.object({
    annexes: z.string().nullish(),
    customValue: z.string().nullish(),
    lastModified: z.string().datetime(),
    level: ServiceLevelSchema.nullish(),
    optionGroupId: z.string().nullish(),
    serviceLevelId: z.string(),
    setupFee: z.number().nullish(),
    tierId: z.string(),
    variations: z.string().nullish(),
  });
}

export function UpdateTierInputSchema(): z.ZodObject<
  Properties<UpdateTierInput>
> {
  return z.object({
    description: z.string().nullish(),
    id: z.string(),
    isCustomPricing: z.boolean().nullish(),
    lastModified: z.string().datetime(),
    name: z.string().nullish(),
  });
}

export function UpdateTierPricingInputSchema(): z.ZodObject<
  Properties<UpdateTierPricingInput>
> {
  return z.object({
    amount: z.number().nullish(),
    billingCycle: BillingCycleSchema.nullish(),
    currency: z.string().nullish(),
    lastModified: z.string().datetime(),
    setupFee: z.number().nullish(),
    tierId: z.string(),
  });
}

export function UpdateUsageLimitInputSchema(): z.ZodObject<
  Properties<UpdateUsageLimitInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    limit: z.number().nullish(),
    limitId: z.string(),
    metric: z.string().nullish(),
    notes: z.string().nullish(),
    resetPeriod: ResetPeriodSchema.nullish(),
    tierId: z.string(),
  });
}
