import { baseActions } from "document-model";
import {
  invoiceGeneralActions,
  invoicePartiesActions,
  invoiceItemsActions,
  invoiceTransitionsActions,
} from "./gen/creators.js";

/** Actions for the Invoice document model */

export const actions = {
  ...baseActions,
  ...invoiceGeneralActions,
  ...invoicePartiesActions,
  ...invoiceItemsActions,
  ...invoiceTransitionsActions,
};
