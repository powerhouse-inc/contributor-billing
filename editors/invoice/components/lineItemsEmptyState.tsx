import { FileText } from "lucide-react";

type LineItemsEmptyStateProps = {
  onAddItem: () => void;
};

export function LineItemsEmptyState({ onAddItem }: LineItemsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No line items yet
      </h3>
      <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
        Add your first line item to start building your invoice
      </p>
      <button
        onClick={onAddItem}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Add Your First Line Item
      </button>
    </div>
  );
}
