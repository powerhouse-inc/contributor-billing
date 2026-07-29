---
summary: Complete user flow map for the contributor billing drive app — setup, monthly cycles, invoice management, billing statements, expense reports, and reporting
type: context
created: 2026-03-25
status: active
---

# contributor billing drive app user flow

The contributor billing drive editor (`editors/contributor-billing/`) is a document-drive editor that manages the full billing lifecycle for an operational hub. It orchestrates multiple document types through a folder-based monthly structure.

## Drive Structure

```
Drive Root/
├── Operational Hub Profile        ← org identity (powerhouse/operational-hub-profile)
├── Accounts                       ← bank accounts, wallets (powerhouse/accounts)
├── Account Transactions           ← linked from accounts (powerhouse/account-transactions)
└── Billing/
    ├── January 2026/
    │   ├── Payments/              ← invoices + billing statements
    │   └── Reporting/             ← expense reports + snapshot reports
    ├── February 2026/
    │   ├── Payments/
    │   └── Reporting/
    └── ...
```

## Phase 1: Initial Setup (DashboardHome)

When the drive is empty, the dashboard shows setup steps:

1. **Create Hub Profile** — `addDocument()` with type `powerhouse/operational-hub-profile`. User enters hub name, it becomes the org identity.
2. **Create Accounts Doc** — `addDocument()` with type `powerhouse/accounts`. Auto-created on first visit via FolderTree. Tracks bank accounts, wallets, and their transactions.
3. **Create Billing Folder** — `createBillingFolder()` via `addFolder(driveId, "Billing")`. Root for all monthly billing activity.

## Phase 2: Monthly Cycle Setup

4. **Add Month** — `createMonthFolder(monthName)` creates the month folder with Payments/ and Reporting/ subfolders. Current month auto-created. Additional months via AddMonthButton.

## Phase 3: Invoice Management (Payments folder)

5. **Create Invoice** — Via InvoiceTableSection "Create Invoice" button → `addDocument()` with type `powerhouse/invoice` in the Payments folder.
6. **Upload Invoice** — Drag `.phd` file onto DocumentDropZone → `useDocumentAutoPlacement` reads `dateIssued` → auto-moves to correct month's Payments folder.
7. **Invoice Status Flow** — Statuses displayed as collapsible sections: DRAFT → ISSUED → ACCEPTED → PAYMENT_SCHEDULED → PAYMENT_SENT → PAYMENT_CLOSED (or PAYMENT_ISSUE / REJECTED). Status changes happen in the invoice editor.

## Phase 4: Billing Statement Generation

8. **Generate Billing Statement** — Per-invoice "Generate" button calls `handleCreateBillingStatement(invoiceId)`:
   - Creates billing statement doc in same Payments folder
   - Dispatches: `editContributor`, `editBillingStatement` (dates, currency, notes)
   - Adds line items from invoice via `addLineItem`
   - Maps and adds tags via `editLineItemTag` using `mapTags()`
9. **Batch Generate Bills** — HeaderControls batch action for multiple selected invoices.

## Phase 5: Expense Report Creation

10. **Create Expense Report** — `handleCreateExpenseReport()`:
    - Creates in the Reporting folder (sibling of Payments)
    - Auto-sets reporting period via `setPeriodStart` and `setPeriodEnd`
    - Named as "MM-YYYY Expense Report N"
11. **Export to Xero CSV** — Downloads CSV, then marks invoices exported via `setExportedData`.
12. **Expense Report CSV Export** — Downloads expense report format CSV from selected invoices.

## Phase 6: Reporting (Reporting folder)

13. **Monthly Reports Overview** — `useMonthlyReports()` aggregates expense reports + snapshot reports per month by folder location or name match. Shows status: DRAFT/REVIEW/FINAL.
14. **Snapshot Reports** — Auto-placed to Reporting folder via `useDocumentAutoPlacement` based on `reportPeriodStart`. Created externally from accounts/transactions data.

## Key Dispatchers

| Action | Dispatcher | Document Type |
|--------|-----------|---------------|
| Create hub profile | `addDocument(..., "powerhouse/operational-hub-profile")` | operational-hub-profile |
| Create accounts | `addDocument(..., "powerhouse/accounts")` | accounts |
| Create invoice | `addDocument(..., "powerhouse/invoice")` | invoice |
| Create billing statement | `addDocument()` + `dispatchActions([editContributor, editBillingStatement, addLineItem*, editLineItemTag*])` | billing-statement |
| Create expense report | `addDocument()` + `dispatchActions([setPeriodStart, setPeriodEnd])` | expense-report |
| Export to CSV | `exportInvoicesToXeroCSV()` + `dispatchActions([setExportedData])` | invoice |
| Delete documents | `dispatchActions(deleteNode({id}), driveId)` | document-drive |
| Create folders | `addFolder(driveId, name, parentId)` | document-drive |
| Move documents | `onMoveNode(fileNode, targetFolder)` | document-drive |

## Auto-Placement Rules

| Document Type | Date Field Used | Target Folder |
|--------------|----------------|---------------|
| `powerhouse/invoice` | `dateIssued` | `Billing/{Month}/Payments/` |
| `powerhouse/billing-statement` | `dateIssued` | `Billing/{Month}/Payments/` |
| `powerhouse/expense-report` | `periodStart` | `Billing/{Month}/Reporting/` |
| `powerhouse/snapshot-report` | `reportPeriodStart` | `Billing/{Month}/Reporting/` |

## Key Hooks

- **useBillingFolderStructure** — manages Billing/ folder tree, creates month folders with Payments/Reporting subfolders
- **useDocumentAutoPlacement** — watches for new documents, moves them to correct folder based on date fields
- **useMonthlyReports** — aggregates reports by month for the overview dashboard

---

Relevant Insights:
- [[cross-document-subscriptions-enable-reactive-automation]] — the invoice→billing-statement→expense-report chain is a natural fit for reactive automation
- [[reactor-patterns]] — recipe patterns that could enhance this flow

Topics:
- [[billing workflow]]
