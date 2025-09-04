import React from "react";
import { useState, useMemo } from "react";
import { HeaderControls } from "./HeaderControls.js";
import { InvoiceTableSection } from "./InvoiceTableSection.js";
import { InvoiceTableRow } from "./InvoiceTableRow.js";
import { type InvoiceLineItem } from "document-models/invoice/index.js";
import { createPresignedHeader } from "document-model";
import { type DocumentModelModule } from "document-model";
import { mapTags } from "../../../billing-statement/lineItemTags/tagMapping.js";
import { exportInvoicesToXeroCSV } from "../../../../scripts/contributor-billing/createXeroCsv.js";
import { toast } from "@powerhousedao/design-system";
import {
  actions,
  type InvoiceAction,
} from "../../../../document-models/invoice/index.js";
import {
  addDocument,
  type DriveEditorProps,
  getSyncStatusSync,
  setSelectedNode,
  useAllFolderNodes,
  useDocumentModelModules,
  useDriveContext,
  useDriveSharingType,
  useEditorModules,
  useFileChildNodes,
  useFolderChildNodes,
  useSelectedDrive,
  useSelectedFolder,
  useSelectedNodePath,
  useUserPermissions,
} from "@powerhousedao/reactor-browser";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Issued", value: "ISSUED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Payment Scheduled", value: "PAYMENTSCHEDULED" },
  { label: "Payment Sent", value: "PAYMENTSENT" },
  { label: "Payment Issue", value: "PAYMENTISSUE" },
  { label: "Payment Closed", value: "PAYMENTCLOSED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Other", value: "OTHER" },
];

interface InvoiceTableProps {
  files: any[];
  state: Record<string, any>;
  setActiveDocumentId: (id: string) => void;
  selected: { [id: string]: boolean };
  setSelected: (
    selected:
      | { [id: string]: boolean }
      | ((prev: { [id: string]: boolean }) => { [id: string]: boolean })
  ) => void;
  onBatchAction: (action: string) => void;
  onDeleteNode: (nodeId: string) => void;
  renameNode: (nodeId: string, name: string) => void;
  filteredDocumentModels: DocumentModelModule[];
  onSelectDocumentModel: (model: DocumentModelModule) => void;
}

