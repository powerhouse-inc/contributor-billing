import { baseActions } from "document-model";
import {
  generalActions,
  partiesActions,
  itemsActions,
  transitionsActions,
} from "./gen/creators.js";

/** Actions for the Invoice document model */
export const actions = {
  ...baseActions,
  ...generalActions,
  ...partiesActions,
  ...itemsActions,
  ...transitionsActions,
};
