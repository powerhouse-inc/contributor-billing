import { useState, useMemo, useEffect } from "react";
import { HeaderControls } from "./HeaderControls.js";
import { InvoiceTableSection } from "./InvoiceTableSection.js";
import { InvoiceTableRow } from "./InvoiceTableRow.js";
import { type UiFileNode } from "@powerhousedao/design-system";
import {
  type DriveEditorContext,
  useDriveContext,
} from "@powerhousedao/reactor-browser";
import { type InvoiceState, type InvoiceLineItem } from "document-models/invoice/index.js";
import { EditorDispatch, PHDocument } from "document-model";
import { DocumentModelModule } from "document-model";
import { DocumentDriveAction } from "document-drive";
import { mapTags } from "../../../billing-statement/lineItemTags/tagMapping.js";
import { exportInvoicesToXeroCSV } from "../../../../scripts/contributor-billing/createXeroCsv.js"

type Invoice = {
  id: string;
  issuer: string;
  invoiceNo: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  amount: string;
};

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Awaiting Approval", value: "AWAITINGAPPROVAL" },
  { label: "Awaiting Payment", value: "AWAITINGPAYMENT" },
  { label: "Payment Received", value: "PAYMENTRECEIVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Other", value: "OTHER" },
];

interface InvoiceTableProps {
  files: UiFileNode[];
  state: Record<string, any>;
  setActiveDocumentId: (id: string) => void;
  getDispatch: () => (action: any, onErrorCallback?: any) => void;
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
  dispatchMap: Record<string, EditorDispatch<DocumentDriveAction>>;
}

export const InvoiceTable = ({
  files,
  state,
  setActiveDocumentId,
  getDispatch,
  selected,
  setSelected,
  onBatchAction,
  onDeleteNode,
  renameNode,
  filteredDocumentModels,
  onSelectDocumentModel,
  dispatchMap,
}: InvoiceTableProps) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const {
    addDocument,
    addFile,
    documentModels,
    useDriveDocumentStates,
    selectedNode,
  } = useDriveContext();

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
          doc.global.status !== "AWAITINGAPPROVAL" &&
          doc.global.status !== "PAYMENTSCHEDULED" &&
          doc.global.status !== "PAYMENTRECEIVED" &&
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
  const awaitingApproval = getInvoicesByStatus("ISSUED");
  const awaitingPayment = getInvoicesByStatus("PAYMENTSCHEDULED");
  const paid = getInvoicesByStatus("PAYMENTRECEIVED");
  const rejected = getInvoicesByStatus("REJECTED");
  const otherInvoices = getOtherInvoices();

  const handleDelete = (id: string) => {
    onDeleteNode(id);
    // Clear selection for deleted item
  };

  const handleCreateBillingStatement = async (id: string) => {
    const driveId = selectedNode?.id;
    if (!driveId) return;
    const invoiceFile = files.find((file) => file.id === id);
    const invoiceState = state[id];

    const billingDoc = await addDocument(
      driveId,
      `bill-${invoiceFile?.name}`,
      "powerhouse/billing-statement",
      undefined,
      {
        name: `bill-${invoiceFile?.name}`,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        documentType: "powerhouse/billing-statement",
        state: {
          global: {
            contributor: id,
            dateIssued: invoiceState.global.dateIssued,
            dateDue: invoiceState.global.dateDue,
            lineItems: invoiceState.global.lineItems.map((item: InvoiceLineItem) => {
              return {
                id: item.id,
                description: item.description,
                quantity: item.quantity,
                unit: 'UNIT',
                unitPricePwt: 0,
                unitPriceCash: item.unitPriceTaxIncl,
                totalPricePwt: 0,
                totalPriceCash: item.totalPriceTaxIncl,
                lineItemTag: mapTags(item.lineItemTag || []),
              }
            }),
            status: invoiceState.global.status,
            currency: invoiceState.global.currency,
            totalCash: invoiceState.global.lineItems.reduce((acc: number, item: InvoiceLineItem) => acc + item.totalPriceTaxIncl, 0),
            totalPowt: 0,
            notes: invoiceState.global.notes,
          },
          local: {},
        },
        revision: {
          global: 0,
          local: 0,
        },
        operations: {
          global: [],
          local: [],
        },
        initialState: {
          name: `bill-${invoiceFile?.name}`,
          documentType: "powerhouse/billing-statement",
          created: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          revision: {
            global: 0,
            local: 0,
          },
          state: {
            global: {},
            local: {},
          },
        },
        clipboard: [],
      }
    );

  };

  const handleCSVExport = () => {
    
    const selectedInvoiceIds = Object.keys(selected).filter(id => selected[id]);
    const selectedInvoices = selectedInvoiceIds.map(id => state[id]);
    
    console.log('exporting...', selectedInvoices);
    exportInvoicesToXeroCSV(selectedInvoices)

  }

  

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
                  menuOptions={getMenuOptions()}
                  onMenuAction={(action) => {}}
                  setActiveDocumentId={setActiveDocumentId}
                  onDeleteNode={handleDelete}
                  renameNode={renameNode}
                />
              ))}
            </tbody>
          </table>
        </InvoiceTableSection>
      )}
      {shouldShowSection("AWAITINGAPPROVAL") && (
        <InvoiceTableSection
          title="Awaiting Approval"
          count={awaitingApproval.length}
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
              {awaitingApproval.map((row) => (
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
                  menuOptions={getMenuOptions()}
                  onMenuAction={(action) => {}}
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
      {shouldShowSection("AWAITINGPAYMENT") && (
        <InvoiceTableSection
          title="Awaiting Payment"
          count={awaitingPayment.length}
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
              {awaitingPayment.map((row) => (
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
                  menuOptions={getMenuOptions()}
                  onMenuAction={(action) => {}}
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
      {shouldShowSection("PAYMENTRECEIVED") && (
        <InvoiceTableSection
          title="Payment Received"
          count={paid.length}
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
                <th className="px-2 py-2 text-center">Exported</th>
              </tr>
            </thead>
            <tbody>
              {paid.map((row) => (
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
                  menuOptions={getMenuOptions()}
                  onMenuAction={(action) => {}}
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
                <th className="px-2 py-2 text-centert">Invoice No.</th>
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
                  menuOptions={getMenuOptions()}
                  onMenuAction={(action) => {}}
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
                  menuOptions={getMenuOptions()}
                  onMenuAction={(action) => {}}
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
