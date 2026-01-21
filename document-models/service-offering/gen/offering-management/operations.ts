import { type SignalDispatch } from "document-model";
import {
  type UpdateOfferingInfoAction,
  type UpdateOfferingStatusAction,
  type SetOperatorAction,
  type SetOfferingIdAction,
  type AddTargetAudienceAction,
  type RemoveTargetAudienceAction,
  type SetFacetTargetAction,
  type RemoveFacetTargetAction,
  type AddFacetOptionAction,
  type RemoveFacetOptionAction,
  type SetSetupServicesAction,
  type SetRecurringServicesAction,
  type SelectResourceTemplateAction,
  type ChangeResourceTemplateAction,
} from "./actions.js";
import { type ServiceOfferingState } from "../types.js";

export interface ServiceOfferingOfferingManagementOperations {
  updateOfferingInfoOperation: (
    state: ServiceOfferingState,
    action: UpdateOfferingInfoAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateOfferingStatusOperation: (
    state: ServiceOfferingState,
    action: UpdateOfferingStatusAction,
    dispatch?: SignalDispatch,
  ) => void;
  setOperatorOperation: (
    state: ServiceOfferingState,
    action: SetOperatorAction,
    dispatch?: SignalDispatch,
  ) => void;
  setOfferingIdOperation: (
    state: ServiceOfferingState,
    action: SetOfferingIdAction,
    dispatch?: SignalDispatch,
  ) => void;
  addTargetAudienceOperation: (
    state: ServiceOfferingState,
    action: AddTargetAudienceAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeTargetAudienceOperation: (
    state: ServiceOfferingState,
    action: RemoveTargetAudienceAction,
    dispatch?: SignalDispatch,
  ) => void;
  setFacetTargetOperation: (
    state: ServiceOfferingState,
    action: SetFacetTargetAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeFacetTargetOperation: (
    state: ServiceOfferingState,
    action: RemoveFacetTargetAction,
    dispatch?: SignalDispatch,
  ) => void;
  addFacetOptionOperation: (
    state: ServiceOfferingState,
    action: AddFacetOptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeFacetOptionOperation: (
    state: ServiceOfferingState,
    action: RemoveFacetOptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  setSetupServicesOperation: (
    state: ServiceOfferingState,
    action: SetSetupServicesAction,
    dispatch?: SignalDispatch,
  ) => void;
  setRecurringServicesOperation: (
    state: ServiceOfferingState,
    action: SetRecurringServicesAction,
    dispatch?: SignalDispatch,
  ) => void;
  selectResourceTemplateOperation: (
    state: ServiceOfferingState,
    action: SelectResourceTemplateAction,
    dispatch?: SignalDispatch,
  ) => void;
  changeResourceTemplateOperation: (
    state: ServiceOfferingState,
    action: ChangeResourceTemplateAction,
    dispatch?: SignalDispatch,
  ) => void;
}
