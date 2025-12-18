import { useState } from "react";
import {
  Button,
  Form,
  FormLabel,
  StringField,
} from "@powerhousedao/document-engineering";
import type {
  AccountEntry,
  AccountTypeInput,
  KycAmlStatusTypeInput,
} from "../../../document-models/accounts/gen/schema/types.js";

interface AccountFormProps {
  account?: AccountEntry;
  onSubmit: (values: {
    id?: string;
    account: string;
    name: string;
    budgetPath?: string;
    accountTransactionsId?: string;
    chain?: string[];
    type?: AccountTypeInput;
    owners?: string[];
    KycAmlStatus?: KycAmlStatusTypeInput;
  }) => void;
  onCancel: () => void;
}

export function AccountForm({ account, onSubmit, onCancel }: AccountFormProps) {
  const [formData, setFormData] = useState({
    account: account?.account || "",
    name: account?.name || "",
    budgetPath: account?.budgetPath || "",
    accountTransactionsId: account?.accountTransactionsId || "",
    chain: account?.chain?.join(", ") || "",
    type: account?.type || ("" as AccountTypeInput | ""),
    owners: account?.owners?.join(", ") || "",
    KycAmlStatus: account?.KycAmlStatus || ("" as KycAmlStatusTypeInput | ""),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const chain = formData.chain
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c);
    const owners = formData.owners
      .split(",")
      .map((o) => o.trim())
      .filter((o) => o);

    // Validate required fields with custom message
    const typeSelect = e.currentTarget.querySelector<HTMLSelectElement>('select[name="accountType"]');
    if (!formData.type) {
      if (typeSelect) {
        typeSelect.setCustomValidity("Please select an Account Type");
        typeSelect.reportValidity();
      } else {
        alert("Account Type is required");
      }
      return;
    } else if (typeSelect) {
      typeSelect.setCustomValidity(""); // Clear any previous custom message
    }

    onSubmit({
      ...(account?.id && { id: account.id }),
      account: formData.account,
      name: formData.name,
      budgetPath: formData.budgetPath || undefined,
      accountTransactionsId: formData.accountTransactionsId || undefined,
      chain: chain.length > 0 ? chain : undefined,
      type: formData.type as AccountTypeInput, // Required field
      owners: owners.length > 0 ? owners : undefined,
      KycAmlStatus: formData.KycAmlStatus || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.account}
              onChange={(e) =>
                setFormData({ ...formData, account: e.target.value })
              }
              placeholder="e.g., 0x1234...abcd"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Main Treasury"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              name="accountType"
              value={formData.type}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  type: e.target.value as AccountTypeInput,
                });
                // Clear custom validation message when user selects a value
                e.target.setCustomValidity("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              required
            >
              <option value="">Select type...</option>
              <option value="Source">Source</option>
              <option value="Internal">Internal</option>
              <option value="Destination">Destination</option>
              <option value="External">External</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              KYC/AML Status
            </label>
            <select
              value={formData.KycAmlStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  KycAmlStatus: e.target.value as KycAmlStatusTypeInput,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select status...</option>
              <option value="PASSED">Passed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Path
          </label>
          <input
            type="text"
            value={formData.budgetPath}
            onChange={(e) =>
              setFormData({ ...formData, budgetPath: e.target.value })
            }
            placeholder="e.g., /treasury/operations"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Transactions ID
          </label>
          <input
            type="text"
            value={formData.accountTransactionsId}
            onChange={(e) =>
              setFormData({
                ...formData,
                accountTransactionsId: e.target.value,
              })
            }
            placeholder="e.g., tx-12345"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chains
            <span className="ml-2 text-xs text-gray-500 font-normal">
              (comma-separated)
            </span>
          </label>
          <input
            type="text"
            value={formData.chain}
            onChange={(e) =>
              setFormData({ ...formData, chain: e.target.value })
            }
            placeholder="e.g., Ethereum, Polygon, Arbitrum"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Owners
            <span className="ml-2 text-xs text-gray-500 font-normal">
              (comma-separated)
            </span>
          </label>
          <input
            type="text"
            value={formData.owners}
            onChange={(e) =>
              setFormData({ ...formData, owners: e.target.value })
            }
            placeholder="e.g., Alice, Bob, Charlie"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors"
        >
          {account ? "Update Account" : "Add Account"}
        </Button>
      </div>
    </form>
  );
}
