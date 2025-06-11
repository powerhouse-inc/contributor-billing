function transformInvoicesToXeroCSV(invoices: any[]): string {
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
    'TrackingOption2'
  ];

  const rows: string[][] = [];

  invoices.forEach((invoice) => {
    console.log('invoice:', invoice);
    const items = invoice.lineItems || [];
    const date = invoice.dateIssued || '';
    const narration = `${invoice.issuer?.name || 'Supplier'}, invoice ${invoice.invoiceNo || ''}`;

    const total = Number(invoice.totalPriceTaxIncl || 0);
    if (total) {
      rows.push([
        narration,
        date,
        'Accounts Payable',
        '802',
        'Tax Exempt (0%)',
        `-${total.toFixed(2)}`,
        '', '', '', ''
      ]);
    }

    items.forEach((item: any) => {
      rows.push([
        narration,
        date,
        item.lineItemTag?.[0]?.label || item.description || '',
        item.lineItemTag?.[0]?.value?.toString() || item.accountCode?.toString() || '',
        'Tax Exempt (0%)',
        (item.totalPriceTaxIncl || 0).toFixed(2),
        '', '', '', ''
      ]);
    });
  });

  const csvLines = [headers.join(',')].concat(rows.map(row => row.map(value => `"${value}"`).join(',')));
  return csvLines.join('\n');
}

export async function exportInvoicesToXeroCSV(selectedDocuments: any[]): Promise<void> {
  try {
    const csvData = transformInvoicesToXeroCSV(selectedDocuments);
    
    // Create and download the CSV file
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `xero-invoice-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export invoices:', error);
    throw error;
  }
}
