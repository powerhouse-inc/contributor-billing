import { type Action } from "document-model";
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

export type UpdateOfferingInfoAction = Action & {
  type: "UPDATE_OFFERING_INFO";
  input: UpdateOfferingInfoInput;
};
export type UpdateOfferingStatusAction = Action & {
  type: "UPDATE_OFFERING_STATUS";
  input: UpdateOfferingStatusInput;
};
export type SetOperatorAction = Action & {
  type: "SET_OPERATOR";
  input: SetOperatorInput;
};
export type SetOfferingIdAction = Action & {
  type: "SET_OFFERING_ID";
  input: SetOfferingIdInput;
};
export type AddTargetAudienceAction = Action & {
  type: "ADD_TARGET_AUDIENCE";
  input: AddTargetAudienceInput;
};
export type RemoveTargetAudienceAction = Action & {
  type: "REMOVE_TARGET_AUDIENCE";
  input: RemoveTargetAudienceInput;
};
export type SetFacetTargetAction = Action & {
  type: "SET_FACET_TARGET";
  input: SetFacetTargetInput;
};
export type RemoveFacetTargetAction = Action & {
  type: "REMOVE_FACET_TARGET";
  input: RemoveFacetTargetInput;
};
export type AddFacetOptionAction = Action & {
  type: "ADD_FACET_OPTION";
  input: AddFacetOptionInput;
};
export type RemoveFacetOptionAction = Action & {
  type: "REMOVE_FACET_OPTION";
  input: RemoveFacetOptionInput;
};
export type SetSetupServicesAction = Action & {
  type: "SET_SETUP_SERVICES";
  input: SetSetupServicesInput;
};
export type SetRecurringServicesAction = Action & {
  type: "SET_RECURRING_SERVICES";
  input: SetRecurringServicesInput;
};

export type ServiceOfferingOfferingManagementAction =
  | UpdateOfferingInfoAction
  | UpdateOfferingStatusAction
  | SetOperatorAction
  | SetOfferingIdAction
  | AddTargetAudienceAction
  | RemoveTargetAudienceAction
  | SetFacetTargetAction
  | RemoveFacetTargetAction
  | AddFacetOptionAction
  | RemoveFacetOptionAction
  | SetSetupServicesAction
  | SetRecurringServicesAction;
