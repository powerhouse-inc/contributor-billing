import {
  type InvoiceDocument,
  actions,
} from "../../../document-models/invoice/index.js";
import { InputField } from "../components/inputField.js";
import { DatePicker } from "../components/datePicker.js";
import { useEffect, useState } from "react";

// Modal content components
interface IssueInvoiceModalContentProps {
  invoiceNoInput: string;
  setInvoiceNoInput: React.Dispatch<React.SetStateAction<string>>;
  state: InvoiceDocument["state"]["global"];
  dispatch: (action: any) => void;
  setWarning: (hasWarning: boolean) => void;
}
export function IssueInvoiceModalContent({
  invoiceNoInput,
  setInvoiceNoInput,
  state,
  dispatch,
  setWarning,
}: IssueInvoiceModalContentProps) {
  useEffect(() => {
    if (invoiceNoInput === "" || state.dateIssued === "") {
      setWarning(true);
    } else {
      setWarning(false);
    }
  }, [invoiceNoInput, state.dateIssued, setWarning]);

  const warning = invoiceNoInput === "" || state.dateIssued === "";

  return (
    <div>
      {warning && (
        <div className="my-6 rounded-md bg-red-50 p-4 text-center flex flex-col items-center justify-center min-h-[64px]">
          <div className="text-red-500">
            <p>Warning: Fill in all fields before continuing.</p>
          </div>
        </div>
      )}
      <div>
        <label className="block mb-1 text-sm">Invoice Number:</label>
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
        />
      </div>
      <div className="mt-4">
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
    </div>
  );
}
