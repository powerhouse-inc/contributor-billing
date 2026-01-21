import { type SignalDispatch } from "document-model";
import {
  type AddOptionGroupAction,
  type UpdateOptionGroupAction,
  type DeleteOptionGroupAction,
} from "./actions.js";
import { type ResourceTemplateState } from "../types.js";

export interface ResourceTemplateOptionGroupManagementOperations {
  addOptionGroupOperation: (
    state: ResourceTemplateState,
    action: AddOptionGroupAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateOptionGroupOperation: (
    state: ResourceTemplateState,
    action: UpdateOptionGroupAction,
    dispatch?: SignalDispatch,
  ) => void;
  deleteOptionGroupOperation: (
    state: ResourceTemplateState,
    action: DeleteOptionGroupAction,
    dispatch?: SignalDispatch,
  ) => void;
}
