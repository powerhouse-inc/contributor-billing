import type React from "react";
import { useState } from "react";
import axios from "axios"; // or use fetch API directly

interface RequestFinanceProps {
  docState: any; // Replace 'any' with the appropriate type if available
}

const RequestFinance: React.FC<RequestFinanceProps> = ({ docState }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [invoiceLink, setInvoiceLink] = useState<string | null>(null);

  const handleRequestFinance = async () => {
    console.log("state when request finance is clicked", docState);
    setIsLoading(true);
    setError(null);
    setInvoiceLink(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/create-invoice",
        {
          creationDate:
            `${docState.dateIssued}T09:38:16.916Z` ||
            "2025-01-27T14:38:16.916Z",
          invoiceItems: docState.lineItems.map((item: any) => ({
            currency: item.currency,
            name: item.description,
            quantity: item.quantity,
            unitPrice: item.totalPriceTaxIncl * 100,
          })) || [
            {
              currency: "EUR",
              name: "test invoice",
              quantity: 1,
              unitPrice: "25000",
            },
          ],
          invoiceNumber: docState.invoiceNo || "2.07",
          buyerInfo: {
            businessName: "Liberuum",
            email: "liberuum@powerhouse.inc",
          },
          paymentOptions: [
            {
              type: "wallet",
              value: {
                currencies: ["EURe"],
                paymentInformation: {
                  paymentAddress:
                    docState.issuer.paymentRouting.wallet.address ||
                    "0x4714C7EfE5D0213615FC6CBB8717B524eC433e9a",
                  chain: "xdai",
                },
              },
            },
          ],
          tags: ["created_in_connect"],
        },
      );

      console.log("Invoice created successfully:", response.data);
      setResponseData(response.data);

      if (response.data?.invoiceLinks?.pay) {
        setInvoiceLink(response.data.invoiceLinks.pay);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-black px-4 py-2 rounded-md"
        onClick={handleRequestFinance}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Send Payment to Request Finance >"}
      </button>

      {error && <div className="error-message">{error}</div>}

      {invoiceLink && (
        <div className="invoice-link">
          <a
            style={{ color: "blue" }}
            href={invoiceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="view-invoice-button"
          >
            View Invoice
          </a>
        </div>
      )}
    </div>
  );
};

export default RequestFinance;
