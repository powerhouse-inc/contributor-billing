import React from "react";
import { HeaderControls } from "./HeaderControls.js";
import { InvoiceTableSection } from "./InvoiceTableSection.js";
import { InvoiceTableRow } from "./InvoiceTableRow.js";
import { type DocumentModelModule } from "document-model";
import { mapTags } from "../../../billing-statement/lineItemTags/tagMapping.js";
import { exportInvoicesToXeroCSV } from "../../../../scripts/contributor-billing/createXeroCsv.js";
import { exportExpenseReportCSV } from "../../../../scripts/contributor-billing/createExpenseReportCsv.js";
import { toast } from "@powerhousedao/design-system";
import {
  actions,
  type InvoiceAction,
} from "../../../../document-models/invoice/index.js";
import {
  addDocument,
  useSelectedDrive,
  dispatchActions,
  setSelectedNode,
} from "@powerhousedao/reactor-browser";
import { actions as billingStatementActions } from "../../../../document-models/billing-statement/index.js";

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

type FileNodeLite = { id: string; name: string; documentType?: string };

interface InvoiceTableProps {
  files: FileNodeLite[];
  state: any[];
  selected: { [id: string]: boolean };
  setSelected: (
    selected:
      | { [id: string]: boolean }
      | ((prev: { [id: string]: boolean }) => { [id: string]: boolean })
  ) => void;
  filteredDocumentModels: DocumentModelModule[];
  onSelectDocumentModel: (model: DocumentModelModule) => void;
  getDocDispatcher: (id: string) => any;
  selectedStatuses: string[];
  onStatusChange: (value: string | string[]) => void;
  onRowSelection: (rowId: string, checked: boolean, rowStatus: string) => void;
  canExportSelectedRows: () => boolean;
}

