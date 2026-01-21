import { z } from "zod";
import type {
  AddFacetBindingInput,
  AddFacetOptionInput,
  AddOptionGroupInput,
  AddServiceInput,
  AddTargetAudienceInput,
  DeleteOptionGroupInput,
  DeleteServiceInput,
  FacetTarget,
  OptionGroup,
  RemoveFacetBindingInput,
  RemoveFacetOptionInput,
  RemoveFacetTargetInput,
  RemoveTargetAudienceInput,
  ResourceFacetBinding,
  ResourceTemplateState,
  Service,
  SetFacetTargetInput,
  SetOperatorInput,
  SetRecurringServicesInput,
  SetSetupServicesInput,
  SetTemplateIdInput,
  TargetAudience,
  TemplateStatus,
  UpdateOptionGroupInput,
  UpdateServiceInput,
  UpdateTemplateInfoInput,
  UpdateTemplateStatusInput,
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

export const TemplateStatusSchema = z.enum([
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
    isSetupFormation: z.boolean().nullish(),
    lastModified: z.string().datetime(),
    optionGroupId: z.string().nullish(),
    parentServiceId: z.string().nullish(),
    title: z.string(),
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

export function RemoveTargetAudienceInputSchema(): z.ZodObject<
  Properties<RemoveTargetAudienceInput>
> {
  return z.object({
    id: z.string(),
    lastModified: z.string().datetime(),
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

export function ResourceTemplateStateSchema(): z.ZodObject<
  Properties<ResourceTemplateState>
> {
  return z.object({
    __typename: z.literal("ResourceTemplateState").optional(),
    description: z.string().nullable(),
    facetTargets: z.array(FacetTargetSchema()),
    id: z.string(),
    infoLink: z.string().url().nullable(),
    lastModified: z.string().datetime(),
    operatorId: z.string(),
    optionGroups: z.array(OptionGroupSchema()),
    recurringServices: z.array(z.string()),
    services: z.array(ServiceSchema()),
    setupServices: z.array(z.string()),
    status: TemplateStatusSchema,
    summary: z.string(),
    targetAudiences: z.array(TargetAudienceSchema()),
    thumbnailUrl: z.string().url().nullable(),
    title: z.string(),
  });
}

export function ServiceSchema(): z.ZodObject<Properties<Service>> {
  return z.object({
    __typename: z.literal("Service").optional(),
    description: z.string().nullable(),
    displayOrder: z.number().nullable(),
    facetBindings: z.array(ResourceFacetBindingSchema()),
    id: z.string(),
    isSetupFormation: z.boolean(),
    optionGroupId: z.string().nullable(),
    parentServiceId: z.string().nullable(),
    title: z.string(),
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

export function SetTemplateIdInputSchema(): z.ZodObject<
  Properties<SetTemplateIdInput>
> {
  return z.object({
    id: z.string(),
    lastModified: z.string().datetime(),
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
    isSetupFormation: z.boolean().nullish(),
    lastModified: z.string().datetime(),
    optionGroupId: z.string().nullish(),
    parentServiceId: z.string().nullish(),
    title: z.string().nullish(),
  });
}

export function UpdateTemplateInfoInputSchema(): z.ZodObject<
  Properties<UpdateTemplateInfoInput>
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

export function UpdateTemplateStatusInputSchema(): z.ZodObject<
  Properties<UpdateTemplateStatusInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    status: TemplateStatusSchema,
  });
}
