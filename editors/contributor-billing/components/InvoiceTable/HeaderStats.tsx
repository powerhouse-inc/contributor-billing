import { Select } from "@powerhousedao/document-engineering/ui";
import { useState, useEffect } from "react";
import { useDocumentsInSelectedDrive } from "@powerhousedao/reactor-browser";
import { getExchangeRate } from "../../util.js";
import { Tooltip, TooltipProvider } from "@powerhousedao/design-system/ui";

const currencyList = [
  { ticker: "USDS", crypto: true },
  { ticker: "USDC", crypto: true },
  { ticker: "DAI", crypto: true },
  { ticker: "USD", crypto: false },
  { ticker: "EUR", crypto: false },
  { ticker: "DKK", crypto: false },
  { ticker: "GBP", crypto: false },
  { ticker: "JPY", crypto: false },
  { ticker: "CNY", crypto: false },
  { ticker: "CHF", crypto: false },
];

export const HeaderStats = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const documents = useDocumentsInSelectedDrive();
  const invoices = documents?.filter(
    (doc) => doc.header.documentType === "powerhouse/invoice"
  );

  useEffect(() => {
    const calculateTotalExpenses = async () => {
      if (!invoices || invoices.length === 0) {
        setTotalExpenses(0);
        return;
      }

      let total = 0;
      for (const doc of invoices) {
        const invoice = doc as any;
        const invoiceAmount = invoice.state.global.totalPriceTaxIncl;
        let invoiceCurrency = invoice.state.global.currency || "USD"; // Fallback to USD if currency is empty
        let selectCurrency = selectedCurrency;
        if (invoiceCurrency === selectedCurrency) {
          total += invoiceAmount;
        } else {
          try {
            // Only convert crypto currencies to USD for the API call
            let fromCurrency = invoiceCurrency;
            let toCurrency = selectedCurrency;

            // Convert crypto to USD for API compatibility
            if (invoiceCurrency === "DAI" || invoiceCurrency === "USDS") {
              fromCurrency = "USD";
            }
            if (selectedCurrency === "DAI" || selectedCurrency === "USDS") {
              toCurrency = "USD";
            }

            const exchangeRate = await getExchangeRate(
              fromCurrency,
              toCurrency,
              invoiceAmount
            );
            total += invoiceAmount * exchangeRate;
          } catch (error) {
            console.error("Error getting exchange rate:", error);
            // Fallback to original amount if exchange rate fails
            total += invoiceAmount;
          }
        }
      }
      setTotalExpenses(total);
    };

    calculateTotalExpenses();
  }, [invoices, selectedCurrency]);

  const currencyOptions = currencyList.map((currency) => ({
    label: currency.ticker,
    value: currency.ticker,
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        {/* Header with Currency Selector */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Operational Hub
          </h1>
          <div className="max-w-[200px]">
            <Select
              style={{ width: "200px" }}
              options={currencyOptions}
              value={selectedCurrency}
              onChange={(value) => setSelectedCurrency(value as string)}
              placeholder="Select Currency"
            />
          </div>
        </div>

        {/* Main Content - Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <h3 className="text-sm font-medium text-gray-600">
                Total Expenses
              </h3>
              <Tooltip
                content="Approximate value calculated using exchangerate-api.com. DAI + USDS are converted to USD for simplicity"
                side="right"
              >
                <div className="w-4 h-4 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center cursor-help">
                  !
                </div>
              </Tooltip>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {selectedCurrency}{" "}
              {totalExpenses.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Total Invoices
            </h3>
            <p className="text-xl font-bold text-gray-900">
              {invoices?.length}
            </p>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};
