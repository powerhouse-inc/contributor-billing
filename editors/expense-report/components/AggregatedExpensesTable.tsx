import { useMemo, useState } from "react";
import React from "react";
import type { Wallet, LineItemGroup, LineItem } from "../../../document-models/expense-report/gen/types.js";
import { actions } from "../../../document-models/expense-report/index.js";
import { Textarea } from "@powerhousedao/document-engineering";

interface AggregatedExpensesTableProps {
  wallets: Wallet[];
  groups: LineItemGroup[];
  periodStart?: string | null;
  periodEnd?: string | null;
  dispatch: (action: any) => void;
}

interface LineItemWithGroupInfo extends LineItem {
  parentGroupId?: string | null;
  parentGroupLabel?: string;
  groupLabel?: string;
}

export function AggregatedExpensesTable({
  wallets,
  groups,
  periodStart,
  periodEnd,
  dispatch,
}: AggregatedExpensesTableProps) {
  // State for active tab (selected wallet)
  const [activeWalletIndex, setActiveWalletIndex] = useState(0);

  // State for editing comments
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string>("");

  // Format period for title
  const periodTitle = useMemo(() => {
    if (!periodStart) return "Breakdown";

    const date = new Date(periodStart);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${month} ${year} Breakdown`;
  }, [periodStart]);

  // Create a map of groups with their parent info
  const groupsMap = useMemo(() => {
    const map = new Map<string, { group: LineItemGroup; parent?: LineItemGroup }>();

    groups.forEach((group) => {
      map.set(group.id, { group });
    });

    // Add parent references
    groups.forEach((group) => {
      if (group.parentId) {
        const entry = map.get(group.id);
        const parentEntry = map.get(group.parentId);
        if (entry && parentEntry) {
          entry.parent = parentEntry.group;
        }
      }
    });

    return map;
  }, [groups]);

  // Get line items for the active wallet with group information
  const walletLineItems = useMemo(() => {
    if (!wallets[activeWalletIndex]) return [];

    const wallet = wallets[activeWalletIndex];
    const lineItems = wallet.lineItems || [];

    return lineItems
      .filter((item): item is NonNullable<typeof item> => item !== null && item !== undefined)
      .map((item): LineItemWithGroupInfo => {
        const groupInfo = item.group ? groupsMap.get(item.group) : undefined;

        return {
          ...item,
          groupLabel: groupInfo?.group.label || undefined,
          parentGroupId: groupInfo?.parent?.id || null,
          parentGroupLabel: groupInfo?.parent?.label || undefined,
        };
      });
  }, [wallets, activeWalletIndex, groupsMap]);

  // Group line items by category and aggregate by parent category
  const groupedAndAggregatedItems = useMemo(() => {
    // First, aggregate line items by their category (group)
    const categoryAggregation = new Map<string, {
      groupId: string;
      groupLabel: string;
      parentGroupId: string | null | undefined;
      parentGroupLabel: string | undefined;
      budget: number;
      forecast: number;
      actuals: number;
      payments: number;
      comment: string;
    }>();

    walletLineItems.forEach((item) => {
      if (!item) return;

      const categoryKey = item.group || "uncategorized";
      const existing = categoryAggregation.get(categoryKey);

      if (existing) {
        // Aggregate values for the same category
        existing.budget += item.budget || 0;
        existing.forecast += item.forecast || 0;
        existing.actuals += item.actuals || 0;
        existing.payments += item.payments || 0;
        // Comment stays the same (first item's comment is used)
      } else {
        // Create new category entry
        categoryAggregation.set(categoryKey, {
          groupId: categoryKey,
          groupLabel: item.groupLabel || "Uncategorised",
          parentGroupId: item.parentGroupId,
          parentGroupLabel: item.parentGroupLabel,
          budget: item.budget || 0,
          forecast: item.forecast || 0,
          actuals: item.actuals || 0,
          payments: item.payments || 0,
          comment: item.comments || "",
        });
      }
    });

    // Then, group aggregated categories by their parent
    const grouped = new Map<string, typeof categoryAggregation extends Map<string, infer T> ? T[] : never>();

    categoryAggregation.forEach((aggItem) => {
      const parentKey = aggItem.parentGroupId || "uncategorized";
      const items = grouped.get(parentKey) || [];
      items.push(aggItem);
      grouped.set(parentKey, items);
    });

    return grouped;
  }, [walletLineItems]);

  // Calculate subtotals for each parent group
  const calculateSubtotal = (items: Array<{
    budget: number;
    forecast: number;
    actuals: number;
    payments: number;
    [key: string]: any;
  }>) => {
    return items.reduce(
      (acc, item) => ({
        budget: acc.budget + item.budget,
        forecast: acc.forecast + item.forecast,
        actuals: acc.actuals + item.actuals,
        difference: acc.difference + (item.actuals - item.budget),
        payments: acc.payments + item.payments,
      }),
      { budget: 0, forecast: 0, actuals: 0, difference: 0, payments: 0 }
    );
  };

  // Calculate grand totals
  const grandTotals = useMemo(() => {
    return walletLineItems.reduce(
      (acc, item) => ({
        budget: acc.budget + (item?.budget || 0),
        forecast: acc.forecast + (item?.forecast || 0),
        actuals: acc.actuals + (item?.actuals || 0),
        difference: acc.difference + ((item?.actuals || 0) - (item?.budget || 0)),
        payments: acc.payments + (item?.payments || 0),
      }),
      { budget: 0, forecast: 0, actuals: 0, difference: 0, payments: 0 }
    );
  }, [walletLineItems]);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatWalletAddress = (address: string) => {
    if (!address || address.length < 13) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  // Handle starting comment edit
  const handleStartEdit = (groupId: string, currentComment: string) => {
    setEditingGroupId(groupId);
    setEditingComment(currentComment);
  };

  // Handle saving comment
  const handleSaveComment = (groupId: string) => {
    const wallet = wallets[activeWalletIndex];
    if (!wallet || !wallet.wallet) return;

    // Find all line items with this group ID
    const lineItemsToUpdate = wallet.lineItems?.filter(
      (item) => item?.group === groupId
    ) || [];

    // Create all update actions
    const updateActions = lineItemsToUpdate
      .filter((item) => item?.id)
      .map((item) =>
        actions.updateLineItem({
          wallet: wallet.wallet!,
          lineItemId: item!.id!,
          comments: editingComment,
        })
      );

    // Dispatch all actions at once
    if (updateActions.length > 0) {
      dispatch(updateActions);
    }

    // Reset editing state
    setEditingGroupId(null);
    setEditingComment("");
  };

  // Handle canceling comment edit
  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setEditingComment("");
  };

  // Sort parent groups: Headcount first, then Non-Headcount, then others, then uncategorized
  const sortedParentKeys = useMemo(() => {
    const keys = Array.from(groupedAndAggregatedItems.keys());

    // Find Headcount and Non-Headcount group IDs
    const headcountGroup = groups.find(g => g.label === "Headcount Expenses");
    const nonHeadcountGroup = groups.find(g => g.label === "Non-Headcount Expenses");

    return keys.sort((a, b) => {
      // Uncategorized always goes last
      if (a === "uncategorized") return 1;
      if (b === "uncategorized") return -1;

      // Headcount Expenses always first
      if (a === headcountGroup?.id) return -1;
      if (b === headcountGroup?.id) return 1;

      // Non-Headcount Expenses always second
      if (a === nonHeadcountGroup?.id) return -1;
      if (b === nonHeadcountGroup?.id) return 1;

      // For other groups, maintain their original order
      return 0;
    });
  }, [groupedAndAggregatedItems, groups]);

  if (wallets.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Wallet Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {wallets.map((wallet, index) => {
            const isActive = index === activeWalletIndex;
            return (
              <button
                key={wallet.wallet || index}
                onClick={() => setActiveWalletIndex(index)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    isActive
                      ? "border-green-500 text-green-600 dark:text-green-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }
                `}
              >
                {wallet.name || formatWalletAddress(wallet.wallet || "")}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Expense Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mthly Budget
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Forecast
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actuals
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Difference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Comments
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Payments
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedParentKeys.map((parentKey) => {
              const items = groupedAndAggregatedItems.get(parentKey) || [];
              if (items.length === 0) return null;

              const subtotals = calculateSubtotal(items);
              const parentLabel =
                parentKey === "uncategorized"
                  ? "Uncategorised"
                  : items[0]?.parentGroupLabel || "Other";

              return (
                <React.Fragment key={parentKey}>
                  {/* Parent Category Header */}
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <td
                      colSpan={7}
                      className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white"
                    >
                      {parentLabel}
                    </td>
                  </tr>

                  {/* Aggregated Category Items */}
                  {items.map((item) => {
                    if (!item) return null;

                    const difference = item.actuals - item.budget;
                    const isEditing = editingGroupId === item.groupId;

                    return (
                      <tr
                        key={item.groupId}
                        className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.groupLabel}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                          {formatNumber(item.budget)}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                          {formatNumber(item.forecast)}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                          {formatNumber(item.actuals)}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap text-right text-sm font-medium ${
                            difference > 0
                              ? "text-red-600 dark:text-red-400"
                              : difference < 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {formatNumber(difference)}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          {isEditing ? (
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <Textarea
                                  value={editingComment}
                                  onChange={(e) => setEditingComment(e.target.value)}
                                  placeholder="Add comment..."
                                  autoExpand={true}
                                  multiline={true}
                                  onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                      handleCancelEdit();
                                    }
                                  }}
                                />
                              </div>
                              <div className="flex gap-1 mt-1">
                                <button
                                  onClick={() => handleSaveComment(item.groupId)}
                                  className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                  title="Save"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
                                  title="Cancel"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group">
                              <span className="text-gray-600 dark:text-gray-400 italic flex-1 whitespace-pre-wrap">
                                {item.comment || "No comments"}
                              </span>
                              <button
                                onClick={() => handleStartEdit(item.groupId, item.comment)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                title="Edit comment"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-gray-600 dark:text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                          {formatNumber(item.payments)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Subtotal Row */}
                  <tr className="bg-gray-50 dark:bg-gray-800/50 font-semibold">
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      Subtotal
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {formatNumber(subtotals.budget)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {formatNumber(subtotals.forecast)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {formatNumber(subtotals.actuals)}
                    </td>
                    <td
                      className={`px-6 py-3 whitespace-nowrap text-right text-sm font-bold ${
                        subtotals.difference > 0
                          ? "text-red-600 dark:text-red-400"
                          : subtotals.difference < 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {formatNumber(subtotals.difference)}
                    </td>
                    <td className="px-6 py-3"></td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {formatNumber(subtotals.payments)}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}

            {/* Grand Total Row */}
            <tr className="bg-gray-100 dark:bg-gray-800 font-bold">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                {formatNumber(grandTotals.budget)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                {formatNumber(grandTotals.forecast)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                {formatNumber(grandTotals.actuals)}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
                  grandTotals.difference > 0
                    ? "text-red-600 dark:text-red-400"
                    : grandTotals.difference < 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {formatNumber(grandTotals.difference)}
              </td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                {formatNumber(grandTotals.payments)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
