/**
 * Fetches the historical exchange rate from `from` currency to `to` currency on a given date
 * using Free Currency API (https://freecurrencyapi.com/).
 * @param date - Date string in YYYY-MM-DD format
 * @param from - Source currency (e.g., 'USD')
 * @param to - Target currency (e.g., 'CHF')
 * @returns The exchange rate as a number
 */

// Simple in-memory cache: { '2024-06-10|USD|CHF': 0.91 }
const exchangeRateCache: Record<string, number> = {};

function getFreeCurrencyApiKey(): string {
  try {
    const key = process.env.FREECURRENCY_API_KEY || 'YOUR_API_KEY_HERE';
    if (!key || key === 'YOUR_API_KEY_HERE') {
      throw new Error('Free Currency API key is missing or not set.');
    }
    return key;
  } catch (err) {
    console.error('Error retrieving Free Currency API key:', err);
    // Optionally, you can throw or return a fallback value
    throw err;
  }
}

/**
 * Fetches the historical exchange rate from `from` currency to `to` currency on a given date,
 * using Free Currency API, with in-memory caching for efficiency.
 */
export async function getExchangeRate(date: string, from: string, to: string): Promise<number> {
  if (!date || !from || !to || from === to) return 1;
  const formattedDate = date.split('T')[0];
  const cacheKey = `${formattedDate}|${from}|${to}`;
  // Check cache first
  if (exchangeRateCache[cacheKey] !== undefined) {
    return exchangeRateCache[cacheKey];
  }
  try {
    const FREECURRENCY_API_KEY = getFreeCurrencyApiKey();
    const url = `https://api.freecurrencyapi.com/v1/historical?apikey=${FREECURRENCY_API_KEY}&base_currency=${from}&currencies=${to}&date=${formattedDate}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch exchange rate: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    const rate = data?.data?.[formattedDate]?.[to];
    if (typeof rate !== 'number') {
      throw new Error(`Exchange rate for ${to} on ${formattedDate} not found in response`);
    }
    // Store in cache
    exchangeRateCache[cacheKey] = rate;
    return rate;
  } catch (err) {
    console.error('ForEx API error:', err);
    // Fallback: 1:1
    return 1;
  }
}

export async function exportInvoicesToXeroCSV(invoiceStates: any[]): Promise<void> {
  
  
  const headers = [
    'Narration',
    'Date',
    'Description',
    'AccountCode',
    'TaxRate',
    'Amount',
    'Invoice currency', // NEW COLUMN
    'FX Rate Used',     // NEW COLUMN
    'TrackingName1',
    'TrackingOption1',
    'TrackingName2',
    'TrackingOption2'
  ];

  const rows: string[][] = [];

  for (let state of invoiceStates) {
    state = state.global
    console.log(state)
    const items = state.lineItems || [];
    const dateIssued = state.dateIssued || '';
    const datePaid = state.paymentDate || '';
    const narration = `${state.issuer?.name || 'Supplier'}, invoice ${state.invoiceNo || ''}`;
    const currency = state.currency || 'USD';
    const invoiceAmount = Number(state.totalPriceTaxIncl || 0);

    // Fetch exchange rates (now hardcoded to 1)
    const [rateOnIssue, rateOnPayment] = await Promise.all([
      getExchangeRate(dateIssued, currency, 'CHF'),
      getExchangeRate(datePaid, currency, 'CHF')
    ]);

    const amountAtIssue = invoiceAmount * rateOnIssue;
    const amountAtPayment = invoiceAmount * rateOnPayment;
    const realisedGain = amountAtPayment - amountAtIssue;

    // Debug logs
    console.log('--- Currency Gain Calculation ---');
    console.log('Invoice No:', state.invoiceNo);
    console.log('Currency:', currency);
    console.log('Invoice Amount:', invoiceAmount);
    console.log('Date Issued:', dateIssued, 'Rate on Issue:', rateOnIssue, 'Amount at Issue (CHF):', amountAtIssue);
    console.log('Date Paid:', datePaid, 'Rate on Payment:', rateOnPayment, 'Amount at Payment (CHF):', amountAtPayment);
    console.log('Realised Gain:', realisedGain);

    if (!datePaid || datePaid == '') {
      // Unpaid: use dateIssued and CHF at issue date, no currency gain/loss
      if (amountAtIssue) {
        rows.push([
          narration,
          dateIssued,
          'Accounts Payable',
          '802',
          'Tax Exempt (0%)',
          `-${amountAtIssue.toFixed(2)}`,
          currency,
          rateOnIssue.toString(),
          '', '', '', ''
        ]);
      }
      items.forEach((item: any) => {
        const expenseTag = (item.lineItemTag || []).find(
          (tag: any) => tag.dimension === "xero-expense-account"
        );
        const description = expenseTag ? (expenseTag.label || item.description || '') : (item.description || '');
        const accountCode = expenseTag ? (expenseTag.value?.toString() || item.accountCode?.toString() || '') : '';
        const taxRate = expenseTag ? 'Tax Exempt (0%)' : '';
        const itemAmount = (item.totalPriceTaxIncl || 0) * rateOnIssue;
        rows.push([
          narration,
          dateIssued,
          description,
          accountCode,
          taxRate,
          itemAmount.toFixed(2),
          currency,
          rateOnIssue.toString(),
          '', '', '', ''
        ]);
      });
    } else {
      // Paid: use datePaid and CHF at payment date, include currency gain/loss
      if (amountAtPayment) {
        rows.push([
          narration,
          datePaid,
          'Accounts Payable',
          '802',
          'Tax Exempt (0%)',
          `-${amountAtPayment.toFixed(2)}`,
          currency,
          rateOnPayment.toString(),
          '', '', state.txnHash || '', ''
        ]);
      }
      items.forEach((item: any) => {
        const expenseTag = (item.lineItemTag || []).find(
          (tag: any) => tag.dimension === "xero-expense-account"
        );
        const description = expenseTag ? (expenseTag.label || item.description || '') : (item.description || '');
        const accountCode = expenseTag ? (expenseTag.value?.toString() || item.accountCode?.toString() || '') : '';
        const taxRate = expenseTag ? 'Tax Exempt (0%)' : '';
        const itemAmount = (item.totalPriceTaxIncl || 0) * rateOnPayment;
        rows.push([
          narration,
          datePaid,
          description,
          accountCode,
          taxRate,
          itemAmount.toFixed(2),
          currency,
          rateOnPayment.toString(),
          '', '', state.txnHash || '', ''
        ]);
      });
      if (Math.abs(realisedGain) > 0.01) {
        rows.push([
          narration,
          datePaid,
          'Realised Currency Gains',
          '499',
          'Tax Exempt (0%)',
          realisedGain.toFixed(2),
          currency,
          rateOnPayment.toString(),
          '', '', state.txnHash || '', ''
        ]);
      }
    }
  }

  const csvLines = [headers.join(',')].concat(rows.map(row => row.map(value => `"${value}"`).join(',')));
  const csvData = csvLines.join('\n');

  // Download logic (browser)
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `xero-invoice-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

}