export const InvoiceTable = ({
  files,
  state,
  selected,
  filteredDocumentModels,
  onSelectDocumentModel,
  getDocDispatcher,
  selectedStatuses,
  onStatusChange,
  onRowSelection,
  canExportSelectedRows,
}: InvoiceTableProps) => {
  const [selectedDrive] = useSelectedDrive();

  const billingDocStates = state
    .filter((doc) => doc.header.documentType === "powerhouse/billing-statement")
    .map((doc) => ({
      id: doc.header.id,
      contributor: doc.state.global.contributor,
    }));

  const shouldShowSection = (status: string) => {
    return selectedStatuses.length === 0 || selectedStatuses.includes(status);
  };

  const getInvoicesByStatus = (status: string) => {
    return state
      .filter(
        (doc) =>
          doc.header.documentType === "powerhouse/invoice" &&
          doc.state.global.status === status
      )
      .map((doc) => ({
        id: doc.header.id,
        issuer: doc.state.global.issuer?.name || "Unknown",
        status: doc.state.global.status,
        invoiceNo: doc.state.global.invoiceNo,
        issueDate: doc.state.global.dateIssued,
        dueDate: doc.state.global.dateDue,
        currency: doc.state.global.currency,
        amount: doc.state.global.totalPriceTaxIncl?.toString() ?? "",
        exported: doc.state.global.exported,
      }));
  };

  const getOtherInvoices = () => {
    return state
      .filter(
        (doc) =>
          doc.header.documentType === "powerhouse/invoice" &&
          doc.state.global.status !== "DRAFT" &&
          doc.state.global.status !== "ISSUED" &&
          doc.state.global.status !== "ACCEPTED" &&
          doc.state.global.status !== "PAYMENTSCHEDULED" &&
          doc.state.global.status !== "PAYMENTSENT" &&
          doc.state.global.status !== "PAYMENTISSUE" &&
          doc.state.global.status !== "PAYMENTCLOSED" &&
          doc.state.global.status !== "REJECTED"
      )
      .map((doc) => ({
        id: doc.header.id,
        issuer: doc.state.global.issuer?.name || "Unknown",
        status: doc.state.global.status,
        invoiceNo: doc.state.global.invoiceNo,
        issueDate: doc.state.global.dateIssued,
        dueDate: doc.state.global.dateDue,
        currency: doc.state.global.currency,
        amount: doc.state.global.totalPriceTaxIncl?.toString() ?? "",
        documentType: doc.header.documentType,
        exported: doc.state.global.exported,
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

  const handleCreateBillingStatement = async (id: string) => {
    const invoiceFile = files.find((file) => file.id === id);
    const invoiceState = state.find((doc) => doc.header.id === id);
    if (!invoiceState) {
      return;
    }

    const createdNode = await addDocument(
      selectedDrive?.header.id || "",
      `bill-${invoiceFile?.name}`,
      "powerhouse/billing-statement",
      undefined,
      undefined,
      undefined,
      "powerhouse-billing-statement-editor"
    );
    console.log("created billing statement doc", createdNode);
    if (!createdNode?.id) {
      console.error("Failed to create billing statement");
      return null;
    }
    await dispatchActions(
      billingStatementActions.editContributor({
        contributor: id,
      }),
      createdNode.id
    );
    // Prepare billing statement data with empty input handlers
    const billingStatementData: any = {
      dateIssued:
        invoiceState.state.global.dateIssued &&
        invoiceState.state.global.dateIssued.trim() !== ""
          ? new Date(invoiceState.state.global.dateIssued).toISOString()
          : null,
      dateDue:
        invoiceState.state.global.dateDue &&
        invoiceState.state.global.dateDue.trim() !== ""
          ? new Date(invoiceState.state.global.dateDue).toISOString()
          : null,
      currency: invoiceState.state.global.currency || "",
      notes: invoiceState.state.global.notes || "",
    };

    await dispatchActions(
      billingStatementActions.editBillingStatement(billingStatementData),
      createdNode.id
    );

    // add line items from invoiceState to billing statement
    invoiceState.state.global.lineItems.forEach(async (lineItem: any) => {
      await dispatchActions(
        billingStatementActions.addLineItem({
          id: lineItem.id,
          description: lineItem.description,
          quantity: lineItem.quantity,
          // Map invoice fields to billing statement fields
          totalPriceCash: lineItem.totalPriceTaxIncl || 0,
          totalPricePwt: 0, // Default to 0 since invoice doesn't have POWT pricing
          unit: "UNIT", // Default to UNIT since invoice doesn't have unit field
          unitPriceCash: lineItem.unitPriceTaxIncl || 0,
          unitPricePwt: 0, // Default to 0 since invoice doesn't have POWT pricing
        }),
        createdNode.id
      );
    });

    // add tags from each invoice line item to billing statement line item
    invoiceState.state.global.lineItems.forEach(async (lineItem: any) => {
      const lineItemTag: any = mapTags(lineItem.lineItemTag || []);
      lineItemTag.forEach(async (tag: any) => {
        await dispatchActions(
          billingStatementActions.editLineItemTag({
            lineItemId: lineItem.id,
            dimension: tag.dimension,
            value: tag.value,
            label: tag.label,
          }),
          createdNode.id
        );
      });
    });
  };

  const selectedInvoiceIds = Object.keys(selected).filter((id) => selected[id]);
  const selectedInvoices = selectedInvoiceIds
    .map((id) => {
      const doc = state.find((doc) => doc.header.id === id);
      return doc ? { ...doc, id } : null;
    })
    .filter((inv) => inv !== null); // Filter out null/undefined invoices

  const handleCSVExport = async (baseCurrency: string) => {
    console.log(
      "Exporting selected invoices:",
      selectedInvoices.map((inv) => ({
        id: inv.id,
        state: inv,
      }))
    );
    try {
      const exportedData: Record<
        string,
        { timestamp: string; exportedLineItems: any }
      > = await exportInvoicesToXeroCSV(selectedInvoices, baseCurrency);
      toast("Invoices exported successfully", {
        type: "success",
      });
      selectedInvoices.forEach((invoice) => {
        const invoiceDoc = getDocDispatcher(invoice.id);
        const exportedInvoiceData = exportedData[invoice.id];
        if (!invoiceDoc || !exportedInvoiceData) {
          return;
        }
        const invoiceDispatcher = invoiceDoc[1];
        invoiceDispatcher(
          actions.setExportedData({
            timestamp: exportedInvoiceData.timestamp,
            exportedLineItems: exportedInvoiceData.exportedLineItems,
          })
        );
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

  const handleExportCSVExpenseReport = async (baseCurrency: string) => {
    console.log(
      "Exporting expense report for selected invoices:",
      selectedInvoices.map((inv) => ({
        id: inv.id,
        state: inv,
      }))
    );
    try {
      await exportExpenseReportCSV(selectedInvoices, baseCurrency);
      toast("Expense report exported successfully", {
        type: "success",
      });
    } catch (error: any) {
      console.error("Error exporting expense report:", error);
      const missingTagInvoices = error.missingTagInvoices || [];
      const missingTagInvoicesList = missingTagInvoices.map(
        (invoiceId: string) => {
          const invoice = files.find((file) => file.id === invoiceId);
          return invoice?.name || invoiceId;
        }
      );
      console.log("missingTagInvoicesList", missingTagInvoicesList);
      toast(
        <>
          Invoice Line Item Tags need to be set for:
          <br />
          {missingTagInvoicesList.map((name: any, idx: any) => (
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
  const createIntegrationsDocument = async () => {
    const integrationsDocument = filteredDocumentModels?.find(
      (model) => model.documentModel.id === "powerhouse/integrations"
    );
    if (integrationsDocument) {
      const createdNode = await addDocument(
        selectedDrive?.header.id || "",
        `integration-settings`,
        "powerhouse/integrations",
        undefined,
        undefined,
        undefined,
        "integrations-editor"
      );
      console.log("created integrations document", createdNode);
      if (!createdNode?.id) {
        console.error("Failed to create integrations document");
        return null;
      }
      setSelectedNode(createdNode.id);
    }
  };

  // check if expense report document exists
  const expenseReportDoc = files.find(
    (file) => file.documentType === "powerhouse/expense-report"
  );

  // check if at least one billing statement exists
  const hasBillingStatements = state.some(
    (doc) => doc.header.documentType === "powerhouse/billing-statement"
  );

  const handleCreateOrOpenExpenseReport = async () => {
    if (expenseReportDoc) {
      // Open existing expense report
      setSelectedNode(expenseReportDoc.id);
    } else {
      // Create new expense report
      const expenseReportModel = filteredDocumentModels?.find(
        (model) => model.documentModel.id === "powerhouse/expense-report"
      );
      if (expenseReportModel) {
        const createdNode = await addDocument(
          selectedDrive?.header.id || "",
          `expense-report`,
          "powerhouse/expense-report",
          undefined,
          undefined,
          undefined,
          "powerhouse-expense-report-editor"
        );
        console.log("created expense report document", createdNode);
        if (!createdNode?.id) {
          console.error("Failed to create expense report document");
          return null;
        }
        setSelectedNode(createdNode.id);
      }
    }
  };

  return (
    <div
      className="w-full h-full bg-white rounded-lg p-4 border border-gray-200 shadow-md mt-4 overflow-x-auto"
      key={`${state.length}`}
    >
      <HeaderControls
        statusOptions={statusOptions}
        onStatusChange={onStatusChange}
        onExport={handleCSVExport}
        onExpenseReportExport={handleExportCSVExpenseReport}
        selectedStatuses={selectedStatuses}
        createIntegrationsDocument={createIntegrationsDocument}
        integrationsDoc={integrationsDoc}
        canExportSelectedRows={canExportSelectedRows}
        hasBillingStatements={hasBillingStatements}
        expenseReportDoc={expenseReportDoc}
        onCreateOrOpenExpenseReport={handleCreateOrOpenExpenseReport}
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
                    onRowSelection(row.id, checked, row.status)
                  }
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
                    onRowSelection(row.id, checked, row.status)
                  }
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
                    onRowSelection(row.id, checked, row.status)
                  }
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
                    onRowSelection(row.id, checked, row.status)
                  }
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
                    onRowSelection(row.id, checked, row.status)
                  }
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
                    onRowSelection(row.id, checked, row.status)
                  }
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
                    onRowSelection(row.id, checked, row.status)
                  }
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
                    onRowSelection(row.id, checked, row.status)
                  }
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
                    onRowSelection(row.id, checked, row.status)
                  }
                />
              ))}
            </tbody>
          </table>
        </InvoiceTableSection>
      )}
    </div>
  );
};
