---
summary: Complete user flow map for the builder team admin drive app — profile setup, team members, service offerings, subscriptions, expense reports, and snapshot reports
type: context
created: 2026-03-25
status: active
---

# builder team admin drive app user flow

The builder team admin drive editor (`editors/builder-team-admin/`) manages a builder/operator team's profile, contributors, service catalog, subscriptions, and reporting. Unlike the contributor billing app which is month-based, this app uses category-based folder organization with year subfolders for reports.

## Drive Structure

```
Drive Root/
├── Builder Profile                    ← powerhouse/builder-profile (singleton)
├── Expense Reports/
│   ├── 2025/                          ← year subfolders
│   │   └── expense-report docs
│   └── 2026/
├── Snapshot Reports/
│   ├── 2025/
│   └── 2026/
├── Service Subscriptions/
│   ├── resource-instance docs
│   └── subscription-instance docs
└── Services And Offerings/            ← only if isOperator
    ├── Products/                      ← resource-template docs
    └── Service Offerings/             ← service-offering docs
```

## Phase 1: Initial Setup (DriveExplorer)

When the drive has no builder profile, a creation form is shown:

1. **Create Builder Profile** — User enters name → `addDocument(driveId, name, "powerhouse/builder-profile")` → dispatches `updateProfile({name, slug, code})` + `setName()`. Slug is auto-generated (lowercase, hyphenated), code is an acronym (e.g., "Powerhouse" → "PW").

After creation, the sidebar renders with 5-6 sections depending on `isOperator` flag.

## Phase 2: Sidebar Navigation

Fixed sections (not folder-based like contributor-billing):

| Section | View Type | Condition |
|---------|-----------|-----------|
| Builder/Operator Profile | Document editor | Always |
| Team Members | Custom component | Always |
| Service Subscriptions | Custom component | Always |
| Service Offerings | Custom component | Only if `isOperator === true` |
| Expense Reports | Custom component | Always |
| Snapshot Reports | Custom component | Always |

## Phase 3: Team Members Management

2. **View/Edit Contributors** — `ContributorsSection` with `ObjectSetTable`.
3. **Add Contributor** — PHID lookup: searches builder profiles across local drives, falls back to remote. Dispatches `addContributor({contributorPHID})`.
4. **Remove Contributor** — Dispatches `removeContributor({contributorPHID})`.

## Phase 4: Service Offerings (Operator only)

Visible only when `isOperator === true` in builder profile state. Auto-created via `useResourcesServicesAutoPlacement`.

5. **Create Products** — `addDocument()` with type `powerhouse/resource-template` in Products folder.
6. **Create Service Offerings** — `addDocument()` with type `powerhouse/service-offering` in Service Offerings folder.
7. **Migration** — Hook detects old folder structures and auto-migrates documents, deletes empty old folders.

## Phase 5: Service Subscriptions

Auto-created via `useServiceSubscriptionAutoPlacement`.

8. **Create Resource Instance** — Quick-create button → `addDocument()` with type `powerhouse/resource-instance`.
9. **Create Subscription Instance** — Quick-create button → `addDocument()` with type `powerhouse/subscription-instance`.
10. **Auto-placement** — Documents of these types found outside the folder are auto-moved in.

## Phase 6: Expense Reports

Auto-created via `useExpenseReportAutoPlacement` with year-based subfolders.

11. **Create Expense Report** — Via document creation modal.
12. **Auto-placement** — Reports auto-moved to year subfolder based on `periodStart`.
13. **Stats** — `ExpenseReportsStats` shows line chart of actuals over time, total amounts, date ranges.

## Phase 7: Snapshot Reports

Auto-created via `useSnapshotReportAutoPlacement` with year-based subfolders.

14. **Auto-placement** — Reports auto-moved to year subfolder based on `startDate`.

## Phase 8: Overview Dashboard (DriveContents)

When no section is selected:
- **ProfileHeader** — Avatar, name, slug from builder profile
- **TeamMembersOverview** — Horizontal avatar row of first 6 contributors with "+N more"
- **ExpenseReportsStats** — Line chart + summary stats (when expense reports exist)

## Key Dispatchers

| Action | Dispatcher | Document Type |
|--------|-----------|---------------|
| Create builder profile | `addDocument()` + `dispatchActions([updateProfile({name, slug, code}), setName()])` | builder-profile |
| Add contributor | `dispatchActions(addContributor({contributorPHID}))` | builder-profile |
| Remove contributor | `dispatchActions(removeContributor({contributorPHID}))` | builder-profile |
| Create resource template | `addDocument(..., "powerhouse/resource-template", productsFolder)` | resource-template |
| Create service offering | `addDocument(..., "powerhouse/service-offering", serviceOfferingsFolder)` | service-offering |
| Create resource instance | `addDocument(..., "powerhouse/resource-instance")` | resource-instance |
| Create subscription instance | `addDocument(..., "powerhouse/subscription-instance")` | subscription-instance |
| Create expense report | `addDocument(..., "powerhouse/expense-report")` | expense-report |
| Create folders | `addFolder(driveId, name, parentId)` | document-drive |
| Move documents | `onMoveNode(fileNode, targetFolder)` | document-drive |

## Auto-Placement Rules

| Document Type | Date Field Used | Target Folder |
|--------------|----------------|---------------|
| `powerhouse/expense-report` | `periodStart` → year | `Expense Reports/{year}/` |
| `powerhouse/snapshot-report` | `startDate` → year | `Snapshot Reports/{year}/` |
| `powerhouse/resource-instance` | — | `Service Subscriptions/` |
| `powerhouse/subscription-instance` | — | `Service Subscriptions/` |
| `powerhouse/resource-template` | — | `Services And Offerings/Products/` (migration) |
| `powerhouse/service-offering` | — | `Services And Offerings/Service Offerings/` (migration) |

## Key Differences from Contributor Billing

| Aspect | Contributor Billing | Builder Team Admin |
|--------|--------------------|--------------------|
| Entry gate | Hub profile creation | Builder profile creation |
| Folder structure | Monthly (Billing/Month/Payments+Reporting) | Category-based (type/Year) |
| Invoice management | Full invoice table with status sections | No invoices |
| Billing statements | Generated from invoices | No billing statements |
| Team members | Not managed | PHID-based contributor management |
| Service offerings | Not managed | Products + Service Offerings (operator only) |
| Subscriptions | Not managed | Resource + Subscription instances |
| CSV export | Xero CSV + Expense Report CSV | No exports |
| isOperator flag | Not used | Controls Service Offerings visibility |

---

Relevant Insights:
- [[contributor-billing-drive-app-user-flow]] — the other drive app this complements, handling the payment/billing side
- [[cross-document-subscriptions-enable-reactive-automation]] — team member PHID lookup across drives is a cross-document pattern

Topics:
- [[billing workflow]]
