import React, { useState } from "react";
import { actions } from "../../document-models/invoice/index.js";
import { generateId } from "document-model";

let GRAPHQL_URL = "http://localhost:4001/graphql/invoice";

if (!window.document.baseURI.includes("localhost")) {
  GRAPHQL_URL = "https://switchboard-dev.powerhouse.xyz/graphql/invoice";
}

interface RequestFinanceProps {
  docState: any; // Replace 'any' with the appropriate type if available
  dispatch: any;
}

const RequestFinance: React.FC<RequestFinanceProps> = ({
  docState,
  dispatch,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [invoiceLink, setInvoiceLink] = useState<string | null>(null);
  const [directPaymentStatus, setDirectPaymentStatus] = useState<string | null>(
    null
  );
  const invoiceStatus = docState.status;

  // Function to call the createDirectPayment mutation
  const createDirectPayment = async (paymentData: any) => {
    try {
      // GraphQL mutation request
      const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation Invoice_createRequestFinancePayment($paymentData: JSON!) {
              Invoice_createRequestFinancePayment(paymentData: $paymentData) {
                success
                data
                error
              }
            }
          `,
          variables: {
            paymentData,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (result.data?.Invoice_createRequestFinancePayment?.success) {
        setDirectPaymentStatus("Direct payment created successfully");
        return result.data.Invoice_createRequestFinancePayment.data;
      } else {
        throw new Error(
          result.data?.Invoice_createRequestFinancePayment?.error ||
            "Unknown error"
        );
      }
    } catch (err) {
      console.error("Error creating direct payment:", err);
      setDirectPaymentStatus(
        `Error creating direct payment: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      throw err;
    }
  };

  const handleRequestFinance = async () => {
    console.log("state when request finance is clicked", docState);
    setIsLoading(true);
    setError(null);
    setInvoiceLink(null);
    setDirectPaymentStatus(null);

    let bankDetails: any = {
      currency: docState.currency,
      accountNumber: docState.issuer.paymentRouting.bank.accountNum,
      country:
        docState.issuer.paymentRouting.bank.address.country.toUpperCase(),
      bankName: docState.issuer.paymentRouting.bank.name,
      firstName:
        docState.issuer.paymentRouting.bank.beneficiary.split(" ")[0] ||
        "Liberuum",
      lastName:
        docState.issuer.paymentRouting.bank.beneficiary.split(" ")[1] ||
        "Liberty",
      bicSwift:
        docState.issuer.paymentRouting.bank.BIC ||
        docState.issuer.paymentRouting.bank.SWIFT,
    };
    if (
      docState.issuer.paymentRouting.bank.ABA &&
      docState.issuer.paymentRouting.bank.ABA.trim() !== ""
    ) {
      bankDetails.routingNumber  = docState.issuer.paymentRouting.bank.ABA;
    }

    const getDecimalPlaces = (currency: string): number => {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 0, // Ensure we get the default for the currency
      });
      return formatter.resolvedOptions().maximumFractionDigits ?? 2;
    };

    try {
      const invoiceData = {
        meta: {
          format: "rnf_generic",
          version: "0.0.3",
        },
        creationDate: docState.dateIssued,
        invoiceItems: docState.lineItems.map((item: any) => {
          const currency = bankDetails.currency;
          const decimalPlaces = getDecimalPlaces(currency);
          const multiplier = Math.pow(10, decimalPlaces);
          const unitPriceInt = Math.round(item.unitPriceTaxIncl * multiplier);

          return {
            currency,
            name: item.description,
            quantity: item.quantity,
            unitPrice: unitPriceInt,
          };
        }),
        invoiceNumber: docState.invoiceNo,
        buyerInfo: {
          // email: docState.payer.contactInfo.email,
          email: "",
          firstName: docState.payer.name,
          // lastName: docState.payer.name.split(" ")[1] || "Liberty",
          businessName: docState.payer.name,
          address: {
            country: docState.payer.address.country,
            city: docState.payer.address.city,
            streetAddress: docState.payer.address.streetAddress,
            extendedAddress: docState.payer.address.extendedAddress,
            postalCode: docState.payer.address.postalCode,
            region: docState.payer.address.stateProvince || "",
          },
        },
        sellerInfo: {
          email: docState.issuer.contactInfo.email,
          firstName: docState.issuer.name,
          lastName: "",
          address: {
            country: docState.issuer.address.country,
            city: docState.issuer.address.city,
            streetAddress: docState.issuer.address.streetAddress,
            extendedAddress: docState.issuer.address.extendedAddress,
            postalCode: docState.issuer.address.postalCode,
            region: docState.issuer.address.stateProvince || "",
          },
        },
        paymentOptions: [
          {
            type: "bank-account",
            value: {
              currency: bankDetails.currency,
              paymentInformation: {
                bankAccountDetails: {
                  ...bankDetails,
                },
              },
            },
          },
        ],
      };

      // Instead of calling the API endpoint directly, use the createDirectPayment function
      const directPaymentResult = await createDirectPayment(invoiceData);
      console.log(
        "Direct payment created: (unitPrice in cents)",
        directPaymentResult
      );

      // Process the response
      if (directPaymentResult?.response?.invoiceLinks?.pay) {
        setInvoiceLink(directPaymentResult.response.invoiceLinks.pay);
        if (invoiceStatus === "ACCEPTED") {
          dispatch(
            actions.schedulePayment({
              id: generateId(),
              processorRef: directPaymentResult.response.invoiceLinks.pay,
            })
          );
        } else {
          dispatch(
            actions.addPayment({
              id: generateId(),
              processorRef: directPaymentResult.response.invoiceLinks.pay,
              confirmed: false,
            })
          );
        }
      }

      setResponseData(directPaymentResult);
      setDirectPaymentStatus("Direct payment created successfully");
    } catch (err) {
      // Handle error with proper typing
      let errorMessage = "An error occurred";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      dispatch(
        actions.addPayment({
          id: generateId(),
          processorRef: "",
          confirmed: false,
          issue: errorMessage,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  const liktText = "Request Finance [>]";
  return (
    <div>
      <button
        className="bg-blue-500 text-black px-4 py-2 rounded-md"
        onClick={handleRequestFinance}
        disabled={isLoading}
      >
        {isLoading
          ? "Processing..."
          : invoiceStatus === "ACCEPTED"
            ? "Schedule Payment in Request Finance"
            : "Reschedule Payment in Request Finance"}
      </button>

      {invoiceLink && (
        <div>
          <div className="direct-payment-status">
            <p>{directPaymentStatus}</p>
          </div>
          <div className="invoice-link text-blue-900 hover:text-blue-600">
            <a
              href={invoiceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="view-invoice-button"
            >
              {liktText}
            </a>
          </div>
        </div>
      )}
      {!invoiceLink &&
        invoiceStatus === "PAYMENTSCHEDULED" &&
        docState.payments?.length > 0 && (
          <>
            {docState.payments[docState.payments.length - 1].issue !== "" ? (
              <div className="mt-4">
                <p className="text-red-700 font-medium">
                  Issue: {docState.payments[docState.payments.length - 1].issue}
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <div className="invoice-link text-blue-900 hover:text-blue-600">
                  <a
                    className="view-invoice-button"
                    href={
                      docState.payments[docState.payments.length - 1]
                        .processorRef
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {liktText}
                  </a>
                </div>
              </div>
            )}
          </>
        )}
    </div>
  );
};

export default RequestFinance;
