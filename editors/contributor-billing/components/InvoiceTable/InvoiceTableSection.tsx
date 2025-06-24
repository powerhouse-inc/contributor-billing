import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@powerhousedao/design-system";
import { DocumentModelModule } from "document-model";

export const InvoiceTableSection = ({
  title,
  count,
  children,
  color = "bg-blue-100 text-blue-600",
  onSelectDocumentModel,
  filteredDocumentModels,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  color?: string;
  onSelectDocumentModel?: (model: DocumentModelModule) => void;
  filteredDocumentModels?: DocumentModelModule[];
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const invoiceDodModel = filteredDocumentModels?.find(model => model.documentModel.id === "powerhouse/invoice");

  return (
    <div className="mb-2">
      <div className="grid grid-cols-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center gap-2 hover:opacity-80 transition-opacity col-span-1"
        >
          <span className="font-medium">{title}</span>
          <span
            className={`inline-flex items-center justify-center rounded-full text-xs font-bold px-2 ${color}`}
          >
            {count}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-900" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-900" />
          )}
        </button>
        {title === "Draft" && (
        <button
          className="bg-white border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 col-span-1 justify-self-end"
          onClick={() => {
            onSelectDocumentModel?.(invoiceDodModel as DocumentModelModule);
          }}
          >
            Create Invoice
          </button>
        )}
      </div>
      {isExpanded && <div className="mt-2">{children}</div>}
    </div>
  );
};
