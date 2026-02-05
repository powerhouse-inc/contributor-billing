import { baseActions } from "document-model";
import {
  subscriptionActions,
  serviceActions,
  serviceGroupActions,
  metricsActions,
  billingActions,
  customerActions,
} from "./gen/creators.js";

/** Actions for the SubscriptionInstance document model */

export const actions = {
  ...baseActions,
  ...subscriptionActions,
  ...serviceActions,
  ...serviceGroupActions,
  ...metricsActions,
  ...billingActions,
  ...customerActions,
};