export const InvoiceTable = ({
  files,
  state,
  setActiveDocumentId,
  selected,
  setSelected,
  onBatchAction,
  onDeleteNode,
  renameNode,
  filteredDocumentModels,
  onSelectDocumentModel,
}: InvoiceTableProps) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const [selectedDrive] = useSelectedDrive();

  const billingDocStates = Object.entries(state)
    .filter(([_, doc]) => doc.documentType === "powerhouse/billing-statement")
    .map(([id, doc]) => ({
      id,
      contributor: doc.global.contributor,
    }));

  const getMenuOptions = () => {
    return [
      { label: "View Invoice", value: "view-invoice" },
      // { label: "View Payment Transaction", value: "view-payment" },
    ];
  };

  const handleStatusChange = (value: string | string[]) => {
    setSelectedStatuses(Array.isArray(value) ? value : [value]);
  };

  const shouldShowSection = (status: string) => {
    return selectedStatuses.length === 0 || selectedStatuses.includes(status);
  };

  const getInvoicesByStatus = (status: string) => {
    return Object.entries(state)
      .filter(
        ([_, doc]) =>
          doc.documentType === "powerhouse/invoice" &&
          doc.global.status === status
      )
      .map(([id, doc]) => ({
        id,
        issuer: doc.global.issuer?.name || "Unknown",
        status: doc.global.status,
        invoiceNo: doc.global.invoiceNo,
        issueDate: doc.global.dateIssued,
        dueDate: doc.global.dateDue,
        currency: doc.global.currency,
        amount: doc.global.totalPriceTaxIncl?.toString() ?? "",
        exported: doc.global.exported,
      }));
  };

  // console.log('filteredDocumentModels', filteredDocumentModels)

  const getOtherInvoices = () => {
    return Object.entries(state)
      .filter(
        ([_, doc]) =>
          doc.documentType === "powerhouse/invoice" &&
          doc.global.status !== "DRAFT" &&
          doc.global.status !== "ISSUED" &&
          doc.global.status !== "ACCEPTED" &&
          doc.global.status !== "PAYMENTSCHEDULED" &&
          doc.global.status !== "PAYMENTSENT" &&
          doc.global.status !== "PAYMENTISSUE" &&
          doc.global.status !== "PAYMENTCLOSED" &&
          doc.global.status !== "REJECTED"
      )
      .map(([id, doc]) => ({
        id,
        issuer: doc.global.issuer?.name || "Unknown",
        status: doc.global.status,
        invoiceNo: doc.global.invoiceNo,
        issueDate: doc.global.dateIssued,
        dueDate: doc.global.dateDue,
        currency: doc.global.currency,
        amount: doc.global.totalPriceTaxIncl?.toString() ?? "",
        documentType: doc.documentType,
        exported: doc.global.exported,
      }));
  };

  const draft = getInvoicesByStatus("DRAFT");
  const issued = getInvoicesByStatus("ISSUED");
  const accepted = getInvoicesByStatus("ACCEPTED");
  const paymentScheduled = getInvoicesByStatus("PAYMENTSCHEDULED");
  const paymentSent = getInvoicesByStatus("PAYMENTSENT");
  const paymentIssue = getInvoicesByStatus("PAYMENTISSUE");
  const paymentClosed = getInvoicesByStatus("PAYMENTCLOSED");
  const rejected = getInvoicesByStatus("REJECTED");
  const otherInvoices = getOtherInvoices();

  const handleDelete = (id: string) => {
    onDeleteNode(id);
    // Clear selection for deleted item
  };

  const cleanName = (name: string) => {
    const dotIndex = name.lastIndexOf(".");
    if (dotIndex > 0) {
      return name.substring(0, dotIndex);
    }
    return name;
  };

  // Remove all non-alphanumeric, non-hyphen, non-underscore chars for slug safety
  const makeSlug = (name: string) => {
    return name
      .replace(/\./g, "") // remove dots
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/[^\w-]/g, "") // remove all non-word chars except hyphen/underscore
      .toLowerCase();
  };

  const handleCreateBillingStatement = async (id: string) => {
    const invoiceFile = files.find((file) => file.id === id);
    const invoiceState = state[id];

    await addDocument(
      selectedDrive?.header.id || "",
      `bill-${invoiceFile?.name}`,
      "powerhouse/billing-statement",
      undefined,
      {
        header: {
          ...createPresignedHeader(),
          ...{
            slug: `bill-${makeSlug(invoiceFile?.name || "")}`,
            name: `bill-${cleanName(invoiceFile?.name || "")}`,
            documentType: "powerhouse/billing-statement",
          },
        },
        state: {
          auth: {},
          document: {
            version: "1.0.0",
          },
          ...({
            global: {
              contributor: id,
              dateIssued: invoiceState.global.dateIssued,
              dateDue: invoiceState.global.dateDue,
              lineItems: invoiceState.global.lineItems.map(
                (item: InvoiceLineItem) => {
                  return {
                    id: item.id,
                    description: item.description,
                    quantity: item.quantity,
                    unit: "UNIT",
                    unitPricePwt: 0,
                    unitPriceCash: item.unitPriceTaxIncl,
                    totalPricePwt: 0,
                    totalPriceCash: item.totalPriceTaxIncl,
                    lineItemTag: mapTags(item.lineItemTag || []),
                  };
                }
              ),
              status: invoiceState.global.status,
              currency: invoiceState.global.currency,
              totalCash: invoiceState.global.lineItems.reduce(
                (acc: number, item: InvoiceLineItem) =>
                  acc + item.totalPriceTaxIncl,
                0
              ),
              totalPowt: 0,
              notes: invoiceState.global.notes,
            },
            local: {},
          } as any),
        },
        operations: {
          global: [],
          local: [],
        },
        history: {
          global: [],
          local: [],
        },
        initialState: {
          ...({
            state: {
              global: {
                contributor: id,
                dateIssued: invoiceState.global.dateIssued,
                dateDue: invoiceState.global.dateDue,
                lineItems: invoiceState.global.lineItems.map(
                  (item: InvoiceLineItem) => {
                    return {
                      id: item.id,
                      description: item.description,
                      quantity: item.quantity,
                      unit: "UNIT",
                      unitPricePwt: 0,
                      unitPriceCash: item.unitPriceTaxIncl,
                      totalPricePwt: 0,
                      totalPriceCash: item.totalPriceTaxIncl,
                      lineItemTag: mapTags(item.lineItemTag || []),
                    };
                  }
                ),
                status: invoiceState.global.status,
                currency: invoiceState.global.currency,
                totalCash: invoiceState.global.lineItems.reduce(
                  (acc: number, item: InvoiceLineItem) =>
                    acc + item.totalPriceTaxIncl,
                  0
                ),
                totalPowt: 0,
                notes: invoiceState.global.notes,
              },
              local: {},
            },
          } as any),
        },
        clipboard: [],
      },
      undefined,
      "powerhouse-billing-statement-editor"
    );
  };

  const selectedInvoiceIds = Object.keys(selected).filter((id) => selected[id]);
  const selectedInvoices = selectedInvoiceIds.map((id) => ({
    ...state[id],
    id,
  }));
  const selectedInvoiceStatuses = selectedInvoices.map(
    (inv) => inv?.global?.status || inv?.status
  );

  const handleCSVExport = async (baseCurrency: string) => {
    console.log(
      "Exporting selected invoices:",
      selectedInvoiceIds.map((id, idx) => ({
        id,
        state: selectedInvoices[idx],
      }))
    );
    try {
      await exportInvoicesToXeroCSV(selectedInvoices, baseCurrency);
      toast("Invoices exported successfully", {
        type: "success",
      });
    } catch (error: any) {
      console.error("Error exporting invoices:", error);
      const missingExpenseTagInvoices = error.missingExpenseTagInvoices || [];
      const missingExpenseTagInvoicesList = missingExpenseTagInvoices.map(
        (invoiceId: string) => {
          const invoice = files.find((file) => file.id === invoiceId);
          return invoice?.name || invoiceId;
        }
      );
      console.log(
        "missingExpenseTagInvoicesList",
        missingExpenseTagInvoicesList
      );
      toast(
        <>
          Invoice Line Item Tags need to be set for:
          <br />
          {missingExpenseTagInvoicesList.map((name: any, idx: any) => (
            <React.Fragment key={name}>
              - {name}
              <br />
            </React.Fragment>
          ))}
        </>,
        { type: "error" }
      );
    }
  };

  // check if integrations document exists
  const integrationsDoc = files.find(
    (file) => file.documentType === "powerhouse/integrations"
  );
  const createIntegrationsDocument = () => {
    const integrationsDocument = filteredDocumentModels?.find(
      (model) => model.documentModel.id === "powerhouse/integrations"
    );
    if (integrationsDocument) {
      onSelectDocumentModel(integrationsDocument);
    }
  };

  return (
    <div
      className="w-full h-full bg-white rounded-lg p-4 border border-gray-200 shadow-md mt-4 overflow-x-auto"
      key={`${Object.keys(state).length}`}
    >
      <HeaderControls
        statusOptions={statusOptions}
        onStatusChange={handleStatusChange}
        onBatchAction={onBatchAction}
        onExport={handleCSVExport}
        selectedStatuses={selectedInvoiceStatuses}
        createIntegrationsDocument={createIntegrationsDocument}
        integrationsDoc={integrationsDoc}
        setActiveDocumentId={setActiveDocumentId}
      />
      {shouldShowSection("DRAFT") && (
        <InvoiceTableSection
          title="Draft"
          count={draft.length}
          onSelectDocumentModel={onSelectDocumentModel}
          filteredDocumentModels={filteredDocumentModels}
        >
          <table className="w-full text-sm border-separate border-spacing-0 border border-gray-400">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 w-8"></th>
                <th className="px-2 py-2 text-center">Invoice</th>
                <th className="px-2 py-2 text-center">Invoice No.</th>
                <th className="px-2 py-2 text-center">Issue Date</th>
                <th className="px-2 py-2 text-center">Due Date</th>
                <th className="px-2 py-2 text-center">Currency</th>
                <th className="px-2 py-2 text-center">Amount</th>
                <th className="px-2 py-2">Exported</th>
              </tr>
            </thead>
            <tbody>
              {draft.map((row) => (
                <InvoiceTableRow
                  files={files}
                  key={row.id}
                  row={row}
                  isSelected={!!selected[row.id]}
                  onSelect={(checked) =>
                    setSelected((prev: { [id: string]: boolean }) => ({
                      ...prev,
                      [row.id]: checked,
                    }))
                  }
                  setActiveDocumentId={setActiveDocumentId}
                  onDeleteNode={handleDelete}
                  renameNode={renameNode}
                />
              ))}
            </tbody>
          </table>
        </InvoiceTableSection>
      )}
      {shouldShowSection("ISSUED") && (
        <InvoiceTableSection title="Issued" count={issued.length}>
          <table className="w-full text-sm border-separate border-spacing-0 border border-gray-400">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 w-8"></th>
                <th className="px-2 py-2 text-center">Issuer</th>
                <th className="px-2 py-2 text-center">Invoice No.</th>
                <th className="px-2 py-2 text-center">Issue Date</th>
                <th className="px-2 py-2 text-center">Due Date</th>
                <th className="px-2 py-2 text-center">Currency</th>
                <th className="px-2 py-2 text-center">Amount</th>
                <th className="px-2 py-2 text-center">Billing Statement</th>
                <th className="px-2 py-2">Exported</th>
              </tr>
            </thead>
            <tbody>
              {issued.map((row) => (
                <InvoiceTableRow
                  files={files}
                  key={row.id}
                  row={row}
                  isSelected={!!selected[row.id]}
                  onSelect={(checked) =>
                    setSelected((prev: { [id: string]: boolean }) => ({
                      ...prev,
                      [row.id]: checked,
                    }))
                  }
                  setActiveDocumentId={setActiveDocumentId}
                  onDeleteNode={handleDelete}
                  renameNode={renameNode}
                  onCreateBillingStatement={handleCreateBillingStatement}
                  billingDocStates={billingDocStates}
                />
              ))}
            </tbody>
          </table>
        </InvoiceTableSection>
      )}
      {shouldShowSection("ACCEPTED") && (
        <InvoiceTableSection
          title="Accepted"
          count={accepted.length}
          color="bg-green-100 text-green-600"
        >
          <table className="w-full text-sm border-separate border-spacing-0 border border-gray-400">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 w-8"></th>
                <th className="px-2 py-2 text-center">Issuer</th>
                <th className="px-2 py-2 text-center">Invoice No.</th>
                <th className="px-2 py-2 text-center">Issue Date</th>
                <th className="px-2 py-2 text-center">Due Date</th>
                <th className="px-2 py-2 text-center">Currency</th>
                <th className="px-2 py-2 text-center">Amount</th>
                <th className="px-2 py-2 text-center">Billing Statement</th>
                <th className="px-2 py-2">Exported</th>
              </tr>
            </thead>
            <tbody>
              {accepted.map((row) => (
                <InvoiceTableRow
                  files={files}
                  key={row.id}
                  row={row}
                  isSelected={!!selected[row.id]}
                  onSelect={(checked) =>
                    setSelected((prev: { [id: string]: boolean }) => ({
                      ...prev,
                      [row.id]: checked,
                    }))
                  }
                  setActiveDocumentId={setActiveDocumentId}
                  onDeleteNode={handleDelete}
                  renameNode={renameNode}
                  onCreateBillingStatement={handleCreateBillingStatement}
                  billingDocStates={billingDocStates}
                />
              ))}
            </tbody>
          </table>
        </InvoiceTableSection>
      )}
      {shouldShowSection("PAYMENTSCHEDULED") && (
        <InvoiceTableSection
          title="Payment Scheduled"
          count={paymentScheduled.length}
          color="bg-green-100 text-green-600"
        >
          <table className="w-full text-sm border-separate border-spacing-0 border border-gray-400">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 w-8"></th>
                <th className="px-2 py-2 text-center">Issuer</th>
                <th className="px-2 py-2 text-center">Invoice No.</th>
                <th className="px-2 py-2 text-center">Issue Date</th>
                <th className="px-2 py-2 text-center">Due Date</th>
                <th className="px-2 py-2 text-center">Currency</th>
                <th className="px-2 py-2 text-center">Amount</th>
                <th className="px-2 py-2 text-center">Billing Statement</th>
                <th className="px-2 py-2">Exported</th>
              </tr>
            </thead>
            <tbody>
              {paymentScheduled.map((row) => (
                <InvoiceTableRow
                  files={files}
                  key={row.id}
                  row={row}
                  isSelected={!!selected[row.id]}
                  onSelect={(checked) =>
                    setSelected((prev: { [id: string]: boolean }) => ({
                      ...prev,
                      [row.id]: checked,
                    }))
                  }
                  setActiveDocumentId={setActiveDocumentId}
                  onDeleteNode={handleDelete}
                  renameNode={renameNode}
                  onCreateBillingStatement={handleCreateBillingStatement}
                  billingDocStates={billingDocStates}
                />
              ))}
            </tbody>
          </table>
        </InvoiceTableSection>
      )}
      {shouldShowSection("PAYMENTSENT") && (
        <InvoiceTableSection
          title="Payment Sent"
          count={paymentSent.length}
          color="bg-green-100 text-green-600"
        >
          <table className="w-full text-sm border-separate border-spacing-0 border border-gray-400">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 w-8"></th>
                <th className="px-2 py-2 text-center">Issuer</th>
                <th className="px-2 py-2 text-center">Invoice No.</th>
                <th className="px-2 py-2 text-center">Issue Date</th>
                <th className="px-2 py-2 text-center">Due Date</th>
                <th className="px-2 py-2 text-center">Currency</th>
                <th className="px-2 py-2 text-center">Amount</th>
                <th className="px-2 py-2 text-center">Billing Statement</th>
                <th className="px-2 py-2">Exported</th>
              </tr>
            </thead>
            <tbody>
              {paymentSent.map((row) => (
                <InvoiceTableRow
                  files={files}
                  key={row.id}
                  row={row}
                  isSelected={!!selected[row.id]}
                  onSelect={(checked) =>
                    setSelected((prev: { [id: string]: boolean }) => ({
                      ...prev,
                      [row.id]: checked,
                    }))
                  }
                  setActiveDocumentId={setActiveDocumentId}
                  onDeleteNode={handleDelete}
                  renameNode={renameNode}
                  onCreateBillingStatement={handleCreateBillingStatement}
                  billingDocStates={billingDocStates}
                />
              ))}
            </tbody>
          </table>
        </InvoiceTableSection>
      )}
      {shouldShowSection("PAYMENTISSUE") && (
        <InvoiceTableSection
          title="Payment Issue"
          count={paymentIssue.length}
          color="bg-yellow-100 text-yellow-600"
        >
          <table className="w-full text-sm border-separate border-spacing-0 border border-gray-400">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 w-8"></th>
                <th className="px-2 py-2 text-center">Issuer</th>
                <th className="px-2 py-2 text-center">Invoice No.</th>
                <th className="px-2 py-2 text-center">Issue Date</th>
                <th className="px-2 py-2 text-center">Due Date</th>
                <th className="px-2 py-2 text-center">Currency</th>
                <th className="px-2 py-2 text-center">Amount</th>
                <th className="px-2 py-2 text-center">Billing Statement</th>
                <th className="px-2 py-2">Exported</th>
              </tr>
            </thead>
            <tbody>
              {paymentIssue.map((row) => (
                <InvoiceTableRow
                  files={files}
                  key={row.id}
                  row={row}
                  isSelected={!!selected[row.id]}
                  onSelect={(checked) =>
                    setSelected((prev: { [id: string]: boolean }) => ({
                      ...prev,
                      [row.id]: checked,
                    }))
                  }
                  setActiveDocumentId={setActiveDocumentId}
                  onDeleteNode={handleDelete}
                  renameNode={renameNode}
                  onCreateBillingStatement={handleCreateBillingStatement}
                  billingDocStates={billingDocStates}
                />
              ))}
            </tbody>
          </table>
        </InvoiceTableSection>
      )}
      {shouldShowSection("PAYMENTCLOSED") && (
        <InvoiceTableSection
          title="Payment Closed"
          count={paymentClosed.length}
          color="bg-red-500 text-black-600"
        >
          <table className="w-full text-sm border-separate border-spacing-0 border border-gray-400">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 w-8"></th>
                <th className="px-2 py-2 text-center">Issuer</th>
                <th className="px-2 py-2 text-center">Invoice No.</th>
                <th className="px-2 py-2 text-center">Issue Date</th>
                <th className="px-2 py-2 text-center">Due Date</th>
                <th className="px-2 py-2 text-center">Currency</th>
                <th className="px-2 py-2 text-center">Amount</th>
                <th className="px-2 py-2">Exported</th>
              </tr>
            </thead>
            <tbody>
              {paymentClosed.map((row) => (
                <InvoiceTableRow
                  files={files}
                  key={row.id}
                  row={row}
                  isSelected={!!selected[row.id]}
                  onSelect={(checked) =>
                    setSelected((prev: { [id: string]: boolean }) => ({
                      ...prev,
                      [row.id]: checked,
                    }))
                  }
                  setActiveDocumentId={setActiveDocumentId}
                  onDeleteNode={handleDelete}
                  renameNode={renameNode}
                />
              ))}
            </tbody>
          </table>
        </InvoiceTableSection>
      )}
      {shouldShowSection("REJECTED") && (
        <InvoiceTableSection
          title="Rejected"
          count={rejected.length}
          color="bg-red-500 text-black-600"
        >
          <table className="w-full text-sm border-separate border-spacing-0 border border-gray-400">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 w-8"></th>
                <th className="px-2 py-2 text-center">Issuer</th>
                <th className="px-2 py-2 text-center">Invoice No.</th>
                <th className="px-2 py-2 text-center">Issue Date</th>
                <th className="px-2 py-2 text-center">Due Date</th>
                <th className="px-2 py-2 text-center">Currency</th>
                <th className="px-2 py-2 text-center">Amount</th>
                <th className="px-2 py-2">Exported</th>
              </tr>
            </thead>
            <tbody>
              {rejected.map((row) => (
                <InvoiceTableRow
                  files={files}
                  key={row.id}
                  row={row}
                  isSelected={!!selected[row.id]}
                  onSelect={(checked) =>
                    setSelected((prev: { [id: string]: boolean }) => ({
                      ...prev,
                      [row.id]: checked,
                    }))
                  }
                  setActiveDocumentId={setActiveDocumentId}
                  onDeleteNode={handleDelete}
                  renameNode={renameNode}
                />
              ))}
            </tbody>
          </table>
        </InvoiceTableSection>
      )}
      {shouldShowSection("OTHER") && (
        <InvoiceTableSection title="Other" count={otherInvoices.length}>
          <table className="w-full text-sm border-separate border-spacing-0 border border-gray-400">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 w-8"></th>
                <th className="px-2 py-2 text-center">Issuer</th>
                <th className="px-2 py-2 text-center">Invoice No.</th>
                <th className="px-2 py-2 text-center">Issue Date</th>
                <th className="px-2 py-2 text-center">Due Date</th>
                <th className="px-2 py-2 text-center">Currency</th>
                <th className="px-2 py-2 text-center">Amount</th>
                <th className="px-2 py-2 text-center">Exported</th>
              </tr>
            </thead>
            <tbody>
              {otherInvoices.map((row) => (
                <InvoiceTableRow
                  files={files}
                  key={row.id}
                  row={row}
                  isSelected={!!selected[row.id]}
                  onSelect={(checked) =>
                    setSelected((prev: { [id: string]: boolean }) => ({
                      ...prev,
                      [row.id]: checked,
                    }))
                  }
                  setActiveDocumentId={setActiveDocumentId}
                  onDeleteNode={handleDelete}
                  renameNode={renameNode}
                />
              ))}
            </tbody>
          </table>
        </InvoiceTableSection>
      )}
    </div>
  );
};
