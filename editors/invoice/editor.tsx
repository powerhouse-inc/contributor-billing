import { useEffect, useMemo, useRef, useState } from "react";
import { generateId, type EditorProps } from "document-model";
import {
  type InvoiceDocument,
  type ClosureReason,
  Status,
  actions,
} from "../../document-models/invoice/index.js";
import { LegalEntityForm } from "./legalEntity/legalEntity.js";
import { LineItemsTable } from "./lineItems.js";
import { loadUBLFile } from "./ingestUBL.js";
import PDFUploader from "./ingestPDF.js";
import RequestFinance from "./requestFinance.js";
import InvoiceToGnosis from "./invoiceToGnosis.js";
import { toast, ToastContainer } from "@powerhousedao/design-system";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF.js";
import { createRoot } from "react-dom/client";
import { downloadUBL } from "./exportUBL.js";
import { CurrencyForm, currencyList } from "./components/currencyForm.js";
import { InputField } from "./components/inputField.js";
import { ValidationResult } from "./validation/validationManager.js";
import { DatePicker } from "./components/datePicker.js";
import { SelectField } from "./components/selectField.js";
import { formatNumber } from "./lineItems.js";
import { Textarea } from "@powerhousedao/document-engineering/ui";
import ConfirmationModal from "./components/confirmationModal.js";
import {
  ClosePaymentModalContent,
  ConfirmPaymentModalContent,
  FinalRejectionModalContent,
  IssueInvoiceModalContent,
  RegisterPaymentTxModalContent,
  RejectInvoiceModalContent,
  ReportPaymentIssueModalContent,
  SchedulePaymentModalContent,
} from "./components/statusModalComponents.js";
import { InvoiceStateSchema } from "../../document-models/invoice/gen/schema/zod.js";
import validateStatusBeforeContinue from "./validation/validationHandler.js";
import { useSelectedInvoiceDocument } from "../hooks/useInvoiceDocument.js";

function isFiatCurrency(currency: string): boolean {
  return currencyList.find((c) => c.ticker === currency)?.crypto === false;
}

