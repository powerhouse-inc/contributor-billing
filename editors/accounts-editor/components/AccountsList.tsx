import type { AccountEntry, KycAmlStatusTypeInput } from "../../../document-models/accounts/gen/schema/types.js";
import { AccountCard } from "./AccountCard.js";

interface AccountsListProps {
  accounts: AccountEntry[];
  onEdit: (account: AccountEntry) => void;
  onDelete: (id: string) => void;
  onUpdateKycStatus: (id: string, status: KycAmlStatusTypeInput) => void;
  onCreateTransactions?: (account: AccountEntry) => void;
  creatingTransactionsFor?: string;
}

export function AccountsList({
  accounts,
  onEdit,
  onDelete,
  onUpdateKycStatus,
  onCreateTransactions,
  creatingTransactionsFor,
}: AccountsListProps) {
  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No accounts found
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Account Count */}
      <div className="text-sm text-gray-600">
        {accounts.length} account{accounts.length !== 1 ? 's' : ''}
      </div>

      {/* Full-width Card List */}
      <div className="space-y-4">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateKycStatus={onUpdateKycStatus}
            onCreateTransactions={onCreateTransactions}
            isCreatingTransactions={creatingTransactionsFor === account.id}
          />
        ))}
      </div>
    </div>
  );
}