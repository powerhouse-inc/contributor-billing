import countries from "world-countries";
type Country = {
  name: {
    common: string;
    official: string;
    native?: Record<string, { common: string; official: string }>;
  };
  cca2: string;
};
const countriesArray = countries as unknown as Country[];

// Function to convert country name to country code
export const getCountryCodeFromName = (
  countryName: string | undefined | null,
): string => {
  if (!countryName) return "";

  // Special case handling for common abbreviations and alternative names
  const specialCases: Record<string, string> = {
    uk: "GB",
    "united kingdom": "GB",
    england: "GB",
    britain: "GB",
    deutschland: "DE",
    germany: "DE",
    usa: "US",
    "united states of america": "US",
    america: "US",
  };

  const lowerCountryName = countryName.toLowerCase().trim();

  // Check special cases first
  if (specialCases[lowerCountryName]) {
    return specialCases[lowerCountryName];
  }

  // Check if input is already a valid country code (2-letter code)
  if (countryName.length === 2 && /^[A-Z]{2}$/.test(countryName)) {
    const isValidCode = countriesArray.some((c) => c.cca2 === countryName);
    if (isValidCode) return countryName;
  }

  // Try exact match first (case-insensitive)
  const exactMatch = countriesArray.find(
    (c) => c.name.common.toLowerCase() === lowerCountryName,
  );
  if (exactMatch) return exactMatch.cca2;

  // Try official name match
  const officialMatch = countriesArray.find(
    (c) => c.name.official.toLowerCase() === lowerCountryName,
  );
  if (officialMatch) return officialMatch.cca2;

  // Try native name matches
  const nativeMatch = countriesArray.find((c) => {
    if (!c.name.native) return false;
    return Object.values(c.name.native).some(
      (n) =>
        n.common.toLowerCase() === lowerCountryName ||
        n.official.toLowerCase() === lowerCountryName,
    );
  });
  if (nativeMatch) return nativeMatch.cca2;

  // Try partial match if no exact match found
  const partialMatch = countriesArray.find(
    (c) =>
      c.name.common.toLowerCase().includes(lowerCountryName) ||
      lowerCountryName.includes(c.name.common.toLowerCase()),
  );
  if (partialMatch) return partialMatch.cca2;

  // If no match found, return original value
  return countryName;
};

// Chain configuration interface
export interface ChainConfig {
  chainName: string;
  chainId: string;
  rpc: string;
  fallbackRpcs: string[];
}

// Alchemy RPC base URLs per chain (append API key at runtime)
const ALCHEMY_RPC = {
  base: "https://base-mainnet.g.alchemy.com/v2",
  ethereum: "https://eth-mainnet.g.alchemy.com/v2",
  arbitrum: "https://arb-mainnet.g.alchemy.com/v2",
} as const;

function alchemyRpc(chain: keyof typeof ALCHEMY_RPC): string {
  const apiKey =
    typeof process !== "undefined" ? process.env?.ALCHEMY_API_KEY : undefined;
  if (!apiKey) {
    return "";
  }
  return `${ALCHEMY_RPC[chain]}/${apiKey}`;
}

// Single source of truth for blockchain chain configurations
// Primary RPC is Alchemy (requires ALCHEMY_API_KEY); public RPCs are fallbacks.
export function getChainConfigs(): Record<string, ChainConfig> {
  return {
    base: {
      chainName: "Base",
      chainId: "8453",
      rpc: alchemyRpc("base") || "https://base-mainnet.public.blastapi.io",
      fallbackRpcs: [
        "https://base-mainnet.public.blastapi.io",
        "https://base-rpc.publicnode.com",
      ],
    },
    ethereum: {
      chainName: "Ethereum",
      chainId: "1",
      rpc: alchemyRpc("ethereum") || "https://ethereum-rpc.publicnode.com",
      fallbackRpcs: [
        "https://ethereum-rpc.publicnode.com",
        "https://eth-mainnet.public.blastapi.io",
        "https://1rpc.io/eth",
      ],
    },
    "arbitrum one": {
      chainName: "Arbitrum One",
      chainId: "42161",
      rpc: alchemyRpc("arbitrum") || "https://arb1.arbitrum.io/rpc",
      fallbackRpcs: [
        "https://arb1.arbitrum.io/rpc",
        "https://arbitrum-one-rpc.publicnode.com",
        "https://arbitrum-one.public.blastapi.io",
      ],
    },
  };
}

/**
 * Maps a chain name to its full configuration including chainId and RPC endpoint
 * Normalizes case and handles various chain name formats
 * @param chainName - Chain name from various sources (Claude AI, user input, etc.)
 * @returns ChainConfig object with chainName, chainId, and rpc
 */
export function mapChainNameToConfig(
  chainName: string | null | undefined,
): ChainConfig {
  const configs = getChainConfigs();
  const defaultConfig = configs.ethereum;

  if (!chainName) {
    return defaultConfig;
  }

  const normalizedChainName = chainName.toLowerCase().trim();

  // Direct lookup
  if (configs[normalizedChainName]) {
    return configs[normalizedChainName];
  }

  // Handle alternative names and variations
  const chainAliases: Record<string, string> = {
    eth: "ethereum",
    mainnet: "ethereum",
    arb: "arbitrum one",
    arbitrum: "arbitrum one",
    "arb one": "arbitrum one",
  };

  const aliasedName = chainAliases[normalizedChainName];
  if (aliasedName && configs[aliasedName]) {
    return configs[aliasedName];
  }

  // If no match found, return default (Ethereum)
  console.warn(
    `Unknown chain name: "${chainName}". Using default chain: ${defaultConfig.chainName}`,
  );
  return defaultConfig;
}

/**
 * Get all available chain configurations as an array
 * Useful for UI dropdowns and validation
 */
export function getAllChainConfigs(): ChainConfig[] {
  return Object.values(getChainConfigs());
}

/**
 * Get chain configuration by chainId
 * @param chainId - The numeric chain ID as string
 * @returns ChainConfig if found, null otherwise
 */
export function getChainConfigByChainId(chainId: string): ChainConfig | null {
  return (
    Object.values(getChainConfigs()).find(
      (config) => config.chainId === chainId,
    ) || null
  );
}
