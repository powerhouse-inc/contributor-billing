import { useSelectedDriveDocuments } from "@powerhousedao/reactor-browser";
import { actions } from "../../../document-models/expense-report/index.js";
import { generateId } from "document-model";
import type { LineItemGroup } from "../../../document-models/expense-report/gen/types.js";

interface BillingStatementLineItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unitPriceCash: number;
  unitPricePwt: number;
  totalPriceCash: number;
  totalPricePwt: number;
  lineItemTag?: Array<{
    id: string;
    label: string;
    dimension: string;
  }>;
}

export function useSyncWallet() {
  const documents = useSelectedDriveDocuments();

  const syncWallet = (
    walletAddress: string,
    billingStatementIds: string[],
    groups: LineItemGroup[],
    dispatch: any
  ) => {
    if (!documents) return;

    // Get billing statement documents
    const billingStatements = new Map<string, any>();
    documents
      .filter((doc: any) => doc.header.documentType === "powerhouse/billing-statement")
      .forEach((doc: any) => {
        billingStatements.set(doc.header.id, doc);
      });

    // Helper function to map tag to group
    const mapTagToGroup = (billingLineItem: BillingStatementLineItem): string | null => {
      // Find expense-account tag
      const expenseAccountTag = billingLineItem.lineItemTag?.find(
        (tag) => tag.dimension === "expense-account"
      );

      if (!expenseAccountTag || !expenseAccountTag.label) return null;

      // Find matching group by label
      const group = groups.find((g) => g.label === expenseAccountTag.label);
      return group ? group.id : null;
    };

    // Aggregate line items by category
    const categoryAggregation = new Map<string, {
      groupId: string | null;
      groupLabel: string;
      budget: number;
      actuals: number;
      forecast: number;
      payments: number;
    }>();

    // Extract and aggregate line items from all billing statements
    billingStatementIds.forEach((statementId) => {
      const statement = billingStatements.get(statementId);
      if (!statement?.state?.global?.lineItems) return;

      const lineItems = statement.state.global.lineItems || [];

      lineItems.forEach((billingLineItem: BillingStatementLineItem) => {
        const groupId = mapTagToGroup(billingLineItem);
        const categoryKey = groupId || "uncategorized";

        const existing = categoryAggregation.get(categoryKey);

        if (existing) {
          // Aggregate values for the same category
          existing.actuals += billingLineItem.totalPriceCash || 0;
        } else {
          // Create new category entry
          const group = groups.find((g) => g.id === groupId);
          categoryAggregation.set(categoryKey, {
            groupId: groupId,
            groupLabel: group?.label || "Uncategorised",
            budget: 0,
            actuals: billingLineItem.totalPriceCash || 0,
            forecast: 0,
            payments: 0,
          });
        }
      });
    });

    // Now add aggregated line items to wallet
    categoryAggregation.forEach((aggregatedItem) => {
      const expenseLineItem = {
        id: generateId(),
        label: aggregatedItem.groupLabel,
        group: aggregatedItem.groupId,
        budget: aggregatedItem.budget,
        actuals: aggregatedItem.actuals,
        forecast: aggregatedItem.forecast,
        payments: aggregatedItem.payments,
        comments: null,
      };

      dispatch(
        actions.addLineItem({
          wallet: walletAddress,
          lineItem: expenseLineItem,
        })
      );
    });
  };

  return { syncWallet };
}
