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
    const key = process.env.FREECURRENCY_API_KEY || '';
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
 * Fetches the exchange rate from `from` currency to `to` currency for a given date.
 * Uses the /latest endpoint for today's date and /historical for past dates.
 */
export async function getExchangeRate(date: string, from: string, to: string): Promise<number> {
  if (!date || !from || !to || from === to) return 1;

  const formattedDate = date.split('T')[0];
  
  const today = new Date();
  const requestDate = new Date(formattedDate);
  
  today.setHours(0, 0, 0, 0);
  requestDate.setHours(0, 0, 0, 0);

  console.log(today,requestDate)

  // Prevent API calls for future dates
  if (requestDate > today) {
    console.warn(`Attempted to fetch exchange rate for a future date (${formattedDate}). Returning 1.`);
    return 1;
  }
  
  const isToday = requestDate.getTime() === today.getTime();
  const cacheKey = isToday ? `latest|${from}|${to}` : `${formattedDate}|${from}|${to}`;

  if (exchangeRateCache[cacheKey] !== undefined) {
    return exchangeRateCache[cacheKey];
  }

  try {
    const FREECURRENCY_API_KEY = getFreeCurrencyApiKey();
    let url = '';

    if (isToday) {
      url = `https://api.freecurrencyapi.com/v1/latest?apikey=${FREECURRENCY_API_KEY}&base_currency=${from}&currencies=${to}`;
    } else {
      url = `https://api.freecurrencyapi.com/v1/historical?apikey=${FREECURRENCY_API_KEY}&base_currency=${from}&currencies=${to}&date=${formattedDate}`;
    }

    console.log('Fetching from URL:', url);
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch exchange rate for ${formattedDate}: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    let rate: number | undefined;

    if (isToday) {
      rate = data?.data?.[to];
    } else {
      rate = data?.data?.[formattedDate]?.[to];
    }

    if (typeof rate !== 'number') {
      throw new Error(`Exchange rate for ${to} on ${formattedDate} not found in response`);
    }

    exchangeRateCache[cacheKey] = rate;
    return rate;
  } catch (err) {
    console.error('ForEx API error:', err);
    return 1; // Fallback to 1:1 on error
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
    'TrackingName1',
    'TrackingOption1',
    'TrackingName2',
    'TrackingOption2',
    'Invoice currency',
    'FX Rate Used',
  ];

  const allRows: string[][] = [];
  const exportDataByInvoice: Record<string, { exportTimestamp: string, exportedLines: string[][] }> = {};
  const exportTimestamp = new Date().toISOString();
  const missingExpenseTagInvoices: string[] = [];

  for (let state of invoiceStates) {
    console.log(state);
    state = state.global;
    console.log(state);
    const invoiceId = state.id || Math.random().toString(36).slice(2); // fallback if no id
    const invoiceName = state.invoiceNo || state.name || invoiceId;
    const items = state.lineItems || [];
    const dateIssued = state.dateIssued || '';
    let datePaid = state.paymentDate || '';
    if (datePaid.includes('T')) {
      datePaid = datePaid.split('T')[0];
    }
    const narration = `${state.issuer?.name || 'Supplier'}, invoice ${state.invoiceNo || ''}`;
    const currency = state.currency || 'USD';
    const invoiceAmount = Number(state.totalPriceTaxIncl || 0);

    let effectiveCurrency = currency;
    if (currency === 'DAI' || currency === 'USDS') {
      effectiveCurrency = 'USD';
    }

    // Check if any line item is missing a valid xero-expense-account tag
    const hasMissingExpenseTag = items.some((item: any) => {
      const expenseTag = (item.lineItemTag || []).find(
        (tag: any) => tag.dimension === "xero-expense-account"
      );
      return !expenseTag || !expenseTag.label;
    });

    if (hasMissingExpenseTag) {
      missingExpenseTagInvoices.push(invoiceName);
      continue; // Skip this invoice entirely
    }

    // Fetch exchange rates
    const [rateOnIssue, rateOnPayment] = await Promise.all([
      getExchangeRate(dateIssued, effectiveCurrency, 'CHF'),
      getExchangeRate(datePaid, effectiveCurrency, 'CHF')
    ]);

    const amountAtIssue = invoiceAmount * rateOnIssue;
    const amountAtPayment = invoiceAmount * rateOnPayment;
    const realisedGain = amountAtPayment - amountAtIssue;

    // Collect rows for this invoice
    const invoiceRows: string[][] = [];

    // --- ISSUE DATE JOURNALS ---
    if (amountAtIssue) {
      invoiceRows.push([
        narration,
        dateIssued,
        'Accounts Payable',
        '802',
        'Tax Exempt (0%)',
        `-${amountAtIssue.toFixed(2)}`,
        '', '', '', '',
        currency,
        rateOnIssue.toString()
      ]);
    }
    items.forEach((item: any) => {
      const expenseTag = (item.lineItemTag || []).find(
        (tag: any) => tag.dimension === "xero-expense-account"
      );
      const description = expenseTag.label;
      const accountCode = expenseTag.value?.toString() || item.accountCode?.toString() || '';
      const taxRate = 'Tax Exempt (0%)';
      const itemAmount = (item.totalPriceTaxIncl || 0) * rateOnIssue;
      invoiceRows.push([
        narration,
        dateIssued,
        description,
        accountCode,
        taxRate,
        itemAmount.toFixed(2),
        '', '', '', '',
        currency,
        rateOnIssue.toString()
      ]);
    });

    // --- PAYMENT DATE JOURNALS (commented out) ---
    /*
    if (datePaid && amountAtPayment) {
      // Accounts Payable (positive, at payment date)
      rows.push([
        narration,
        datePaid,
        'Accounts Payable',
        '802',
        'Tax Exempt (0%)',
        amountAtIssue.toFixed(2),
        '', '', state.txnHash || '', '',
        currency,
        rateOnPayment.toString()
      ]);
      // Wallet DAI (negative, at payment date)
      rows.push([
        narration,
        datePaid,
        'Wallet DAI',
        '',
        'Tax Exempt (0%)',
        -amountAtPayment.toFixed(2),
        '', '', state.txnHash || '', '',
        currency,
        rateOnPayment.toString()
      ]);
      // Realised Currency Gains (if any, at payment date)
      if (Math.abs(realisedGain) > 0.01) {
        rows.push([
          narration,
          datePaid,
          'Realised Currency Gains',
          '499',
          'Tax Exempt (0%)',
          realisedGain.toFixed(2),
          '', '', state.txnHash || '', '',
          currency,
          rateOnPayment.toString()
        ]);
      }
    }
    */

    // Add to allRows for CSV download
    allRows.push(...invoiceRows);

    // Store export data for this invoice
    exportDataByInvoice[invoiceId] = {
      exportTimestamp,
      exportedLines: [headers, ...invoiceRows]
    };

    // Optionally, assign to the invoice state here if you want to mutate it directly:
    // state.exportData = exportDataByInvoice[invoiceId];

    // Debug logs
    console.log('--- Currency Gain Calculation ---');
    console.log('Invoice No:', state.invoiceNo);
    console.log('Currency:', currency);
    console.log('Invoice Amount:', invoiceAmount);
    console.log('Date Issued:', dateIssued, 'Rate on Issue:', rateOnIssue, 'Amount at Issue (CHF):', amountAtIssue);
    console.log('Date Paid:', datePaid, 'Rate on Payment:', rateOnPayment, 'Amount at Payment (CHF):', amountAtPayment);
    console.log('Realised Gain:', realisedGain);
  }

  // If any invoices are missing expense tags, throw an error
  if (missingExpenseTagInvoices.length > 0) {
    throw new Error(
      `The following invoices have line items missing a 'xero-expense-account' tag: ${[...new Set(missingExpenseTagInvoices)].join(', ')}`
    );
  }

  // Download CSV for all invoices
  const csvLines = [headers.join(',')].concat(allRows.map(row => row.map(value => `"${value}"`).join(',')));
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

  // Return or assign exportDataByInvoice as needed
  // For example, return it if you want to use it elsewhere:
  // return exportDataByInvoice;
}

