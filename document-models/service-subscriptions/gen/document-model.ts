import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Powerhouse",
    website: "https://www.powerhouse.inc/",
  },
  description:
    "Manage team service subscriptions to various vendors including billing, seats allocation with team member tracking, and subscription lifecycle management.",
  extension: "",
  id: "powerhouse/service-subscriptions",
  name: "ServiceSubscriptions",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          id: "vendors-module",
          name: "Vendors",
          description: "Manage vendor directory for service subscriptions",
          operations: [
            {
              id: "add-vendor-op",
              name: "ADD_VENDOR",
              description: "Add a new vendor to the directory",
              schema:
                "input AddVendorInput {\n  id: OID!\n  name: String!\n  website: URL\n  supportEmail: EmailAddress\n  supportUrl: URL\n}",
              template: "Add a new vendor to the directory",
              reducer:
                "state.vendors.push({\n  id: action.input.id,\n  name: action.input.name,\n  website: action.input.website || null,\n  supportEmail: action.input.supportEmail || null,\n  supportUrl: action.input.supportUrl || null\n});",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "update-vendor-op",
              name: "UPDATE_VENDOR",
              description: "Update an existing vendor",
              schema:
                "input UpdateVendorInput {\n  id: OID!\n  name: String\n  website: URL\n  supportEmail: EmailAddress\n  supportUrl: URL\n}",
              template: "Update an existing vendor",
              reducer:
                "const vendor = state.vendors.find(v => v.id === action.input.id);\nif (!vendor) return;\nif (action.input.name) vendor.name = action.input.name;\nif (action.input.website) vendor.website = action.input.website;\nif (action.input.supportEmail) vendor.supportEmail = action.input.supportEmail;\nif (action.input.supportUrl) vendor.supportUrl = action.input.supportUrl;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "delete-vendor-op",
              name: "DELETE_VENDOR",
              description: "Remove a vendor from the directory",
              schema: "input DeleteVendorInput {\n  id: OID!\n}",
              template: "Remove a vendor from the directory",
              reducer:
                "const vendorIndex = state.vendors.findIndex(v => v.id === action.input.id);\nif (vendorIndex === -1) return;\nstate.vendors.splice(vendorIndex, 1);",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
        {
          id: "categories-module",
          name: "Categories",
          description: "Manage subscription categories for organization",
          operations: [
            {
              id: "add-category-op",
              name: "ADD_CATEGORY",
              description: "Add a new category for organizing subscriptions",
              schema:
                "input AddCategoryInput {\n  id: OID!\n  name: String!\n  description: String\n}",
              template: "Add a new category for organizing subscriptions",
              reducer:
                "state.categories.push({\n  id: action.input.id,\n  name: action.input.name,\n  description: action.input.description || null\n});",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "update-category-op",
              name: "UPDATE_CATEGORY",
              description: "Update an existing category",
              schema:
                "input UpdateCategoryInput {\n  id: OID!\n  name: String\n  description: String\n}",
              template: "Update an existing category",
              reducer:
                "const category = state.categories.find(c => c.id === action.input.id);\nif (!category) return;\nif (action.input.name) category.name = action.input.name;\nif (action.input.description) category.description = action.input.description;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "delete-category-op",
              name: "DELETE_CATEGORY",
              description: "Remove a category",
              schema: "input DeleteCategoryInput {\n  id: OID!\n}",
              template: "Remove a category",
              reducer:
                "const categoryIndex = state.categories.findIndex(c => c.id === action.input.id);\nif (categoryIndex === -1) return;\nstate.categories.splice(categoryIndex, 1);",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
        {
          id: "subscriptions-module",
          name: "Subscriptions",
          description:
            "Manage service subscriptions including billing, status, and seat assignments",
          operations: [
            {
              id: "add-subscription-op",
              name: "ADD_SUBSCRIPTION",
              description: "Add a new service subscription",
              schema:
                "input SeatsAllocationInput {\n  total: Int!\n  assignedMembers: [PHID!]!\n}\n\ninput AddSubscriptionInput {\n  id: OID!\n  name: String!\n  vendorId: OID!\n  categoryId: OID\n  billingCycle: BillingCycle!\n  amount: Amount_Money\n  currency: Currency\n  nextBillingDate: Date\n  status: SubscriptionStatus!\n  startDate: Date\n  endDate: Date\n  autoRenew: Boolean\n  planName: String\n  seats: SeatsAllocationInput\n  accountEmail: EmailAddress\n  accountOwner: String\n  loginUrl: URL\n  notes: String\n  tags: [String!]\n}",
              template: "Add a new service subscription",
              reducer:
                "state.subscriptions.push({\n  id: action.input.id,\n  name: action.input.name,\n  vendorId: action.input.vendorId,\n  categoryId: action.input.categoryId || null,\n  billingCycle: action.input.billingCycle,\n  amount: action.input.amount || null,\n  currency: action.input.currency || null,\n  nextBillingDate: action.input.nextBillingDate || null,\n  status: action.input.status,\n  startDate: action.input.startDate || null,\n  endDate: action.input.endDate || null,\n  autoRenew: action.input.autoRenew || null,\n  planName: action.input.planName || null,\n  seats: action.input.seats ? {\n    total: action.input.seats.total,\n    assignedMembers: action.input.seats.assignedMembers || []\n  } : null,\n  accountEmail: action.input.accountEmail || null,\n  accountOwner: action.input.accountOwner || null,\n  loginUrl: action.input.loginUrl || null,\n  notes: action.input.notes || null,\n  tags: action.input.tags || []\n});",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "update-subscription-op",
              name: "UPDATE_SUBSCRIPTION",
              description: "Update an existing subscription's details",
              schema:
                "input UpdateSubscriptionInput {\n  id: OID!\n  name: String\n  vendorId: OID\n  categoryId: OID\n  billingCycle: BillingCycle\n  amount: Amount_Money\n  currency: Currency\n  nextBillingDate: Date\n  startDate: Date\n  endDate: Date\n  autoRenew: Boolean\n  planName: String\n  accountEmail: EmailAddress\n  accountOwner: String\n  loginUrl: URL\n  notes: String\n  tags: [String!]\n}",
              template: "Update an existing subscription's details",
              reducer:
                "const subscription = state.subscriptions.find(s => s.id === action.input.id);\nif (!subscription) return;\nif (action.input.name) subscription.name = action.input.name;\nif (action.input.vendorId) subscription.vendorId = action.input.vendorId;\nif (action.input.categoryId) subscription.categoryId = action.input.categoryId;\nif (action.input.billingCycle) subscription.billingCycle = action.input.billingCycle;\nif (action.input.amount) subscription.amount = action.input.amount;\nif (action.input.currency) subscription.currency = action.input.currency;\nif (action.input.nextBillingDate) subscription.nextBillingDate = action.input.nextBillingDate;\nif (action.input.startDate) subscription.startDate = action.input.startDate;\nif (action.input.endDate) subscription.endDate = action.input.endDate;\nif (action.input.autoRenew !== undefined && action.input.autoRenew !== null) subscription.autoRenew = action.input.autoRenew;\nif (action.input.planName) subscription.planName = action.input.planName;\nif (action.input.accountEmail) subscription.accountEmail = action.input.accountEmail;\nif (action.input.accountOwner) subscription.accountOwner = action.input.accountOwner;\nif (action.input.loginUrl) subscription.loginUrl = action.input.loginUrl;\nif (action.input.notes) subscription.notes = action.input.notes;\nif (action.input.tags) subscription.tags = action.input.tags;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "update-subscription-status-op",
              name: "UPDATE_SUBSCRIPTION_STATUS",
              description: "Update a subscription's status",
              schema:
                "input UpdateSubscriptionStatusInput {\n  id: OID!\n  status: SubscriptionStatus!\n}",
              template: "Update a subscription's status",
              reducer:
                "const subscription = state.subscriptions.find(s => s.id === action.input.id);\nif (!subscription) return;\nsubscription.status = action.input.status;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "delete-subscription-op",
              name: "DELETE_SUBSCRIPTION",
              description: "Remove a subscription",
              schema: "input DeleteSubscriptionInput {\n  id: OID!\n}",
              template: "Remove a subscription",
              reducer:
                "const subscriptionIndex = state.subscriptions.findIndex(s => s.id === action.input.id);\nif (subscriptionIndex === -1) return;\nstate.subscriptions.splice(subscriptionIndex, 1);",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "set-total-seats-op",
              name: "SET_TOTAL_SEATS",
              description: "Set the total number of seats for a subscription",
              schema:
                "input SetTotalSeatsInput {\n  subscriptionId: OID!\n  total: Int!\n}",
              template: "Set the total number of seats for a subscription",
              reducer:
                "const subscription = state.subscriptions.find(s => s.id === action.input.subscriptionId);\nif (!subscription) return;\nif (!subscription.seats) {\n  subscription.seats = { total: action.input.total, assignedMembers: [] };\n} else {\n  subscription.seats.total = action.input.total;\n}",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "assign-member-op",
              name: "ASSIGN_MEMBER",
              description: "Assign a team member to a subscription seat",
              schema:
                "input AssignMemberInput {\n  subscriptionId: OID!\n  memberId: PHID!\n}",
              template: "Assign a team member to a subscription seat",
              reducer:
                "const subscription = state.subscriptions.find(s => s.id === action.input.subscriptionId);\nif (!subscription) return;\nif (!subscription.seats) return;\nif (subscription.seats.assignedMembers.includes(action.input.memberId)) return;\nif (subscription.seats.assignedMembers.length >= subscription.seats.total) return;\nsubscription.seats.assignedMembers.push(action.input.memberId);",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "unassign-member-op",
              name: "UNASSIGN_MEMBER",
              description: "Remove a team member from a subscription seat",
              schema:
                "input UnassignMemberInput {\n  subscriptionId: OID!\n  memberId: PHID!\n}",
              template: "Remove a team member from a subscription seat",
              reducer:
                "const subscription = state.subscriptions.find(s => s.id === action.input.subscriptionId);\nif (!subscription) return;\nif (!subscription.seats) return;\nconst memberIndex = subscription.seats.assignedMembers.indexOf(action.input.memberId);\nif (memberIndex === -1) return;\nsubscription.seats.assignedMembers.splice(memberIndex, 1);",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
      ],
      state: {
        global: {
          examples: [],
          initialValue: '{"subscriptions":[],"vendors":[],"categories":[]}',
          schema:
            "enum BillingCycle {\n  MONTHLY\n  QUARTERLY\n  ANNUAL\n  BIENNIAL\n  ONE_TIME\n  USAGE_BASED\n}\n\nenum SubscriptionStatus {\n  ACTIVE\n  TRIAL\n  PENDING\n  PAUSED\n  CANCELLED\n  EXPIRED\n}\n\ntype SeatsAllocation {\n  total: Int!\n  assignedMembers: [PHID!]!\n}\n\ntype ServiceSubscription {\n  id: OID!\n  name: String!\n  vendorId: OID!\n  categoryId: OID\n  billingCycle: BillingCycle!\n  amount: Amount_Money\n  currency: Currency\n  nextBillingDate: Date\n  status: SubscriptionStatus!\n  startDate: Date\n  endDate: Date\n  autoRenew: Boolean\n  planName: String\n  seats: SeatsAllocation\n  accountEmail: EmailAddress\n  accountOwner: String\n  loginUrl: URL\n  notes: String\n  tags: [String!]!\n}\n\ntype Vendor {\n  id: OID!\n  name: String!\n  website: URL\n  supportEmail: EmailAddress\n  supportUrl: URL\n}\n\ntype Category {\n  id: OID!\n  name: String!\n  description: String\n}\n\ntype ServiceSubscriptionsState {\n  subscriptions: [ServiceSubscription!]!\n  vendors: [Vendor!]!\n  categories: [Category!]!\n}",
        },
        local: {
          examples: [],
          initialValue: "",
          schema: "",
        },
      },
      version: 1,
    },
  ],
};
