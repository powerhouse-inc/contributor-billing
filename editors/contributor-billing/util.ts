// Cache for exchange rates to avoid repeated API calls
const exchangeRateCache: Record<string, number> = {};

/**
 * Fetches the exchange rate between two currencies using ExchangeRate-API.
 * Supports both fiat and crypto currencies.
 * @param fromCurrency - The currency code to convert from (e.g., 'USD', 'DAI').
 * @param toCurrency - The currency code to convert to (e.g., 'EUR', 'USDS').
 * @returns The exchange rate from fromCurrency to toCurrency.
 */
export const getExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<number> => {
  // Return 1 if currencies are the same
  if (fromCurrency === toCurrency) {
    return 1;
  }

  // Create cache key
  const cacheKey = `${fromCurrency}_${toCurrency}`;
  
  // Return cached rate if available
  if (exchangeRateCache[cacheKey] !== undefined) {
    return exchangeRateCache[cacheKey];
  }

  try {
    // Use ExchangeRate-API.com for currency conversion
    // This API supports both fiat and crypto currencies
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.rates || !data.rates[toCurrency]) {
      throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    }

    const exchangeRate = data.rates[toCurrency];

    // Cache the result
    exchangeRateCache[cacheKey] = exchangeRate;
    
    return exchangeRate;
  } catch (error) {
    console.error('ExchangeRate-API error:', error);
    
    // Fallback: try a different approach for crypto currencies
    if (['USDS', 'DAI'].includes(fromCurrency) || ['USDS', 'DAI'].includes(toCurrency)) {
      try {
        // For crypto currencies, use CoinGecko as fallback
        const cryptoMapping: Record<string, string> = {
          'USDS': 'usd-coin',
          'DAI': 'dai',
        };

        const fromMapped = cryptoMapping[fromCurrency] || fromCurrency.toLowerCase();
        const toMapped = cryptoMapping[toCurrency] || toCurrency.toLowerCase();

        if (cryptoMapping[fromCurrency]) {
          // From crypto to fiat/crypto
          const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromMapped}&vs_currencies=${toMapped}`);
          if (response.ok) {
            const data = await response.json();
            const rate = data[fromMapped]?.[toMapped];
            if (rate) {
              exchangeRateCache[cacheKey] = rate;
              return rate;
            }
          }
        } else if (cryptoMapping[toCurrency]) {
          // From fiat to crypto
          const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${toMapped}&vs_currencies=${fromMapped}`);
          if (response.ok) {
            const data = await response.json();
            const rate = data[toMapped]?.[fromMapped];
            if (rate) {
              const invertedRate = 1 / rate;
              exchangeRateCache[cacheKey] = invertedRate;
              return invertedRate;
            }
          }
        }
      } catch (cryptoError) {
        console.error('Crypto fallback error:', cryptoError);
      }
    }
    
    return 1; // Final fallback to 1:1 on error
  }
};
