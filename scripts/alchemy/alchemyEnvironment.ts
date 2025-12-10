/**
 * Environment-aware configuration for Alchemy API integration
 * Follows the contributor-billing pattern for local/remote compatibility
 */

// Environment detection following the invoice module pattern
let ALCHEMY_GRAPHQL_URL = 'http://localhost:4001/graphql';
let LOCAL_MODE = true;

// Check if we're running in a remote environment
if (typeof window !== 'undefined' && !window.document.baseURI.includes('localhost')) {
  ALCHEMY_GRAPHQL_URL = 'https://switchboard-dev.powerhouse.xyz/graphql';
  LOCAL_MODE = false;
}

export const AlchemyEnvironmentConfig = {
  endpoint: ALCHEMY_GRAPHQL_URL,
  isLocal: LOCAL_MODE,
  // API calls work regardless of document location
  apiKey: typeof process !== 'undefined' ? process.env.ALCHEMY_API_KEY : undefined,
  network: typeof process !== 'undefined' ? (process.env.ALCHEMY_NETWORK || 'mainnet') : 'mainnet',

  // Debug info
  get debugInfo() {
    return {
      mode: this.isLocal ? 'Local Connect' : 'Remote Switchboard',
      endpoint: this.endpoint,
      network: this.network,
      hasApiKey: !!this.apiKey
    };
  }
};

/**
 * Get the appropriate GraphQL endpoint based on environment
 */
export function getAlchemyGraphQLEndpoint(): string {
  return AlchemyEnvironmentConfig.endpoint;
}

/**
 * Check if we're running in local development mode
 */
export function isLocalEnvironment(): boolean {
  return AlchemyEnvironmentConfig.isLocal;
}

/**
 * Log environment information for debugging
 */
export function logEnvironmentInfo(): void {
  console.log('[AlchemyEnvironment]', AlchemyEnvironmentConfig.debugInfo);
}