export default function Editor(
  props: Partial<EditorProps> & { documentId?: string }
) {
  const [doc, dispatch] = useSelectedInvoiceDocument() as [
    InvoiceDocument | undefined,
    any,
  ];
  const state = doc?.state.global;

  // Mobile header menu state
  const [mobileHeaderOpen, setMobileHeaderOpen] = useState(false);

  if (!state) {
    console.log("Document state not found from document id", props.documentId);
    return null;
  }

  // Dynamic property check based on the actual schema
  try {
    const schema = InvoiceStateSchema();
    const expectedProperties = Object.keys(schema.shape).filter(
      (prop) => prop !== "__typename"
    );
    const missingProperties = expectedProperties.filter(
      (prop) => !(prop in state)
    );
    if (missingProperties.length > 0) {
      // Show error message for missing properties
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg border border-red-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Document Schema Mismatch
            </h2>
            <p className="text-gray-600 mb-4">
              The current document structure doesn't match the expected schema.
              This usually happens when using an outdated document model.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Please create a new document using the latest document model to
              ensure compatibility.
            </p>
            <details className="text-left text-xs text-gray-600">
              <summary className="cursor-pointer hover:text-gray-800">
                View missing properties
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(missingProperties, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      );
    }
  } catch (error) {
    console.error("Error checking schema properties:", error);
  }

  const [fiatMode, setFiatMode] = useState(isFiatCurrency(state.currency));
  const [uploadDropdownOpen, setUploadDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [invoiceNoInput, setInvoiceNoInput] = useState(state.invoiceNo || "");
  const uploadDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [notes, setNotes] = useState(state.notes || "");

  // Validation state
  const [invoiceValidation, setInvoiceValidation] =
    useState<ValidationResult | null>(null);
  const [walletValidation, setWalletValidation] =
    useState<ValidationResult | null>(null);
  const [currencyValidation, setCurrencyValidation] =
    useState<ValidationResult | null>(null);
  const [ibanValidation, setIbanValidation] = useState<ValidationResult | null>(
    null
  );
  const [bicValidation, setBicValidation] = useState<ValidationResult | null>(
    null
  );
  const [bankNameValidation, setBankNameValidation] =
    useState<ValidationResult | null>(null);
  const [streetAddressValidation, setStreetAddressValidation] =
    useState<ValidationResult | null>(null);
  const [cityValidation, setCityValidation] = useState<ValidationResult | null>(
    null
  );
  const [postalCodeValidation, setPostalCodeValidation] =
    useState<ValidationResult | null>(null);
  const [payerEmailValidation, setPayerEmailValidation] =
    useState<ValidationResult | null>(null);
  const [lineItemValidation, setLineItemValidation] =
    useState<ValidationResult | null>(null);
  const [mainCountryValidation, setMainCountryValidation] =
    useState<ValidationResult | null>(null);
  const [bankCountryValidation, setBankCountryValidation] =
    useState<ValidationResult | null>(null);
  const [routingNumberValidation, setRoutingNumberValidation] =
    useState<ValidationResult | null>(null);

  // Replace showConfirmationModal and pendingStatus with a single modal state
  const [activeModal, setActiveModal] = useState<
    | null
    | "issueInvoice"
    | "cancelInvoice"
    | "rejectInvoice"
    | "schedulePayment"
    | "registerPayment"
    | "reportPaymentIssue"
    | "confirmPayment"
    | "closePayment"
    | "finalRejection"
  >(null);

  // Track warning state for modal
  const [modalWarning, setModalWarning] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [finalReason, setFinalReason] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [closureReason, setClosureReason] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [txnRef, setTxnRef] = useState("");
  const [paymentIssue, setPaymentIssue] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const [editingItemValues, setEditingItemValues] = useState<{
    id: string;
    quantity: number;
    unitPriceTaxExcl: number;
    unitPriceTaxIncl: number;
  } | null>(null);

  const prevStatus = useRef(state.status);

  useEffect(() => {
    setFiatMode(isFiatCurrency(state.currency));
  }, [state.currency, state]);

  // Add click outside listener to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        uploadDropdownRef.current &&
        !uploadDropdownRef.current.contains(event.target as Node)
      ) {
        setUploadDropdownOpen(false);
      }
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(event.target as Node)
      ) {
        setExportDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const itemsTotalTaxExcl = useMemo(() => {
    let total = state.lineItems.reduce((sum: number, lineItem: any) => {
      return sum + lineItem.quantity * lineItem.unitPriceTaxExcl;
    }, 0.0);

    // If there's an item being edited, replace its contribution with the edited values
    if (editingItemValues) {
      const originalItem = state.lineItems.find(
        (item: any) => item.id === editingItemValues.id
      );
      if (originalItem) {
        // Subtract the original contribution and add the edited contribution
        total =
          total -
          originalItem.quantity * originalItem.unitPriceTaxExcl +
          editingItemValues.quantity * editingItemValues.unitPriceTaxExcl;
      }
    }

    return total;
  }, [state.lineItems, editingItemValues]);

  const itemsTotalTaxIncl = useMemo(() => {
    let total = state.lineItems.reduce((sum: number, lineItem: any) => {
      return sum + lineItem.quantity * lineItem.unitPriceTaxIncl;
    }, 0.0);

    // If there's an item being edited, replace its contribution with the edited values
    if (editingItemValues) {
      const originalItem = state.lineItems.find(
        (item: any) => item.id === editingItemValues.id
      );
      if (originalItem) {
        // Subtract the original contribution and add the edited contribution
        total =
          total -
          originalItem.quantity * originalItem.unitPriceTaxIncl +
          editingItemValues.quantity * editingItemValues.unitPriceTaxIncl;
      }
    }

    return total;
  }, [state.lineItems, editingItemValues]);

  const STATUS_OPTIONS: Status[] = [
    "DRAFT",
    "ISSUED",
    "CANCELLED",
    "ACCEPTED",
    "REJECTED",
    "PAYMENTSCHEDULED",
    "PAYMENTSENT",
    "PAYMENTISSUE",
    "PAYMENTRECEIVED",
    "PAYMENTCLOSED",
  ];

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await loadUBLFile({ file, dispatch });
      toast("UBL file uploaded successfully", {
        type: "success",
      });
    } catch (error) {
      // Handle error presentation to user
      console.error("Failed to load UBL file:", error);
      toast("Failed to load UBL file", {
        type: "error",
      });
    }
  };

  const handleExportPDF = () => {
    // Create a temporary container for the PDFDownloadLink
    const container = window.document.createElement("div");
    container.style.display = "none";
    window.document.body.appendChild(container);

    // Create root for React 18
    const root = createRoot(container);

    // Render the PDFDownloadLink
    const cleanup = () => {
      root.unmount();
      window.document.body.removeChild(container);
    };

    try {
      root.render(
        <PDFDownloadLink
          document={<InvoicePDF invoice={state} fiatMode={fiatMode} />}
          fileName={`invoice-${state.invoiceNo || "export"}.pdf`}
          className="hidden"
        >
          {({ blob, url, loading, error }) => {
            if (loading) {
              return null;
            }

            if (error) {
              cleanup();
              toast("Failed to export PDF", { type: "error" });
              console.error("PDF generation error:", error);
              return null;
            }

            if (url && blob) {
              // Create a direct download link
              const downloadLink = window.document.createElement("a");
              downloadLink.href = url;
              downloadLink.download = `invoice-${state.invoiceNo || "export"}.pdf`;
              window.document.body.appendChild(downloadLink);
              downloadLink.click();
              window.document.body.removeChild(downloadLink);

              // Cleanup after ensuring download has started
              setTimeout(cleanup, 100);
            }
            return null;
          }}
        </PDFDownloadLink>
      );
    } catch (error) {
      console.error("Error exporting PDF:", error);
      cleanup();
      toast("Failed to export PDF", { type: "error" });
    }
  };

  async function handleExportUBL() {
    try {
      // Generate a PDF blob first
      const pdfBlob = await generatePDFBlob();

      // Generate filename based on invoice number
      const filename = `invoice_${state!.invoiceNo || "export"}.xml`;

      return await downloadUBL({
        invoice: state!,
        filename,
        pdfBlob, // Pass the PDF blob to be embedded in the UBL file
      });
    } catch (error) {
      console.error("Error exporting to UBL:", error);
      toast("Failed to export UBL", { type: "error" });
      throw error;
    }
  }

  // New function to generate a PDF blob using the existing PDF generation logic
  async function generatePDFBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // Create a temporary container for the PDFDownloadLink
      const container = window.document.createElement("div");
      container.style.display = "none";
      window.document.body.appendChild(container);

      // Create root for React 18
      const root = createRoot(container);

      // Cleanup function
      const cleanup = () => {
        root.unmount();
        window.document.body.removeChild(container);
      };

      try {
        root.render(
          <PDFDownloadLink
            document={<InvoicePDF invoice={state!} fiatMode={fiatMode} />}
            fileName={`invoice-${state!.invoiceNo || "export"}.pdf`}
            className="hidden"
          >
            {({ blob, url, loading, error }) => {
              if (loading) {
                return null;
              }

              if (error) {
                cleanup();
                reject(error);
                return null;
              }

              if (blob) {
                // We have the blob, resolve it
                resolve(blob);
                // Cleanup after getting the blob
                setTimeout(cleanup, 100);
              }
              return null;
            }}
          </PDFDownloadLink>
        );
      } catch (error) {
        console.error("Error generating PDF blob:", error);
        cleanup();
        reject(error);
      }
    });
  }

  // Replace handleStatusChange logic for opening modals
  const handleStatusChange = (newStatus: Status) => {
    const validationResult = validateStatusBeforeContinue(
      newStatus,
      state,
      setInvoiceValidation,
      setWalletValidation,
      setCurrencyValidation,
      setMainCountryValidation,
      setBankCountryValidation,
      setIbanValidation,
      setBicValidation,
      setBankNameValidation,
      setStreetAddressValidation,
      setCityValidation,
      setPostalCodeValidation,
      setPayerEmailValidation,
      setLineItemValidation,
      setRoutingNumberValidation,
      isFiatCurrency
    );
    if (validationResult) {
      return;
    }
    if (newStatus === "ISSUED") {
      const trueRejection = state.rejections.find(
        (rejection: any) => rejection.final === true
      );
      if (state.status === "REJECTED" && trueRejection) {
        setRejectReason(trueRejection.reason);
        setFinalReason(trueRejection.final);
        setActiveModal("finalRejection");
        return;
      }
      setActiveModal("issueInvoice");
      return;
    }
    if (newStatus === "CANCELLED") {
      dispatch(actions.cancel({}));
      return;
    }
    if (newStatus === "ACCEPTED") {
      if (state.status === "PAYMENTCLOSED") {
        dispatch(actions.reapprovePayment({}));
        return;
      }
      dispatch(actions.accept({ payAfter: new Date().toISOString() }));
      return;
    }
    if (newStatus === "REJECTED") {
      setActiveModal("rejectInvoice");
      return;
    }
    if (newStatus === "DRAFT") {
      dispatch(actions.reset({}));
      return;
    }
    if (newStatus === "PAYMENTSCHEDULED") {
      setActiveModal("schedulePayment");
      return;
    }
    if (newStatus === "PAYMENTCLOSED") {
      setActiveModal("closePayment");
      return;
    }
    if (newStatus === "PAYMENTSENT") {
      setActiveModal("registerPayment");
      return;
    }
    if (newStatus === "PAYMENTISSUE") {
      setActiveModal("reportPaymentIssue");
      return;
    }
    if (newStatus === "PAYMENTRECEIVED") {
      setActiveModal("confirmPayment");
      return;
    }
    // Add more status checks for other modals as needed
  };

  const handleCurrencyChange = (currency: string) => {
    dispatch(actions.editInvoice({ currency }));
  };

  // Modal content map
  const modalContentMap: Record<string, React.ReactNode> = {
    issueInvoice: (
      <IssueInvoiceModalContent
        invoiceNoInput={invoiceNoInput}
        setInvoiceNoInput={setInvoiceNoInput}
        state={state}
        dispatch={dispatch}
        setWarning={setModalWarning}
      />
    ),
    rejectInvoice: (
      <RejectInvoiceModalContent
        state={state}
        dispatch={dispatch}
        setWarning={setModalWarning}
        setRejectReason={setRejectReason}
        rejectReason={rejectReason}
        setFinalReason={setFinalReason}
        finalReason={finalReason}
      />
    ),
    finalRejection: <FinalRejectionModalContent rejectReason={rejectReason} />,
    schedulePayment: (
      <SchedulePaymentModalContent
        paymentRef={paymentRef}
        setPaymentRef={setPaymentRef}
      />
    ),
    closePayment: (
      <ClosePaymentModalContent
        closureReason={closureReason}
        setClosureReason={setClosureReason}
      />
    ),
    registerPayment: (
      <RegisterPaymentTxModalContent
        paymentDate={paymentDate}
        setPaymentDate={setPaymentDate}
        txnRef={txnRef}
        setTxnRef={setTxnRef}
      />
    ),
    reportPaymentIssue: (
      <ReportPaymentIssueModalContent
        paymentIssue={paymentIssue}
        setPaymentIssue={setPaymentIssue}
      />
    ),
    confirmPayment: (
      <ConfirmPaymentModalContent
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        payments={state.payments}
      />
    ),
    // Add more modal content mappings here
  };

  const modalHeaders: Record<string, React.ReactNode> = {
    issueInvoice: <div>Issue Invoice</div>,
    rejectInvoice: <div>Reject Invoice</div>,
    finalRejection: <div>Invoice Rejected</div>,
    schedulePayment: <div>Schedule Payment</div>,
    closePayment: <div>Close Payment</div>,
    registerPayment: <div>Register Payment</div>,
    reportPaymentIssue: <div>Report Payment Issue</div>,
    confirmPayment: <div>Confirm Payment</div>,
    // Add more headers as needed
  };

  const modalContinueLabels: Record<string, string> = {
    issueInvoice: "Confirm",
    rejectInvoice: "Confirm",
    schedulePayment: "Confirm",
    closePayment: "Confirm",
    registerPayment: "Confirm",
    reportPaymentIssue: "Confirm",
    // Add more labels as needed
  };

  return (
    <div className="editor-container">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Header Section - Responsive with collapsible mobile menu */}
      <div className="mb-6">
        {/* Desktop/Tablet Header - visible from md breakpoint up */}
        <div className="hidden md:flex flex-row items-center justify-between gap-4">
          {/* Left side with Invoice title, input, and upload */}
          <div className="flex flex-row items-center gap-4 flex-wrap">
            <h1 className="text-3xl font-bold whitespace-nowrap">Invoice</h1>
            <InputField
              placeholder={"Add invoice number"}
              value={invoiceNoInput}
              handleInputChange={(e) => setInvoiceNoInput(e.target.value)}
              onBlur={(e) => {
                const newValue = e.target.value;
                if (newValue !== state.invoiceNo) {
                  dispatch(actions.editInvoice({ invoiceNo: newValue }));
                }
              }}
              input={invoiceNoInput}
              validation={invoiceValidation}
            />

            {/* Upload Dropdown Button */}
            <div className="relative" ref={uploadDropdownRef}>
              <button
                onClick={() => setUploadDropdownOpen(!uploadDropdownOpen)}
                className="inline-flex items-center h-10 px-4 rounded bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors whitespace-nowrap cursor-pointer"
                disabled={isPdfLoading}
              >
                {isPdfLoading ? "Processing..." : "Upload File"}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {uploadDropdownOpen && !isPdfLoading && (
                <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <label className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Upload UBL
                      <input
                        accept=".xml"
                        className="hidden"
                        onChange={(e) => {
                          handleFileUpload(e);
                          setUploadDropdownOpen(false);
                        }}
                        type="file"
                      />
                    </label>
                    <PDFUploader
                      dispatch={dispatch}
                      changeDropdownOpen={setUploadDropdownOpen}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Export Dropdown Button */}
            <div className="relative" ref={exportDropdownRef}>
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="inline-flex items-center h-10 px-4 rounded bg-black hover:bg-gray-800 text-white font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                Export File
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {exportDropdownOpen && (
                <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => {
                        handleExportUBL();
                        setExportDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Export UBL
                    </button>
                    <button
                      onClick={() => {
                        handleExportPDF();
                        setExportDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Currency selector and Status */}
          <div className="flex flex-row items-center gap-4">
            <CurrencyForm
              currency={state.currency}
              handleInputChange={(e) => {
                handleCurrencyChange(e.target.value);
              }}
              validation={currencyValidation}
            />

            {/* Status on the right */}
            <SelectField
              options={STATUS_OPTIONS}
              value={state.status}
              onChange={(value) => handleStatusChange(value as Status)}
            />
          </div>
        </div>

        {/* Mobile Header - visible below md breakpoint */}
        <div className="md:hidden">
          {/* Mobile Header Bar */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Invoice</h1>
            <button
              onClick={() => setMobileHeaderOpen(!mobileHeaderOpen)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              aria-label="Toggle invoice settings"
            >
              {mobileHeaderOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Current Settings Summary */}
          {!mobileHeaderOpen && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span className="font-medium">
                {state.invoiceNo || "No invoice #"}
              </span>
              <span>•</span>
              <span>{state.currency}</span>
              <span>•</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {state.status}
              </span>
            </div>
          )}

          {/* Collapsible Menu */}
          {mobileHeaderOpen && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm">
              {/* Invoice Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number
                </label>
                <InputField
                  placeholder={"Add invoice number"}
                  value={invoiceNoInput}
                  handleInputChange={(e) => setInvoiceNoInput(e.target.value)}
                  onBlur={(e) => {
                    const newValue = e.target.value;
                    if (newValue !== state.invoiceNo) {
                      dispatch(actions.editInvoice({ invoiceNo: newValue }));
                    }
                  }}
                  input={invoiceNoInput}
                  validation={invoiceValidation}
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <CurrencyForm
                  currency={state.currency}
                  handleInputChange={(e) => {
                    handleCurrencyChange(e.target.value);
                  }}
                  validation={currencyValidation}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <SelectField
                  options={STATUS_OPTIONS}
                  value={state.status}
                  onChange={(value) => handleStatusChange(value as Status)}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                {/* Upload Button */}
                <div className="relative" ref={uploadDropdownRef}>
                  <button
                    onClick={() => setUploadDropdownOpen(!uploadDropdownOpen)}
                    className="w-full inline-flex items-center justify-center h-10 px-4 rounded bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors cursor-pointer"
                    disabled={isPdfLoading}
                  >
                    {isPdfLoading ? "Processing..." : "Upload File"}
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>

                  {uploadDropdownOpen && !isPdfLoading && (
                    <div className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu">
                        <label className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                          Upload UBL
                          <input
                            accept=".xml"
                            className="hidden"
                            onChange={(e) => {
                              handleFileUpload(e);
                              setUploadDropdownOpen(false);
                            }}
                            type="file"
                          />
                        </label>
                        <PDFUploader
                          dispatch={dispatch}
                          changeDropdownOpen={setUploadDropdownOpen}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Export Button */}
                <div className="relative" ref={exportDropdownRef}>
                  <button
                    onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                    className="w-full inline-flex items-center justify-center h-10 px-4 rounded bg-black hover:bg-gray-800 text-white font-medium transition-colors cursor-pointer"
                  >
                    Export File
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>

                  {exportDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu">
                        <button
                          onClick={() => {
                            handleExportUBL();
                            setExportDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          Export UBL
                        </button>
                        <button
                          onClick={() => {
                            handleExportPDF();
                            setExportDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          Export PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid - Responsive: mobile stacks, tablet+ side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 lg:gap-4">
        {/* Issuer Section */}
        <div className="border-0 lg:border lg:border-gray-200 lg:rounded-lg p-0 lg:p-4">
          <h3 className="text-lg font-semibold mb-4">Issuer</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-2">
              <label className="block mb-1 text-sm">Issue Date:</label>
              <DatePicker
                name="issueDate"
                className={String.raw`w-full p-0`}
                onChange={(e) => {
                  const newDate = e.target.value.split("T")[0];
                  dispatch(
                    actions.editInvoice({
                      dateIssued: newDate,
                    })
                  );
                }}
                value={state.dateIssued}
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 text-sm">Delivery Date:</label>
              <DatePicker
                name="deliveryDate"
                className={String.raw`w-full p-0`}
                onChange={(e) => {
                  const newValue = e.target.value.split("T")[0];
                  if (newValue !== state.dateDelivered) {
                    dispatch(actions.editInvoice({ dateDelivered: newValue }));
                  }
                }}
                value={state.dateDelivered || ""}
              />
            </div>
          </div>
          <LegalEntityForm
            legalEntity={state.issuer}
            onChangeInfo={(input) => dispatch(actions.editIssuer(input))}
            onChangeBank={(input) => dispatch(actions.editIssuerBank(input))}
            onChangeWallet={(input) =>
              dispatch(actions.editIssuerWallet(input))
            }
            basicInfoDisabled={false}
            bankDisabled={!fiatMode}
            walletDisabled={fiatMode}
            currency={state.currency}
            status={state.status}
            walletvalidation={walletValidation}
            mainCountryValidation={mainCountryValidation}
            bankCountryValidation={bankCountryValidation}
            ibanvalidation={ibanValidation}
            bicvalidation={bicValidation}
            banknamevalidation={bankNameValidation}
            streetaddressvalidation={streetAddressValidation}
            cityvalidation={cityValidation}
            postalcodevalidation={postalCodeValidation}
            payeremailvalidation={payerEmailValidation}
            routingNumbervalidation={routingNumberValidation}
          />
        </div>

        {/* Payer Section */}
        <div className="border-0 lg:border lg:border-gray-200 lg:rounded-lg p-0 lg:p-4">
          <h3 className="text-lg font-semibold mb-4">Payer</h3>
          <div className="mb-2 w-64">
            <label className="block mb-1 text-sm">Due Date:</label>
            <DatePicker
              name="dateDue"
              className={String.raw`w-full p-0`}
              onChange={(e) =>
                dispatch(
                  actions.editInvoice({
                    dateDue: e.target.value.split("T")[0],
                  })
                )
              }
              value={state.dateDue}
            />
          </div>
          <LegalEntityForm
            bankDisabled
            legalEntity={state.payer}
            onChangeInfo={(input) => dispatch(actions.editPayer(input))}
            currency={state.currency}
            status={state.status}
            payeremailvalidation={payerEmailValidation}
          />
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-8">
        <LineItemsTable
          currency={state.currency}
          lineItems={state.lineItems.map((item: any) => ({
            ...item,
            lineItemTag: item.lineItemTag ?? [],
          }))}
          onAddItem={(item) => dispatch(actions.addLineItem(item))}
          onDeleteItem={(input) => dispatch(actions.deleteLineItem(input))}
          onUpdateCurrency={(input) => {
            setFiatMode(input.currency !== "USDS");
            dispatch(actions.editInvoice(input));
          }}
          onUpdateItem={(item) => dispatch(actions.editLineItem(item))}
          onEditingItemChange={setEditingItemValues}
          dispatch={dispatch}
          paymentAccounts={state.invoiceTags || []}
        />
      </div>

      {/* Totals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <div className="">
            <Textarea
              label="Notes"
              placeholder="Add notes"
              autoExpand={false}
              rows={4}
              multiline={true}
              value={notes}
              onBlur={(e) => {
                const newValue = e.target.value;
                if (newValue !== state.notes) {
                  dispatch(actions.editInvoice({ notes: newValue }));
                }
              }}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              className="p-2 mb-4"
            />
          </div>
        </div>
        <div className="col-span-1">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm h-32">
            <div className="">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Subtotal (excl. tax):</span>
                <span>
                  {formatNumber(itemsTotalTaxExcl)} {state.currency}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-6 text-lg font-bold text-gray-900">
                <span>Total (incl. tax):</span>
                <span>
                  {formatNumber(itemsTotalTaxIncl)} {state.currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeModal && (
        <ConfirmationModal
          open={!!activeModal}
          header={modalHeaders[activeModal]}
          onCancel={() => setActiveModal(null)}
          onContinue={() => {
            if (activeModal === "issueInvoice") {
              dispatch(
                actions.issue({
                  invoiceNo: invoiceNoInput,
                  dateIssued: state.dateIssued,
                })
              );
            }
            if (activeModal === "rejectInvoice") {
              dispatch(
                actions.reject({
                  final: finalReason,
                  id: generateId(),
                  reason: rejectReason,
                })
              );
            }
            if (activeModal === "schedulePayment") {
              dispatch(
                actions.schedulePayment({
                  id: generateId(),
                  processorRef: paymentRef,
                })
              );
            }
            if (activeModal === "closePayment") {
              dispatch(
                actions.closePayment({
                  closureReason: closureReason as ClosureReason,
                })
              );
            }
            if (activeModal === "registerPayment") {
              dispatch(
                actions.registerPaymentTx({
                  id: state.payments[state.payments.length - 1].id,
                  timestamp: paymentDate,
                  txRef: txnRef,
                })
              );
            }
            if (activeModal === "reportPaymentIssue") {
              dispatch(
                actions.reportPaymentIssue({
                  id: state.payments[state.payments.length - 1].id,
                  issue: paymentIssue,
                })
              );
            }
            if (activeModal === "confirmPayment") {
              dispatch(
                actions.confirmPayment({
                  id: state.payments[state.payments.length - 1].id,
                  amount: parseFloat(paymentAmount) || 0,
                })
              );
            }
            setActiveModal(null);
          }}
          continueLabel={modalContinueLabels[activeModal]}
          continueDisabled={modalWarning}
        >
          {modalContentMap[activeModal]}
        </ConfirmationModal>
      )}

      {/* Finance Request Section */}
      {(state.status === "ACCEPTED" || state.status === "PAYMENTSCHEDULED") && (
        <div className="mt-8">
          {!isFiatCurrency(state.currency) ? (
            <InvoiceToGnosis docState={state} dispatch={dispatch} />
          ) : (
            <RequestFinance docState={state} dispatch={dispatch} />
          )}
        </div>
      )}

      {/* Live PDF Preview */}
      {/* <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h3 className="text-lg font-semibold">PDF Preview</h3>
        </div>
        <div style={{ height: "1000px" }}>
          <PDFViewer width="100%" height="100%">
            <InvoicePDF invoice={state} fiatMode={fiatMode} />
          </PDFViewer>
        </div>
      </div> */}
    </div>
  );
}
