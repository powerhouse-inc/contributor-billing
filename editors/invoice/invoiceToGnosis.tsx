import React, { useState } from "react";

interface InvoiceToGnosisProps {
  docState: any; // Replace 'any' with the appropriate type if available
}

const InvoiceToGnosis: React.FC<InvoiceToGnosisProps> = ({ docState }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [transactionLink, setTransactionLink] = useState<string | null>(null);

  const TOKEN_ADDRESSES = {
    BASE: {
      USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      USDS: "0x820C137fa70C8691f0e44Dc420a5e53c168921Dc",
      // Add more tokens as needed
    },
    // Add more networks as needed
  };

  // Separate payerWallet configuration
  const payerWallet = {
    rpc: "https://base.llamarpc.com",
    chainName: "Base",
    chainId: "8453",
    address: "0x1FB6bEF04230d67aF0e3455B997a28AFcCe1F45e", // Safe address
  };

  const currency = docState.currency;
  const chainName = docState.issuer.paymentRouting.wallet.chainName;

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
    amount: 0.00001, // Make the amount small for testing
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
    setTransactionLink(null);

    try {
      const response = await fetch("http://localhost:5000/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payerWallet,
          paymentDetails,
        }),
      });

      const data = await response.json();
      console.log("Transfer result:", data);
      setResponseData(data);
      setTransactionLink(data.txHash.safeTxHash);
      setIsLoading(false);
    } catch (error) {
      console.error("Error during transfer:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-black px-4 py-2 rounded-md"
        onClick={handleInvoiceToGnosis}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Send Payment to Gnosis >"}
      </button>

      {error && <div className="error-message">{error}</div>}

      {transactionLink && (
        <div className="invoice-link">
          <p>Safe Transaction Hash: {transactionLink}</p>
          <a
            style={{ color: "blue" }}
            href={
              "https://app.safe.global/transactions/queue?safe=base:0x1FB6bEF04230d67aF0e3455B997a28AFcCe1F45e"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="view-invoice-button"
          >
            View Transaction Details
          </a>
        </div>
      )}
    </div>
  );
};

export default InvoiceToGnosis;
