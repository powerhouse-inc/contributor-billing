import { FileItem } from "@powerhousedao/design-system/connect";

export const InvoiceTableRow = ({
  files,
  row,
  isSelected,
  onSelect,
  onCreateBillingStatement,
  billingDocStates,
}: {
  files?: { id: string; name: string; documentType?: string }[];
  row: any;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onCreateBillingStatement?: (id: string) => void;
  billingDocStates?: { id: string; contributor: string }[];
}) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    // Use ISO short month names (Jan, Feb, etc.)
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const formatAmount = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "0.00";
    return numAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const billingDoc = billingDocStates?.find(
    (doc) => doc.contributor === row.id
  );
  const billingFile = files?.find((file) => file.id === billingDoc?.id);

  const file = files?.find((file) => file.id === row.id);

  const hasExportedData =
    row.exported != null && Boolean(row.exported.timestamp?.trim());

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-2 py-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="size-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
      </td>
      <td className="py-1 w-10">
        {file && (
          <FileItem
            key={row.id}
            fileNode={file as any}
            className="h-10"
          />
        )}
      </td>
      <td className="px-2 py-2 text-center">{row.invoiceNo}</td>
      <td className="px-2 py-2 text-center">{row.issueDate}</td>
      <td className="px-2 py-2 text-center">{row.dueDate}</td>
      <td className="px-2 py-2 text-center">{row.currency}</td>
      <td className="px-2 py-2 text-center">{formatAmount(row.amount)}</td>
      {(row.status === "ISSUED" ||
        row.status === "ACCEPTED" ||
        row.status === "PAYMENTSCHEDULED" ||
        row.status === "PAYMENTRECEIVED" ||
        row.status === "PAYMENTSENT") &&
        !billingFile && (
          <td className="px-2 py-2 text-center">
            <button
              className="bg-white border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 col-span-1 justify-self-end"
              onClick={() => onCreateBillingStatement?.(row.id)}
            >
              Generate Billing Statement
            </button>
          </td>
        )}
      {billingFile && (
        <td className="px-2 py-2 text-center">
          <FileItem
            key={billingDoc?.id}
            fileNode={billingFile as any}
            className="h-10"
          />
        </td>
      )}
      <td className="px-2 py-2 text-center">
        {hasExportedData ? (
          <div className="flex flex-col items-center">
            <span className="text-green-500">Yes</span>
            <span className="text-green-500 text-xs">
              {formatTimestamp(row.exported.timestamp)}
            </span>
          </div>
        ) : (
          <span className="text-red-500">No</span>
        )}
      </td>
    </tr>
  );
};
