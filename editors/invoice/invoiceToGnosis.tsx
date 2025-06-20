import React, { useState } from "react";

let GRAPHQL_URL = "http://localhost:4001/graphql/invoice";

if (window.document.baseURI !== "http://localhost:3000/") {
  GRAPHQL_URL = "https://switchboard.powerhouse.xyz/graphql/invoice";
}

interface InvoiceToGnosisProps {
  docState: any; // Replace 'any' with the appropriate type if available
}

const InvoiceToGnosis: React.FC<InvoiceToGnosisProps> = ({ docState }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [invoiceStatusResponse, setInvoiceStatusResponse] = useState<any>(null);
  const [safeTxHash, setsafeTxHash] = useState<string | null>(null);

  const currency = docState.currency;
  const chainName = docState.issuer.paymentRouting.wallet.chainName;

  const TOKEN_ADDRESSES = {
    BASE: {
      USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      USDS: "0x820C137fa70C8691f0e44Dc420a5e53c168921Dc",
      DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      // Add more tokens as needed
    },
    ETHEREUM: {
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      USDS: "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
      DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      // Add more tokens as needed
    },
    "ARBITRUM ONE": {
      USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      USDS: "0x6491c05A82219b8D1479057361ff1654749b876b",
      DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      // Add more tokens as needed
    },
    // Add more networks as needed
  };


  // Extract payment details from current-state.json
  const paymentDetails = {
    payeeWallet: {
      address: docState.issuer.paymentRouting.wallet.address,
      chainName: docState.issuer.paymentRouting.wallet.chainName,
      chainId: docState.issuer.paymentRouting.wallet.chainId,
    },
    token: {
      evmAddress: getTokenAddress(chainName, currency),
      symbol: docState.currency,
      chainName: docState.issuer.paymentRouting.wallet.chainName,
      chainId: docState.issuer.paymentRouting.wallet.chainId,
    },
    amount: docState.totalPriceTaxIncl || 0.000015, // Make the amount small for testing
  };

  function getTokenAddress(chainName: any, symbol: any) {
    const networkTokens =
      TOKEN_ADDRESSES[chainName.toUpperCase() as keyof typeof TOKEN_ADDRESSES];
    if (!networkTokens) {
      console.error(`Network ${chainName} not supported`);
    }

    const tokenAddress = networkTokens[symbol as keyof typeof networkTokens];
    if (!tokenAddress) {
      console.error(`Token ${symbol} not supported on ${chainName}`);
    }

    return tokenAddress;
  }

  const handleInvoiceToGnosis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation Invoice_processGnosisPayment($chainName: String!, $paymentDetails: JSON!, $invoiceNo: String!) {
              Invoice_processGnosisPayment(chainName: $chainName, paymentDetails: $paymentDetails, invoiceNo: $invoiceNo) {
                success
                data
                error
              }
            }
          `,
          variables: {
            chainName: chainName,
            paymentDetails: paymentDetails,
            invoiceNo: docState.invoiceNo,
          },
        }),
      });

      const result = await response.json();
      const data = result.data.Invoice_processGnosisPayment;

      if (data.success) {
        const dataObj =
          typeof data.data === "string" ? JSON.parse(data.data) : data.data;
        setsafeTxHash(dataObj.txHash);

        if (dataObj.paymentDetails) {
          // Format the payment details for better readability
          const formattedDetails = {
            amount: dataObj.paymentDetails[0].amount,
            token: dataObj.paymentDetails[0].token.symbol,
            chain: chainName,
          };
          setInvoiceStatusResponse(
            `Amount: ${formattedDetails.amount} ${formattedDetails.token} on ${formattedDetails.chain}`
          );
        }
      } else {
        setError(data.error);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error during transfer:", error);
      setIsLoading(false);
    }
  };

  if (!currency || !chainName || currency === "" || chainName === "") {
    return null;
  }

  const parseChainName = (chainName: string) => {
    switch (chainName) {
      case "Base":
        return "base";
      case "Ethereum":
        return "eth";
      case "Arbitrum One":
        return "arb";
    }
  };

  const urlChainName = parseChainName(chainName);

  return (
    <div className="space-y-4">
      {currency && chainName && currency !== "" && chainName !== "" && (
        <button
          className="bg-blue-500 text-black px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleInvoiceToGnosis}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Send Payment to Gnosis >"}
        </button>
      )}

      {error && (
        <div className="text-red-500 bg-red-50 p-3 rounded-md">{error}</div>
      )}

      {safeTxHash && (
        <div className="bg-gray-50 p-4 rounded-md space-y-2">
          <p className="font-medium">
            Safe Transaction Hash:
            <span className="font-mono text-sm ml-2 break-all">
              {safeTxHash}
            </span>
          </p>
          <a
            href={`https://app.safe.global/transactions/queue?safe=${urlChainName}:0xF130f741d4E3185b29412c65397363f8c23A0460`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline block"
          >
            View Transaction
          </a>
        </div>
      )}

      {invoiceStatusResponse && (
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="font-medium">Payment Details:</p>
          <p className="text-gray-700">{invoiceStatusResponse}</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceToGnosis;
