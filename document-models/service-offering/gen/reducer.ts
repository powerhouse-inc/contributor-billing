// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { ServiceOfferingPHState } from "@powerhousedao/contributor-billing/document-models/service-offering";

import { serviceOfferingServiceManagementOperations } from "../src/reducers/service-management.js";
import { serviceOfferingTierManagementOperations } from "../src/reducers/tier-management.js";
import { serviceOfferingOfferingManagementOperations } from "../src/reducers/offering-management.js";
import { serviceOfferingOptionGroupManagementOperations } from "../src/reducers/option-group-management.js";

import {
  AddServiceInputSchema,
  UpdateServiceInputSchema,
  DeleteServiceInputSchema,
  AddFacetBindingInputSchema,
  RemoveFacetBindingInputSchema,
  AddTierInputSchema,
  UpdateTierInputSchema,
  UpdateTierPricingInputSchema,
  DeleteTierInputSchema,
  AddServiceLevelInputSchema,
  UpdateServiceLevelInputSchema,
  RemoveServiceLevelInputSchema,
  AddUsageLimitInputSchema,
  UpdateUsageLimitInputSchema,
  RemoveUsageLimitInputSchema,
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
  SelectResourceTemplateInputSchema,
  ChangeResourceTemplateInputSchema,
  AddOptionGroupInputSchema,
  UpdateOptionGroupInputSchema,
  DeleteOptionGroupInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<ServiceOfferingPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }
  switch (action.type) {
    case "ADD_SERVICE": {
      AddServiceInputSchema().parse(action.input);

      serviceOfferingServiceManagementOperations.addServiceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_SERVICE": {
      UpdateServiceInputSchema().parse(action.input);

      serviceOfferingServiceManagementOperations.updateServiceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "DELETE_SERVICE": {
      DeleteServiceInputSchema().parse(action.input);

      serviceOfferingServiceManagementOperations.deleteServiceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_FACET_BINDING": {
      AddFacetBindingInputSchema().parse(action.input);

      serviceOfferingServiceManagementOperations.addFacetBindingOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_FACET_BINDING": {
      RemoveFacetBindingInputSchema().parse(action.input);

      serviceOfferingServiceManagementOperations.removeFacetBindingOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_TIER": {
      AddTierInputSchema().parse(action.input);

      serviceOfferingTierManagementOperations.addTierOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_TIER": {
      UpdateTierInputSchema().parse(action.input);

      serviceOfferingTierManagementOperations.updateTierOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_TIER_PRICING": {
      UpdateTierPricingInputSchema().parse(action.input);

      serviceOfferingTierManagementOperations.updateTierPricingOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "DELETE_TIER": {
      DeleteTierInputSchema().parse(action.input);

      serviceOfferingTierManagementOperations.deleteTierOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_SERVICE_LEVEL": {
      AddServiceLevelInputSchema().parse(action.input);

      serviceOfferingTierManagementOperations.addServiceLevelOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_SERVICE_LEVEL": {
      UpdateServiceLevelInputSchema().parse(action.input);

      serviceOfferingTierManagementOperations.updateServiceLevelOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_SERVICE_LEVEL": {
      RemoveServiceLevelInputSchema().parse(action.input);

      serviceOfferingTierManagementOperations.removeServiceLevelOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_USAGE_LIMIT": {
      AddUsageLimitInputSchema().parse(action.input);

      serviceOfferingTierManagementOperations.addUsageLimitOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_USAGE_LIMIT": {
      UpdateUsageLimitInputSchema().parse(action.input);

      serviceOfferingTierManagementOperations.updateUsageLimitOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_USAGE_LIMIT": {
      RemoveUsageLimitInputSchema().parse(action.input);

      serviceOfferingTierManagementOperations.removeUsageLimitOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_OFFERING_INFO": {
      UpdateOfferingInfoInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.updateOfferingInfoOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_OFFERING_STATUS": {
      UpdateOfferingStatusInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.updateOfferingStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_OPERATOR": {
      SetOperatorInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.setOperatorOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_OFFERING_ID": {
      SetOfferingIdInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.setOfferingIdOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_TARGET_AUDIENCE": {
      AddTargetAudienceInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.addTargetAudienceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_TARGET_AUDIENCE": {
      RemoveTargetAudienceInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.removeTargetAudienceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_FACET_TARGET": {
      SetFacetTargetInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.setFacetTargetOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_FACET_TARGET": {
      RemoveFacetTargetInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.removeFacetTargetOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_FACET_OPTION": {
      AddFacetOptionInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.addFacetOptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_FACET_OPTION": {
      RemoveFacetOptionInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.removeFacetOptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_SETUP_SERVICES": {
      SetSetupServicesInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.setSetupServicesOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_RECURRING_SERVICES": {
      SetRecurringServicesInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.setRecurringServicesOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SELECT_RESOURCE_TEMPLATE": {
      SelectResourceTemplateInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.selectResourceTemplateOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "CHANGE_RESOURCE_TEMPLATE": {
      ChangeResourceTemplateInputSchema().parse(action.input);

      serviceOfferingOfferingManagementOperations.changeResourceTemplateOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_OPTION_GROUP": {
      AddOptionGroupInputSchema().parse(action.input);

      serviceOfferingOptionGroupManagementOperations.addOptionGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_OPTION_GROUP": {
      UpdateOptionGroupInputSchema().parse(action.input);

      serviceOfferingOptionGroupManagementOperations.updateOptionGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "DELETE_OPTION_GROUP": {
      DeleteOptionGroupInputSchema().parse(action.input);

      serviceOfferingOptionGroupManagementOperations.deleteOptionGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    default:
      return state;
  }
};

export const reducer = createReducer<ServiceOfferingPHState>(stateReducer);
