// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { SubscriptionInstancePHState } from "@powerhousedao/contributor-billing/document-models/subscription-instance";

import { subscriptionInstanceSubscriptionOperations } from "../src/reducers/subscription.js";
import { subscriptionInstanceServiceOperations } from "../src/reducers/service.js";
import { subscriptionInstanceServiceGroupOperations } from "../src/reducers/service-group.js";
import { subscriptionInstanceMetricsOperations } from "../src/reducers/metrics.js";
import { subscriptionInstanceBillingOperations } from "../src/reducers/billing.js";
import { subscriptionInstanceCustomerOperations } from "../src/reducers/customer.js";

import {
  InitializeSubscriptionInputSchema,
  SetResourceDocumentInputSchema,
  UpdateSubscriptionStatusInputSchema,
  ActivateSubscriptionInputSchema,
  PauseSubscriptionInputSchema,
  SetExpiringInputSchema,
  CancelSubscriptionInputSchema,
  ResumeSubscriptionInputSchema,
  RenewExpiringSubscriptionInputSchema,
  SetBudgetCategoryInputSchema,
  RemoveBudgetCategoryInputSchema,
  UpdateCustomerInfoInputSchema,
  UpdateTierInfoInputSchema,
  SetOperatorNotesInputSchema,
  SetAutoRenewInputSchema,
  SetRenewalDateInputSchema,
  AddServiceInputSchema,
  RemoveServiceInputSchema,
  UpdateServiceSetupCostInputSchema,
  UpdateServiceRecurringCostInputSchema,
  ReportSetupPaymentInputSchema,
  ReportRecurringPaymentInputSchema,
  UpdateServiceInfoInputSchema,
  AddServiceGroupInputSchema,
  RemoveServiceGroupInputSchema,
  AddServiceToGroupInputSchema,
  RemoveServiceFromGroupInputSchema,
  AddServiceMetricInputSchema,
  UpdateMetricInputSchema,
  UpdateMetricUsageInputSchema,
  RemoveServiceMetricInputSchema,
  IncrementMetricUsageInputSchema,
  DecrementMetricUsageInputSchema,
  CreateInvoiceInputSchema,
  UpdateInvoiceStatusInputSchema,
  AddInvoiceLineItemInputSchema,
  RemoveInvoiceLineItemInputSchema,
  SetInvoiceTaxInputSchema,
  RecordInvoicePaymentInputSchema,
  SendInvoiceInputSchema,
  CancelInvoiceInputSchema,
  MarkInvoiceOverdueInputSchema,
  RefundInvoiceInputSchema,
  UpdateCustomerWalletInputSchema,
  SetCustomerTypeInputSchema,
  UpdateTeamMemberCountInputSchema,
  UpdateKycStatusInputSchema,
  AddCommunicationChannelInputSchema,
  RemoveCommunicationChannelInputSchema,
  SetPrimaryCommunicationChannelInputSchema,
  VerifyCommunicationChannelInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<SubscriptionInstancePHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }
  switch (action.type) {
    case "INITIALIZE_SUBSCRIPTION": {
      InitializeSubscriptionInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.initializeSubscriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_RESOURCE_DOCUMENT": {
      SetResourceDocumentInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.setResourceDocumentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_SUBSCRIPTION_STATUS": {
      UpdateSubscriptionStatusInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.updateSubscriptionStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ACTIVATE_SUBSCRIPTION": {
      ActivateSubscriptionInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.activateSubscriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "PAUSE_SUBSCRIPTION": {
      PauseSubscriptionInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.pauseSubscriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_EXPIRING": {
      SetExpiringInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.setExpiringOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "CANCEL_SUBSCRIPTION": {
      CancelSubscriptionInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.cancelSubscriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "RESUME_SUBSCRIPTION": {
      ResumeSubscriptionInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.resumeSubscriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "RENEW_EXPIRING_SUBSCRIPTION": {
      RenewExpiringSubscriptionInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.renewExpiringSubscriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_BUDGET_CATEGORY": {
      SetBudgetCategoryInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.setBudgetCategoryOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_BUDGET_CATEGORY": {
      RemoveBudgetCategoryInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.removeBudgetCategoryOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_CUSTOMER_INFO": {
      UpdateCustomerInfoInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.updateCustomerInfoOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_TIER_INFO": {
      UpdateTierInfoInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.updateTierInfoOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_OPERATOR_NOTES": {
      SetOperatorNotesInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.setOperatorNotesOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_AUTO_RENEW": {
      SetAutoRenewInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.setAutoRenewOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_RENEWAL_DATE": {
      SetRenewalDateInputSchema().parse(action.input);

      subscriptionInstanceSubscriptionOperations.setRenewalDateOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_SERVICE": {
      AddServiceInputSchema().parse(action.input);

      subscriptionInstanceServiceOperations.addServiceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_SERVICE": {
      RemoveServiceInputSchema().parse(action.input);

      subscriptionInstanceServiceOperations.removeServiceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_SERVICE_SETUP_COST": {
      UpdateServiceSetupCostInputSchema().parse(action.input);

      subscriptionInstanceServiceOperations.updateServiceSetupCostOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_SERVICE_RECURRING_COST": {
      UpdateServiceRecurringCostInputSchema().parse(action.input);

      subscriptionInstanceServiceOperations.updateServiceRecurringCostOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REPORT_SETUP_PAYMENT": {
      ReportSetupPaymentInputSchema().parse(action.input);

      subscriptionInstanceServiceOperations.reportSetupPaymentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REPORT_RECURRING_PAYMENT": {
      ReportRecurringPaymentInputSchema().parse(action.input);

      subscriptionInstanceServiceOperations.reportRecurringPaymentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_SERVICE_INFO": {
      UpdateServiceInfoInputSchema().parse(action.input);

      subscriptionInstanceServiceOperations.updateServiceInfoOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_SERVICE_GROUP": {
      AddServiceGroupInputSchema().parse(action.input);

      subscriptionInstanceServiceGroupOperations.addServiceGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_SERVICE_GROUP": {
      RemoveServiceGroupInputSchema().parse(action.input);

      subscriptionInstanceServiceGroupOperations.removeServiceGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_SERVICE_TO_GROUP": {
      AddServiceToGroupInputSchema().parse(action.input);

      subscriptionInstanceServiceGroupOperations.addServiceToGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_SERVICE_FROM_GROUP": {
      RemoveServiceFromGroupInputSchema().parse(action.input);

      subscriptionInstanceServiceGroupOperations.removeServiceFromGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_SERVICE_METRIC": {
      AddServiceMetricInputSchema().parse(action.input);

      subscriptionInstanceMetricsOperations.addServiceMetricOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_METRIC": {
      UpdateMetricInputSchema().parse(action.input);

      subscriptionInstanceMetricsOperations.updateMetricOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_METRIC_USAGE": {
      UpdateMetricUsageInputSchema().parse(action.input);

      subscriptionInstanceMetricsOperations.updateMetricUsageOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_SERVICE_METRIC": {
      RemoveServiceMetricInputSchema().parse(action.input);

      subscriptionInstanceMetricsOperations.removeServiceMetricOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "INCREMENT_METRIC_USAGE": {
      IncrementMetricUsageInputSchema().parse(action.input);

      subscriptionInstanceMetricsOperations.incrementMetricUsageOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "DECREMENT_METRIC_USAGE": {
      DecrementMetricUsageInputSchema().parse(action.input);

      subscriptionInstanceMetricsOperations.decrementMetricUsageOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "CREATE_INVOICE": {
      CreateInvoiceInputSchema().parse(action.input);

      subscriptionInstanceBillingOperations.createInvoiceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_INVOICE_STATUS": {
      UpdateInvoiceStatusInputSchema().parse(action.input);

      subscriptionInstanceBillingOperations.updateInvoiceStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_INVOICE_LINE_ITEM": {
      AddInvoiceLineItemInputSchema().parse(action.input);

      subscriptionInstanceBillingOperations.addInvoiceLineItemOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_INVOICE_LINE_ITEM": {
      RemoveInvoiceLineItemInputSchema().parse(action.input);

      subscriptionInstanceBillingOperations.removeInvoiceLineItemOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_INVOICE_TAX": {
      SetInvoiceTaxInputSchema().parse(action.input);

      subscriptionInstanceBillingOperations.setInvoiceTaxOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "RECORD_INVOICE_PAYMENT": {
      RecordInvoicePaymentInputSchema().parse(action.input);

      subscriptionInstanceBillingOperations.recordInvoicePaymentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SEND_INVOICE": {
      SendInvoiceInputSchema().parse(action.input);

      subscriptionInstanceBillingOperations.sendInvoiceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "CANCEL_INVOICE": {
      CancelInvoiceInputSchema().parse(action.input);

      subscriptionInstanceBillingOperations.cancelInvoiceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "MARK_INVOICE_OVERDUE": {
      MarkInvoiceOverdueInputSchema().parse(action.input);

      subscriptionInstanceBillingOperations.markInvoiceOverdueOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REFUND_INVOICE": {
      RefundInvoiceInputSchema().parse(action.input);

      subscriptionInstanceBillingOperations.refundInvoiceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_CUSTOMER_WALLET": {
      UpdateCustomerWalletInputSchema().parse(action.input);

      subscriptionInstanceCustomerOperations.updateCustomerWalletOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_CUSTOMER_TYPE": {
      SetCustomerTypeInputSchema().parse(action.input);

      subscriptionInstanceCustomerOperations.setCustomerTypeOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_TEAM_MEMBER_COUNT": {
      UpdateTeamMemberCountInputSchema().parse(action.input);

      subscriptionInstanceCustomerOperations.updateTeamMemberCountOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_KYC_STATUS": {
      UpdateKycStatusInputSchema().parse(action.input);

      subscriptionInstanceCustomerOperations.updateKycStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_COMMUNICATION_CHANNEL": {
      AddCommunicationChannelInputSchema().parse(action.input);

      subscriptionInstanceCustomerOperations.addCommunicationChannelOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_COMMUNICATION_CHANNEL": {
      RemoveCommunicationChannelInputSchema().parse(action.input);

      subscriptionInstanceCustomerOperations.removeCommunicationChannelOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_PRIMARY_COMMUNICATION_CHANNEL": {
      SetPrimaryCommunicationChannelInputSchema().parse(action.input);

      subscriptionInstanceCustomerOperations.setPrimaryCommunicationChannelOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "VERIFY_COMMUNICATION_CHANNEL": {
      VerifyCommunicationChannelInputSchema().parse(action.input);

      subscriptionInstanceCustomerOperations.verifyCommunicationChannelOperation(
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

export const reducer = createReducer<SubscriptionInstancePHState>(stateReducer);
