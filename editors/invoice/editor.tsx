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
import {
  ConnectConfirmationModal,
  toast,
  ToastContainer,
} from "@powerhousedao/design-system";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF.js";
import { createRoot } from "react-dom/client";
import { downloadUBL } from "./exportUBL.js";
import { CurrencyForm, currencyList } from "./components/currencyForm.js";
import { InputField } from "./components/inputField.js";
import {
  validateField,
  ValidationContext,
  ValidationResult,
} from "./validation/validationManager.js";
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
import { PaymentSchema } from "document-models/invoice/gen/schema/zod.js";
import validateStatusBeforeContinue from "./validation/validationHandler.js";

function isFiatCurrency(currency: string): boolean {
  return currencyList.find((c) => c.ticker === currency)?.crypto === false;
}

export type IProps = EditorProps<InvoiceDocument>;

export default function Editor(props: IProps) {
  const { document: doc, dispatch } = props;
  const state = doc.state.global;

  console.log("state", state.issuer.paymentRouting?.bank);

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
    let total = state.lineItems.reduce((sum, lineItem) => {
      return sum + lineItem.quantity * lineItem.unitPriceTaxExcl;
    }, 0.0);

    // If there's an item being edited, replace its contribution with the edited values
    if (editingItemValues) {
      const originalItem = state.lineItems.find(item => item.id === editingItemValues.id);
      if (originalItem) {
        // Subtract the original contribution and add the edited contribution
        total = total - (originalItem.quantity * originalItem.unitPriceTaxExcl) + 
                (editingItemValues.quantity * editingItemValues.unitPriceTaxExcl);
      }
    }

    return total;
  }, [state.lineItems, editingItemValues]);

  const itemsTotalTaxIncl = useMemo(() => {
    let total = state.lineItems.reduce((sum, lineItem) => {
      return sum + lineItem.quantity * lineItem.unitPriceTaxIncl;
    }, 0.0);

    // If there's an item being edited, replace its contribution with the edited values
    if (editingItemValues) {
      const originalItem = state.lineItems.find(item => item.id === editingItemValues.id);
      if (originalItem) {
        // Subtract the original contribution and add the edited contribution
        total = total - (originalItem.quantity * originalItem.unitPriceTaxIncl) + 
                (editingItemValues.quantity * editingItemValues.unitPriceTaxIncl);
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
      const filename = `invoice_${state.invoiceNo || "export"}.xml`;

      return await downloadUBL({
        invoice: state,
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
        (rejection) => rejection.final === true
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
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Left side with Invoice title, input, and upload */}
        <div className="flex items-center gap-4 flex-nowrap">
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

        {/* Currency selector */}
        <div className="flex items-center gap-2">
          <CurrencyForm
            currency={state.currency}
            handleInputChange={(e) => {
              handleCurrencyChange(e.target.value);
            }}
            validation={currencyValidation}
          />
        </div>

        {/* Status on the right */}
        <SelectField
          options={STATUS_OPTIONS}
          value={state.status}
          onChange={(value) => handleStatusChange(value as Status)}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Issuer Section */}
        <div className="border border-gray-200 rounded-lg p-4">
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
                    // Remove dateDelivered from editInvoice, as it's not a valid property
                    // dispatch(actions.editInvoice({ dateDelivered: newValue }));
                    // If you need to update delivery date, implement the correct action here
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
        <div className="border border-gray-200 rounded-lg p-4">
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
          lineItems={state.lineItems.map((item) => ({
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
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
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
