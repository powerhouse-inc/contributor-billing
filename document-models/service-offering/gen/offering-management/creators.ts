import { createAction } from "document-model/core";
import {
  UpdateOfferingInfoInputSchema,
  UpdateOfferingStatusInputSchema,
  SetOperatorInputSchema,
  SetOfferingIdInputSchema,
  AddTargetAudienceInputSchema,
  RemoveTargetAudienceInputSchema,
  SetFacetTargetInputSchema,
  RemoveFacetTargetInputSchema,
  AddFacetOptionInputSchema,
  RemoveFacetOptionInputSchema,
  SetSetupServicesInputSchema,
  SetRecurringServicesInputSchema,
} from "../schema/zod.js";
import type {
  UpdateOfferingInfoInput,
  UpdateOfferingStatusInput,
  SetOperatorInput,
  SetOfferingIdInput,
  AddTargetAudienceInput,
  RemoveTargetAudienceInput,
  SetFacetTargetInput,
  RemoveFacetTargetInput,
  AddFacetOptionInput,
  RemoveFacetOptionInput,
  SetSetupServicesInput,
  SetRecurringServicesInput,
} from "../types.js";
import type {
  UpdateOfferingInfoAction,
  UpdateOfferingStatusAction,
  SetOperatorAction,
  SetOfferingIdAction,
  AddTargetAudienceAction,
  RemoveTargetAudienceAction,
  SetFacetTargetAction,
  RemoveFacetTargetAction,
  AddFacetOptionAction,
  RemoveFacetOptionAction,
  SetSetupServicesAction,
  SetRecurringServicesAction,
} from "./actions.js";

export const updateOfferingInfo = (input: UpdateOfferingInfoInput) =>
  createAction<UpdateOfferingInfoAction>(
    "UPDATE_OFFERING_INFO",
    { ...input },
    undefined,
    UpdateOfferingInfoInputSchema,
    "global",
  );

export const updateOfferingStatus = (input: UpdateOfferingStatusInput) =>
  createAction<UpdateOfferingStatusAction>(
    "UPDATE_OFFERING_STATUS",
    { ...input },
    undefined,
    UpdateOfferingStatusInputSchema,
    "global",
  );

export const setOperator = (input: SetOperatorInput) =>
  createAction<SetOperatorAction>(
    "SET_OPERATOR",
    { ...input },
    undefined,
    SetOperatorInputSchema,
    "global",
  );

export const setOfferingId = (input: SetOfferingIdInput) =>
  createAction<SetOfferingIdAction>(
    "SET_OFFERING_ID",
    { ...input },
    undefined,
    SetOfferingIdInputSchema,
    "global",
  );

export const addTargetAudience = (input: AddTargetAudienceInput) =>
  createAction<AddTargetAudienceAction>(
    "ADD_TARGET_AUDIENCE",
    { ...input },
    undefined,
    AddTargetAudienceInputSchema,
    "global",
  );

export const removeTargetAudience = (input: RemoveTargetAudienceInput) =>
  createAction<RemoveTargetAudienceAction>(
    "REMOVE_TARGET_AUDIENCE",
    { ...input },
    undefined,
    RemoveTargetAudienceInputSchema,
    "global",
  );

export const setFacetTarget = (input: SetFacetTargetInput) =>
  createAction<SetFacetTargetAction>(
    "SET_FACET_TARGET",
    { ...input },
    undefined,
    SetFacetTargetInputSchema,
    "global",
  );

export const removeFacetTarget = (input: RemoveFacetTargetInput) =>
  createAction<RemoveFacetTargetAction>(
    "REMOVE_FACET_TARGET",
    { ...input },
    undefined,
    RemoveFacetTargetInputSchema,
    "global",
  );

export const addFacetOption = (input: AddFacetOptionInput) =>
  createAction<AddFacetOptionAction>(
    "ADD_FACET_OPTION",
    { ...input },
    undefined,
    AddFacetOptionInputSchema,
    "global",
  );

export const removeFacetOption = (input: RemoveFacetOptionInput) =>
  createAction<RemoveFacetOptionAction>(
    "REMOVE_FACET_OPTION",
    { ...input },
    undefined,
    RemoveFacetOptionInputSchema,
    "global",
  );

export const setSetupServices = (input: SetSetupServicesInput) =>
  createAction<SetSetupServicesAction>(
    "SET_SETUP_SERVICES",
    { ...input },
    undefined,
    SetSetupServicesInputSchema,
    "global",
  );

export const setRecurringServices = (input: SetRecurringServicesInput) =>
  createAction<SetRecurringServicesAction>(
    "SET_RECURRING_SERVICES",
    { ...input },
    undefined,
    SetRecurringServicesInputSchema,
    "global",
  );
