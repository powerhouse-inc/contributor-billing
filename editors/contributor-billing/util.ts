// Cache for exchange rates to avoid repeated API calls
const exchangeRateCache: Record<string, number> = {};

/**
 * Validates if an amount should trigger an exchange rate fetch
 * @param amount - The amount to validate
 * @returns true if the amount is valid and should trigger API calls
 */
const isValidAmount = (amount?: number): boolean => {
  return amount !== undefined && amount !== null && !isNaN(amount) && amount > 0;
};

/**
 * Fetches the exchange rate between two currencies using ExchangeRate-API.
 * Supports both fiat and crypto currencies.
 * @param fromCurrency - The currency code to convert from (e.g., 'USD', 'DAI').
 * @param toCurrency - The currency code to convert to (e.g., 'EUR', 'USDS').
 * @param amount - The amount to convert (optional, used for validation).
 * @returns The exchange rate from fromCurrency to toCurrency.
 */
export const getExchangeRate = async (fromCurrency: string, toCurrency: string, amount?: number): Promise<number> => {
  // Normalize inputs
  const base = (fromCurrency || '').trim().toUpperCase();
  const quote = (toCurrency || '').trim().toUpperCase();

  // Guard empty currencies
  if (!base || !quote) {
    return 1;
  }

  // Return 1 if currencies are the same
  if (base === quote) {
    return 1;
  }

  // Skip API call if amount is explicitly provided and invalid
  if (amount !== undefined && !isValidAmount(amount)) {
    return 1;
  }

  // Create cache key
  const cacheKey = `${base}_${quote}`;
  
  // Return cached rate if available
  if (exchangeRateCache[cacheKey] !== undefined) {
    return exchangeRateCache[cacheKey];
  }

  try {
    // Use a CORS-friendly endpoint that does not redirect
    // API: https://open.er-api.com/v6/latest/{BASE}
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`https://open.er-api.com/v6/latest/${base}`, { signal: controller.signal });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.rates || !data.rates[quote]) {
      throw new Error(`Exchange rate not found for ${base} to ${quote}`);
    }

    const exchangeRate = data.rates[quote];

    // Cache the result
    exchangeRateCache[cacheKey] = exchangeRate;
    
    return exchangeRate;
  } catch (error) {
    console.error('ExchangeRate-API error:', error);
    
    // Fallback: try a different approach for crypto currencies
    if (['USDS', 'DAI'].includes(base) || ['USDS', 'DAI'].includes(quote)) {
      try {
        // For crypto currencies, use CoinGecko as fallback
        const cryptoMapping: Record<string, string> = {
          'USDS': 'usd-coin',
          'DAI': 'dai',
        };

        const fromMapped = cryptoMapping[base] || base.toLowerCase();
        const toMapped = cryptoMapping[quote] || quote.toLowerCase();

        if (cryptoMapping[base]) {
          // From crypto to fiat/crypto
          const cryptoController = new AbortController();
          const cryptoTimeoutId = setTimeout(() => cryptoController.abort(), 8000); // 8 second timeout
          
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${fromMapped}&vs_currencies=${toMapped}`,
            { signal: cryptoController.signal }
          );
          
          clearTimeout(cryptoTimeoutId);
          if (response.ok) {
            const data = await response.json();
            const rate = data[fromMapped]?.[toMapped];
            if (rate) {
              exchangeRateCache[cacheKey] = rate;
              return rate;
            }
          }
        } else if (cryptoMapping[quote]) {
          // From fiat to crypto
          const cryptoController2 = new AbortController();
          const cryptoTimeoutId2 = setTimeout(() => cryptoController2.abort(), 8000); // 8 second timeout
          
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${toMapped}&vs_currencies=${fromMapped}`,
            { signal: cryptoController2.signal }
          );
          
          clearTimeout(cryptoTimeoutId2);
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
