import SafeApiKit from '@safe-global/api-kit';
import Safe from '@safe-global/protocol-kit';
import { OperationType } from '@safe-global/types-kit';
import { ethers, AbiCoder } from 'ethers';
import dotenv from 'dotenv';
import { CHAIN_CONFIGS } from '../../editors/invoice/utils/utils.js';

dotenv.config();

// --- Type definitions ---
export interface PayerWallet {
  rpc: string;
  chainName: string;
  chainId: string;
  address: string;
}

export interface PayeeWallet {
  address: string;
}

export interface TokenInfo {
  symbol: string;
  evmAddress: string;
  decimals: number;
}

export interface PaymentDetail {
  payeeWallet: PayeeWallet;
  token: TokenInfo;
  amount: string | number;
}

export interface TransferResult {
  success: true;
  txHash: string;
  safeAddress: string;
  paymentDetails: PaymentDetail[];
}

const safeAddress = process.env.PRODUCTION_SAFE_ADDRESS;
if (!safeAddress) {
  throw new Error('Missing SAFE_ADDRESS in .env');
}

const payerWallets: Record<string, PayerWallet> = {
  BASE: {
    ...CHAIN_CONFIGS.base,
    address: safeAddress, // Safe address
  },
  ETHEREUM: {
    ...CHAIN_CONFIGS.ethereum,
    address: safeAddress, // Safe address
  },
  "ARBITRUM ONE": {
    ...CHAIN_CONFIGS["arbitrum one"],
    address: safeAddress, // Safe address
  },
}

/**
 * Retry helper with exponential backoff for Safe API calls
 * Handles rate limiting (429 errors) and temporary failures
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
  operationName = "API call"
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit = error?.message?.includes('Too Many Requests') ||
        error?.message?.includes('429') ||
        error?.status === 429;

      if (isRateLimit && attempt < maxRetries - 1) {
        const waitTime = initialDelay * Math.pow(2, attempt); // Exponential backoff
        console.log(`[${operationName}] Rate limited, retrying in ${waitTime}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      // If it's not a rate limit error, or we've exhausted retries, throw
      throw error;
    }
  }
  throw new Error(`${operationName}: Max retries (${maxRetries}) exceeded`);
}

// --- Implementation ---
async function executeTransferProposal(
  chainName: string,
  paymentDetailsInput: PaymentDetail | PaymentDetail[],
): Promise<TransferResult> {

  const payerWallet = payerWallets[chainName.toUpperCase() as keyof typeof payerWallets];

  const paymentDetails = Array.isArray(paymentDetailsInput)
    ? paymentDetailsInput
    : [paymentDetailsInput];

  const privateKey = process.env.SIGNER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Missing SIGNER_PRIVATE_KEY in .env');
  }

  console.log('\n=== Safe Transfer Initialization ===');
  console.log(`Chain: ${payerWallet.chainName} (${payerWallet.chainId})`);
  console.log(`Safe Address: ${payerWallet.address}`);

  // Set up provider and signer
  const provider = new ethers.JsonRpcProvider(payerWallet.rpc);
  const signer = new ethers.Wallet(privateKey, provider);

  // Safe API and Protocol Kit instances
  // @ts-ignore - Ignoring constructor error as per requirements
  const safeApiKit = new SafeApiKit({
    chainId: BigInt(payerWallet.chainId),
    apiKey: process.env.SAFE_API_KEY
  });

  // Get next nonce with retry logic for rate limiting
  const nextNonce = await withRetry(
    () => safeApiKit.getNextNonce(safeAddress),
    3,
    1000,
    "getNextNonce"
  );
  console.log("Next Nonce: ", nextNonce)

  // @ts-ignore - Ignoring constructor error as per requirements
  const protocolKit = await Safe.init({
    provider: payerWallet.rpc,
    signer: privateKey,
    safeAddress: payerWallet.address,
  });

  // Build the batch of ERC-20 transfer calls
  const coder = AbiCoder.defaultAbiCoder();
  const transactions = paymentDetails.map((pd) => {
    const { payeeWallet, token, amount } = pd;
    const amountSmall = ethers.parseUnits(
      amount.toString(),
      token.decimals,
    );

    console.log('\n--- Preparing transfer ---');
    console.log(`Token: ${token.symbol} @ ${token.evmAddress}`);
    console.log(`To: ${payeeWallet.address}`);
    console.log(`Amount: ${amount} → ${amountSmall}`);

    // a9059cbb is the ERC-20 transfer method ID
    const data =
      '0xa9059cbb' +
      coder.encode(['address', 'uint256'], [
        payeeWallet.address,
        amountSmall,
      ]).slice(2);

    return {
      to: token.evmAddress,
      value: '0',
      data,
      operation: OperationType.Call,
    };
  });

  console.log('\n=== Creating Safe transaction ===');
  const safeTx = await protocolKit.createTransaction({
    transactions,
    options: {
      nonce: nextNonce
    }
  });

  console.log('\n=== Signing & proposing ===');
  const safeTxHash = await protocolKit.getTransactionHash(safeTx);
  const signature = await protocolKit.signHash(safeTxHash);
  const senderAddress = await signer.getAddress();

  // Propose transaction with retry logic for rate limiting
  await withRetry(
    async () => safeApiKit.proposeTransaction({
      safeAddress: payerWallet.address,
      safeTransactionData: safeTx.data,
      safeTxHash,
      senderAddress,
      senderSignature: signature.data,
    }),
    3,
    1000,
    "proposeTransaction"
  );

  return {
    success: true,
    txHash: safeTxHash,
    safeAddress: payerWallet.address,
    paymentDetails,
  };
}

export { executeTransferProposal }
