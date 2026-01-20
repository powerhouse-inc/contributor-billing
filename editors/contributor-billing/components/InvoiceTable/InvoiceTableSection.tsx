import { useState, useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { VetraDocumentModelModule } from "@powerhousedao/reactor-browser";

interface InvoiceTableSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
  color?: string;
  onSelectDocumentModel?: (model: VetraDocumentModelModule) => void;
  filteredDocumentModels?: VetraDocumentModelModule[];
  defaultExpanded?: boolean;
}

export const InvoiceTableSection = ({
  title,
  count,
  children,
  color = "bg-blue-100 text-blue-600",
  onSelectDocumentModel,
  filteredDocumentModels,
  defaultExpanded = true,
}: InvoiceTableSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const invoiceDocModel = filteredDocumentModels?.find(
    (model) => model.id === "powerhouse/invoice",
  );

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleCreateInvoice = useCallback(() => {
    if (invoiceDocModel) {
      onSelectDocumentModel?.(invoiceDocModel);
    }
  }, [invoiceDocModel, onSelectDocumentModel]);

  return (
    <div className="contributor-billing-section mb-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity py-1"
        >
          <span className="font-medium text-gray-800">{title}</span>
          <span
            className={`inline-flex items-center justify-center rounded-full text-xs font-semibold px-2 py-0.5 min-w-[24px] ${color}`}
          >
            {count}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {title === "Draft" && invoiceDocModel && (
          <button
            type="button"
            className="bg-white border border-gray-300 rounded px-3 py-1 text-sm font-medium hover:bg-gray-50 transition-colors"
            onClick={handleCreateInvoice}
          >
            Create Invoice
          </button>
        )}
      </div>

      {isExpanded && <div className="mt-2">{children}</div>}
    </div>
  );
};
