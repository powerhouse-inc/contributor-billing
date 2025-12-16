import React, { useState } from "react";
import type { AccountEntry, AccountTypeInput, KycAmlStatusTypeInput } from "../../../document-models/accounts/gen/schema/types.js";

interface AccountsFilterProps {
  accounts: AccountEntry[];
  onFilteredAccountsChange: (filteredAccounts: AccountEntry[]) => void;
}

export function AccountsFilter({
  accounts,
  onFilteredAccountsChange,
}: AccountsFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<AccountTypeInput | "">("");
  const [kycFilter, setKycFilter] = useState<KycAmlStatusTypeInput | "">("");
  const [chainFilter, setChainFilter] = useState("");

  function applyFilters() {
    const filtered = accounts.filter((account) => {
      const matchesSearch =
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.account.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !typeFilter || account.type === typeFilter;

      const matchesKyc = !kycFilter || account.KycAmlStatus === kycFilter;

      const matchesChain = !chainFilter ||
        (account.chain && account.chain.some(chain =>
          chain.toLowerCase().includes(chainFilter.toLowerCase())
        ));

      return matchesSearch && matchesType && matchesKyc && matchesChain;
    });

    onFilteredAccountsChange(filtered);
  }

  function clearFilters() {
    setSearchTerm("");
    setTypeFilter("");
    setKycFilter("");
    setChainFilter("");
    onFilteredAccountsChange(accounts);
  }

  // Apply filters whenever filter values or accounts change
  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, typeFilter, kycFilter, chainFilter, accounts]);

  const hasActiveFilters = searchTerm || typeFilter || kycFilter || chainFilter;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filter Accounts</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Account Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as AccountTypeInput | "")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Types</option>
            <option value="Source">Source</option>
            <option value="Internal">Internal</option>
            <option value="Destination">Destination</option>
            <option value="External">External</option>
          </select>
        </div>

        {/* KYC Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            KYC Status
          </label>
          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value as KycAmlStatusTypeInput | "")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="PASSED">Passed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {/* Chain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chain
          </label>
          <input
            type="text"
            placeholder="Filter by chain..."
            value={chainFilter}
            onChange={(e) => setChainFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
}