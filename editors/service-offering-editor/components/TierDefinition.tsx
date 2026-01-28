import { useState, useEffect } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  ServiceOfferingDocument,
  ServiceOfferingAction,
  ServiceSubscriptionTier,
  BillingCycle,
} from "@powerhousedao/contributor-billing/document-models/service-offering";
import {
  addTier,
  updateTier,
  deleteTier,
  addTierPricingOption,
  updateTierPricingOption,
  removeTierPricingOption,
} from "../../../document-models/service-offering/gen/creators.js";

interface TierDefinitionProps {
  document: ServiceOfferingDocument;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
}

// Calculate price per month for mental accounting display
const BILLING_CYCLE_MONTHS: Record<BillingCycle, number> = {
  MONTHLY: 1,
  QUARTERLY: 3,
  SEMI_ANNUAL: 6,
  ANNUAL: 12,
  ONE_TIME: 1,
};

// Determine which tier should show "Most Popular" badge
// Uses middle-tier heuristic (Good-Better-Best psychology)
function getRecommendedTierIndex(tiers: ServiceSubscriptionTier[]): number {
  if (tiers.length < 2) return -1;
  if (tiers.length === 2) return 1; // Second tier for 2-tier setup
  // For 3+ tiers, recommend the middle tier (or middle-right for even counts)
  return Math.floor(tiers.length / 2);
}

const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "MONTHLY", label: "Month" },
  { value: "QUARTERLY", label: "Quarter" },
  { value: "SEMI_ANNUAL", label: "6 Months" },
  { value: "ANNUAL", label: "Year" },
  { value: "ONE_TIME", label: "One Time" },
];

const TIER_ACCENTS = [
  {
    color: "var(--so-emerald-500)",
    bg: "var(--so-emerald-50)",
    name: "emerald",
  },
  { color: "var(--so-violet-500)", bg: "var(--so-violet-50)", name: "violet" },
  { color: "var(--so-amber-500)", bg: "var(--so-amber-50)", name: "amber" },
  { color: "var(--so-sky-500)", bg: "var(--so-sky-50)", name: "sky" },
  { color: "var(--so-rose-500)", bg: "var(--so-rose-50)", name: "rose" },
];

// Tier Presets - Default Effect & Activation Energy Reduction
interface TierPreset {
  name: string;
  description: string;
  icon: string;
  tiers: Array<{
    name: string;
    amount: number | null;
    billingCycle: BillingCycle;
    isCustomPricing: boolean;
  }>;
}

const TIER_PRESETS: TierPreset[] = [
  {
    name: "Standard 3-Tier",
    description: "Basic → Professional → Enterprise",
    icon: "📊",
    tiers: [
      {
        name: "Basic",
        amount: 99,
        billingCycle: "MONTHLY",
        isCustomPricing: false,
      },
      {
        name: "Professional",
        amount: 299,
        billingCycle: "MONTHLY",
        isCustomPricing: false,
      },
      {
        name: "Enterprise",
        amount: null,
        billingCycle: "MONTHLY",
        isCustomPricing: true,
      },
    ],
  },
  {
    name: "Freemium Model",
    description: "Free → Pro → Business",
    icon: "🚀",
    tiers: [
      {
        name: "Free",
        amount: 0,
        billingCycle: "MONTHLY",
        isCustomPricing: false,
      },
      {
        name: "Pro",
        amount: 49,
        billingCycle: "MONTHLY",
        isCustomPricing: false,
      },
      {
        name: "Business",
        amount: 149,
        billingCycle: "MONTHLY",
        isCustomPricing: false,
      },
    ],
  },
  {
    name: "Simple 2-Tier",
    description: "Starter → Growth",
    icon: "⚡",
    tiers: [
      {
        name: "Starter",
        amount: 79,
        billingCycle: "MONTHLY",
        isCustomPricing: false,
      },
      {
        name: "Growth",
        amount: 199,
        billingCycle: "MONTHLY",
        isCustomPricing: false,
      },
    ],
  },
  {
    name: "Annual Focus",
    description: "Annual pricing with discounts",
    icon: "📅",
    tiers: [
      {
        name: "Essential",
        amount: 990,
        billingCycle: "ANNUAL",
        isCustomPricing: false,
      },
      {
        name: "Professional",
        amount: 2990,
        billingCycle: "ANNUAL",
        isCustomPricing: false,
      },
      {
        name: "Enterprise",
        amount: null,
        billingCycle: "ANNUAL",
        isCustomPricing: true,
      },
    ],
  },
];

const tierStyles = `
  .tier-def {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .tier-def__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  /* Tier Card */
  .tier-card {
    width: 320px;
    background: var(--so-white);
    border-radius: var(--so-radius-lg);
    box-shadow: var(--so-shadow-md);
    overflow: hidden;
    transition: var(--so-transition-base);
    animation: tier-slide-up 0.3s ease-out;
    position: relative;
  }

  .tier-card:hover {
    box-shadow: var(--so-shadow-lg);
    transform: translateY(-2px);
  }

  /* Popular/Recommended Tier - Social Proof */
  .tier-card--popular {
    border: 2px solid var(--so-violet-300);
    transform: scale(1.02);
    z-index: 1;
  }

  .tier-card--popular:hover {
    transform: scale(1.02) translateY(-2px);
  }

  .tier-card__popular-banner {
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.875rem;
    background: linear-gradient(135deg, var(--so-violet-600) 0%, var(--so-violet-700) 100%);
    color: white;
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
    z-index: 2;
  }

  .tier-card__popular-banner svg {
    width: 0.875rem;
    height: 0.875rem;
  }

  @keyframes tier-slide-up {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .tier-card__accent {
    height: 4px;
    width: 100%;
  }

  .tier-card__body {
    padding: 1.5rem;
  }

  .tier-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .tier-card__name-group {
    flex: 1;
  }

  .tier-card__label {
    display: block;
    font-family: var(--so-font-mono);
    font-size: 0.625rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--so-slate-400);
    margin-bottom: 0.375rem;
  }

  .tier-card__name-input {
    width: 100%;
    font-family: var(--so-font-sans);
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--so-slate-900);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0 0 0.25rem 0;
    transition: var(--so-transition-fast);
    outline: none;
  }

  .tier-card__name-input:hover {
    border-bottom-color: var(--so-slate-200);
  }

  .tier-card__name-input:focus {
    border-bottom-color: var(--so-violet-500);
  }

  .tier-card__delete-btn {
    padding: 0.375rem;
    color: var(--so-slate-400);
    background: transparent;
    border: none;
    border-radius: var(--so-radius-sm);
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .tier-card__delete-btn:hover {
    color: var(--so-rose-500);
    background: var(--so-rose-50);
  }

  /* Custom Pricing Badge */
  .tier-card__custom-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--so-amber-50);
    border: 1px solid var(--so-amber-200);
    border-radius: var(--so-radius-md);
    margin-bottom: 1rem;
  }

  .tier-card__custom-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--so-amber-600);
  }

  .tier-card__custom-text {
    flex: 1;
  }

  .tier-card__custom-title {
    display: block;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--so-amber-800);
  }

  .tier-card__custom-desc {
    font-size: 0.6875rem;
    color: var(--so-amber-600);
  }

  /* Pricing Section */
  .tier-card__pricing {
    margin-bottom: 1rem;
  }


  /* Pricing Box with Dropdown */
  .tier-card__pricing-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
    background: var(--so-slate-50);
    border-radius: var(--so-radius-md);
    border: 1px solid var(--so-slate-100);
  }

  .tier-card__currency {
    font-family: var(--so-font-mono);
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--so-slate-400);
  }

  .tier-card__amount-input {
    width: 5rem;
    font-family: var(--so-font-mono);
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--so-slate-900);
    background: transparent;
    border: none;
    outline: none;
  }

  .tier-card__amount-input::placeholder {
    color: var(--so-slate-300);
  }

  .tier-card__divider {
    color: var(--so-slate-300);
    font-size: 1rem;
  }

  /* Dropdown with checkboxes */
  .tier-card__cycle-dropdown {
    position: relative;
    flex: 1;
  }

  .tier-card__cycle-dropdown-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    color: var(--so-slate-600);
    background: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 0.25rem 0;
    text-align: left;
  }

  .tier-card__cycle-dropdown-trigger svg {
    width: 1rem;
    height: 1rem;
    color: var(--so-slate-400);
    transition: transform 0.15s ease;
  }

  .tier-card__cycle-dropdown-trigger--open svg {
    transform: rotate(180deg);
  }

  .tier-card__cycle-dropdown-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: -6.5rem;
    right: -1rem;
    min-width: 220px;
    background: var(--so-white);
    border: 1px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    box-shadow: var(--so-shadow-lg);
    z-index: 50;
    padding: 0.5rem;
    animation: dropdown-fade-in 0.15s ease-out;
  }

  @keyframes dropdown-fade-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .tier-card__cycle-dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.5rem;
    border-radius: var(--so-radius-sm);
    cursor: pointer;
    transition: background 0.1s ease;
    overflow: hidden;
  }

  .tier-card__cycle-dropdown-item:hover {
    background: var(--so-slate-50);
  }

  .tier-card__cycle-dropdown-item--active {
    background: var(--so-violet-50);
  }

  .tier-card__cycle-checkbox {
    width: 1rem;
    height: 1rem;
    accent-color: var(--so-violet-600);
    cursor: pointer;
    flex-shrink: 0;
  }

  .tier-card__cycle-name {
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--so-slate-700);
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tier-card__cycle-price-inline {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    flex-shrink: 0;
  }

  .tier-card__cycle-currency-small {
    font-family: var(--so-font-mono);
    font-size: 0.75rem;
    color: var(--so-slate-400);
  }

  .tier-card__cycle-price-input {
    width: 3.5rem;
    min-width: 3.5rem;
    max-width: 3.5rem;
    font-family: var(--so-font-mono);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--so-slate-800);
    background: var(--so-white);
    border: 1px solid var(--so-slate-200);
    border-radius: var(--so-radius-sm);
    padding: 0.25rem 0.375rem;
    outline: none;
    transition: border-color 0.15s ease;
    box-sizing: border-box;
  }

  .tier-card__cycle-price-input:focus {
    border-color: var(--so-violet-400);
  }

  .tier-card__cycle-price-input:disabled {
    background: var(--so-slate-100);
    color: var(--so-slate-400);
    cursor: not-allowed;
  }

  .tier-card__cycle-default-badge {
    font-family: var(--so-font-mono);
    font-size: 0.5625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--so-violet-600);
    background: var(--so-violet-100);
    padding: 0.125rem 0.375rem;
    border-radius: var(--so-radius-sm);
  }

  /* Price Per Month - Mental Accounting */
  .tier-card__price-breakdown {
    margin-top: 0.625rem;
    padding-top: 0.625rem;
    border-top: 1px dashed var(--so-slate-200);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tier-card__per-month {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }

  .tier-card__per-month-amount {
    font-family: var(--so-font-mono);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--so-emerald-600);
  }

  .tier-card__per-month-label {
    font-size: 0.6875rem;
    color: var(--so-slate-500);
  }

  /* Active cycles summary */
  .tier-card__cycles-summary {
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .tier-card__cycle-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-family: var(--so-font-mono);
    font-size: 0.625rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    background: var(--so-slate-100);
    color: var(--so-slate-600);
    border-radius: var(--so-radius-sm);
  }

  .tier-card__cycle-tag--default {
    background: var(--so-violet-100);
    color: var(--so-violet-700);
  }

  .tier-card__cycle-tag-price {
    color: var(--so-slate-500);
  }


  /* Description */
  .tier-card__description {
    margin-top: 1rem;
  }

  .tier-card__desc-textarea {
    width: 100%;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    color: var(--so-slate-600);
    background: var(--so-slate-50);
    border: 1px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    padding: 0.75rem;
    resize: none;
    outline: none;
    transition: var(--so-transition-fast);
  }

  .tier-card__desc-textarea:focus {
    border-color: var(--so-violet-400);
    box-shadow: 0 0 0 3px var(--so-violet-100);
  }

  .tier-card__desc-textarea::placeholder {
    color: var(--so-slate-400);
  }

  /* Footer */
  .tier-card__footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background: var(--so-slate-50);
    border-top: 1px solid var(--so-slate-100);
  }

  .tier-card__footer-icon {
    width: 1rem;
    height: 1rem;
    color: var(--so-slate-400);
  }

  .tier-card__footer-text {
    font-size: 0.75rem;
    color: var(--so-slate-500);
  }

  /* Add Card */
  .tier-add-card {
    width: 320px;
    min-height: 280px;
    background: var(--so-white);
    border: 2px dashed var(--so-slate-200);
    border-radius: var(--so-radius-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: var(--so-transition-base);
  }

  .tier-add-card:hover {
    border-color: var(--so-violet-300);
    background: var(--so-violet-50);
  }

  .tier-add-card__icon-wrap {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: var(--so-slate-100);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--so-transition-base);
  }

  .tier-add-card:hover .tier-add-card__icon-wrap {
    background: var(--so-violet-100);
  }

  .tier-add-card__icon {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--so-slate-400);
    transition: var(--so-transition-fast);
  }

  .tier-add-card:hover .tier-add-card__icon {
    color: var(--so-violet-600);
  }

  .tier-add-card__text {
    font-family: var(--so-font-sans);
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--so-slate-500);
    transition: var(--so-transition-fast);
  }

  .tier-add-card:hover .tier-add-card__text {
    color: var(--so-violet-600);
  }

  /* Add Form Card */
  .tier-form-card {
    width: 320px;
    background: var(--so-white);
    border: 2px solid var(--so-violet-200);
    border-radius: var(--so-radius-lg);
    padding: 1.5rem;
    animation: tier-slide-up 0.2s ease-out;
  }

  .tier-form-card__title {
    font-family: var(--so-font-sans);
    font-size: 1rem;
    font-weight: 700;
    color: var(--so-slate-900);
    margin-bottom: 1.25rem;
  }

  .tier-form-card__field {
    margin-bottom: 1rem;
  }

  .tier-form-card__label {
    display: block;
    font-family: var(--so-font-mono);
    font-size: 0.625rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--so-slate-500);
    margin-bottom: 0.375rem;
  }

  .tier-form-card__input {
    width: 100%;
    font-family: var(--so-font-sans);
    font-size: 1rem;
    font-weight: 600;
    color: var(--so-slate-900);
    background: var(--so-white);
    border: 1px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    padding: 0.625rem 0.875rem;
    outline: none;
    transition: var(--so-transition-fast);
  }

  .tier-form-card__input:focus {
    border-color: var(--so-violet-400);
    box-shadow: 0 0 0 3px var(--so-violet-100);
  }

  .tier-form-card__input::placeholder {
    font-weight: 400;
    color: var(--so-slate-400);
  }

  /* Custom Pricing Toggle */
  .tier-form-card__toggle {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-bottom: 1rem;
    cursor: pointer;
  }

  .tier-form-card__checkbox {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: var(--so-amber-500);
    cursor: pointer;
  }

  .tier-form-card__toggle-text {
    font-size: 0.8125rem;
    color: var(--so-slate-600);
  }

  /* Pricing Row */
  .tier-form-card__pricing-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .tier-form-card__currency {
    font-family: var(--so-font-mono);
    font-size: 1rem;
    color: var(--so-slate-400);
  }

  .tier-form-card__amount-input {
    width: 5rem;
    font-family: var(--so-font-mono);
    font-size: 1rem;
    font-weight: 500;
    color: var(--so-slate-900);
    background: var(--so-white);
    border: 1px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    padding: 0.5rem 0.75rem;
    outline: none;
    transition: var(--so-transition-fast);
  }

  .tier-form-card__amount-input:focus {
    border-color: var(--so-violet-400);
    box-shadow: 0 0 0 3px var(--so-violet-100);
  }

  .tier-form-card__separator {
    color: var(--so-slate-300);
  }

  .tier-form-card__cycle-select {
    flex: 1;
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    color: var(--so-slate-700);
    background: var(--so-white);
    border: 1px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    outline: none;
    transition: var(--so-transition-fast);
  }

  .tier-form-card__cycle-select:focus {
    border-color: var(--so-violet-400);
    box-shadow: 0 0 0 3px var(--so-violet-100);
  }

  /* Actions */
  .tier-form-card__actions {
    display: flex;
    gap: 0.625rem;
    margin-top: 1.25rem;
  }

  .tier-form-card__btn {
    flex: 1;
    padding: 0.625rem 1rem;
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: var(--so-radius-md);
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .tier-form-card__btn--primary {
    background: var(--so-violet-600);
    color: var(--so-white);
    border: none;
  }

  .tier-form-card__btn--primary:hover:not(:disabled) {
    background: var(--so-violet-700);
  }

  .tier-form-card__btn--primary:disabled {
    background: var(--so-slate-200);
    color: var(--so-slate-400);
    cursor: not-allowed;
  }

  .tier-form-card__btn--secondary {
    background: var(--so-slate-100);
    color: var(--so-slate-700);
    border: none;
  }

  .tier-form-card__btn--secondary:hover {
    background: var(--so-slate-200);
  }

  /* Tier Presets - Quick Start Templates */
  .tier-presets {
    background: linear-gradient(135deg, var(--so-violet-50) 0%, var(--so-sky-50) 100%);
    border-radius: var(--so-radius-lg);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid var(--so-violet-100);
  }

  .tier-presets__header {
    margin-bottom: 1.25rem;
  }

  .tier-presets__title {
    font-family: var(--so-font-sans);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--so-slate-800);
    margin: 0 0 0.375rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .tier-presets__title::before {
    content: '⚡';
  }

  .tier-presets__subtitle {
    font-size: 0.875rem;
    color: var(--so-slate-600);
    margin: 0;
  }

  .tier-presets__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .tier-preset-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.25rem;
    background: white;
    border: 2px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
  }

  .tier-preset-card:hover {
    border-color: var(--so-violet-400);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
    transform: translateY(-2px);
  }

  .tier-preset-card__icon {
    font-size: 1.5rem;
  }

  .tier-preset-card__content {
    flex: 1;
  }

  .tier-preset-card__name {
    font-family: var(--so-font-sans);
    font-size: 1rem;
    font-weight: 600;
    color: var(--so-slate-800);
    margin: 0 0 0.25rem;
  }

  .tier-preset-card__desc {
    font-size: 0.8125rem;
    color: var(--so-slate-500);
    margin: 0;
  }

  .tier-preset-card__preview {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--so-slate-100);
  }

  .tier-preset-card__tier {
    font-family: var(--so-font-mono);
    font-size: 0.6875rem;
    padding: 0.25rem 0.5rem;
    background: var(--so-slate-100);
    color: var(--so-slate-600);
    border-radius: var(--so-radius-sm);
  }

  .tier-preset-card:hover .tier-preset-card__tier {
    background: var(--so-violet-100);
    color: var(--so-violet-700);
  }

  /* Info Notice */
  .tier-notice {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1rem 1.25rem;
    background: var(--so-amber-50);
    border: 1px solid var(--so-amber-200);
    border-radius: var(--so-radius-lg);
  }

  .tier-notice__icon {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    color: var(--so-amber-600);
    margin-top: 0.125rem;
  }

  .tier-notice__content {
    flex: 1;
  }

  .tier-notice__title {
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--so-amber-800);
    margin-bottom: 0.25rem;
  }

  .tier-notice__text {
    font-size: 0.8125rem;
    color: var(--so-amber-700);
    line-height: 1.5;
  }
`;

export function TierDefinition({ document, dispatch }: TierDefinitionProps) {
  const { state } = document;
  const tiers = state.global.tiers ?? [];

  const [isAddingTier, setIsAddingTier] = useState(false);
  const [newTier, setNewTier] = useState({
    name: "",
    amount: "",
    currency: "USD",
    billingCycle: "MONTHLY" as BillingCycle,
    isCustomPricing: false,
  });

  const handleAddTier = () => {
    if (!newTier.name.trim() || (!newTier.isCustomPricing && !newTier.amount))
      return;

    dispatch(
      addTier({
        id: generateId(),
        name: newTier.name.trim(),
        amount: newTier.isCustomPricing
          ? undefined
          : parseFloat(newTier.amount),
        currency: newTier.currency,
        billingCycle: newTier.billingCycle,
        isCustomPricing: newTier.isCustomPricing,
        lastModified: new Date().toISOString(),
      }),
    );

    setNewTier({
      name: "",
      amount: "",
      currency: "USD",
      billingCycle: "MONTHLY",
      isCustomPricing: false,
    });
    setIsAddingTier(false);
  };

  const handleDeleteTier = (tierId: string) => {
    if (!confirm("Are you sure you want to delete this tier?")) return;
    dispatch(
      deleteTier({
        id: tierId,
        lastModified: new Date().toISOString(),
      }),
    );
  };

  // Apply a preset tier configuration - Default Effect
  const handleApplyPreset = (preset: TierPreset) => {
    const now = new Date().toISOString();
    preset.tiers.forEach((tierConfig) => {
      dispatch(
        addTier({
          id: generateId(),
          name: tierConfig.name,
          amount: tierConfig.isCustomPricing
            ? undefined
            : (tierConfig.amount ?? undefined),
          currency: "USD",
          billingCycle: tierConfig.billingCycle,
          isCustomPricing: tierConfig.isCustomPricing,
          lastModified: now,
        }),
      );
    });
  };

  const getTierAccent = (index: number) =>
    TIER_ACCENTS[index % TIER_ACCENTS.length];

  const recommendedTierIndex = getRecommendedTierIndex(tiers);

  return (
    <>
      <style>{tierStyles}</style>
      <div className="tier-def">
        {/* Tier Presets - Show when no tiers exist (Default Effect) */}
        {tiers.length === 0 && (
          <div className="tier-presets">
            <div className="tier-presets__header">
              <h3 className="tier-presets__title">
                Quick Start with a Template
              </h3>
              <p className="tier-presets__subtitle">
                Choose a pricing structure to get started quickly, or create
                custom tiers below
              </p>
            </div>
            <div className="tier-presets__grid">
              {TIER_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset)}
                  className="tier-preset-card"
                >
                  <span className="tier-preset-card__icon">{preset.icon}</span>
                  <div className="tier-preset-card__content">
                    <h4 className="tier-preset-card__name">{preset.name}</h4>
                    <p className="tier-preset-card__desc">
                      {preset.description}
                    </p>
                  </div>
                  <div className="tier-preset-card__preview">
                    {preset.tiers.map((t, i) => (
                      <span key={i} className="tier-preset-card__tier">
                        {t.name}
                        {t.isCustomPricing ? "" : ` $${t.amount}`}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="tier-def__grid">
          {tiers.map((tier, index) => (
            <TierCard
              key={tier.id}
              tier={tier}
              accent={getTierAccent(index)}
              dispatch={dispatch}
              onDelete={() => handleDeleteTier(tier.id)}
              isRecommended={index === recommendedTierIndex}
            />
          ))}

          {isAddingTier ? (
            <div className="tier-form-card">
              <h3 className="tier-form-card__title">New Subscription Tier</h3>

              <div className="tier-form-card__field">
                <label className="tier-form-card__label">Tier Name</label>
                <input
                  type="text"
                  value={newTier.name}
                  onChange={(e) =>
                    setNewTier({ ...newTier, name: e.target.value })
                  }
                  placeholder="e.g., Basic, Professional"
                  className="tier-form-card__input"
                  autoFocus
                />
              </div>

              <label className="tier-form-card__toggle">
                <input
                  type="checkbox"
                  checked={newTier.isCustomPricing}
                  onChange={(e) =>
                    setNewTier({
                      ...newTier,
                      isCustomPricing: e.target.checked,
                      amount: "",
                    })
                  }
                  className="tier-form-card__checkbox"
                />
                <span className="tier-form-card__toggle-text">
                  Custom Pricing (price varies per client)
                </span>
              </label>

              {!newTier.isCustomPricing && (
                <div className="tier-form-card__field">
                  <label className="tier-form-card__label">
                    Recurring Price
                  </label>
                  <div className="tier-form-card__pricing-row">
                    <span className="tier-form-card__currency">$</span>
                    <input
                      type="number"
                      value={newTier.amount}
                      onChange={(e) =>
                        setNewTier({ ...newTier, amount: e.target.value })
                      }
                      placeholder="0"
                      className="tier-form-card__amount-input"
                      step="0.01"
                    />
                    <span className="tier-form-card__separator">/</span>
                    <select
                      value={newTier.billingCycle}
                      onChange={(e) =>
                        setNewTier({
                          ...newTier,
                          billingCycle: e.target.value as BillingCycle,
                        })
                      }
                      className="tier-form-card__cycle-select"
                    >
                      {BILLING_CYCLES.map((cycle) => (
                        <option key={cycle.value} value={cycle.value}>
                          {cycle.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="tier-form-card__actions">
                <button
                  onClick={handleAddTier}
                  disabled={
                    !newTier.name.trim() ||
                    (!newTier.isCustomPricing && !newTier.amount)
                  }
                  className="tier-form-card__btn tier-form-card__btn--primary"
                >
                  Create Tier
                </button>
                <button
                  onClick={() => {
                    setIsAddingTier(false);
                    setNewTier({
                      name: "",
                      amount: "",
                      currency: "USD",
                      billingCycle: "MONTHLY",
                      isCustomPricing: false,
                    });
                  }}
                  className="tier-form-card__btn tier-form-card__btn--secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTier(true)}
              className="tier-add-card"
            >
              <div className="tier-add-card__icon-wrap">
                <svg
                  className="tier-add-card__icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span className="tier-add-card__text">Add Subscription Tier</span>
            </button>
          )}
        </div>

        <div className="tier-notice">
          <svg
            className="tier-notice__icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="tier-notice__content">
            <p className="tier-notice__title">
              Setup fees are managed at the service group level
            </p>
            <p className="tier-notice__text">
              Configure setup fees for "Setup & Formation" service groups in the
              Service Catalog. The setup fee applies to all tiers when those
              services are included.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

interface TierCardProps {
  tier: ServiceSubscriptionTier;
  accent: { color: string; bg: string; name: string };
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  onDelete: () => void;
  isRecommended?: boolean;
}

function TierCard({
  tier,
  accent,
  dispatch,
  onDelete,
  isRecommended,
}: TierCardProps) {
  const [localName, setLocalName] = useState(tier.name);
  const [localDescription, setLocalDescription] = useState(
    tier.description || "",
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isCustomPricing = tier.isCustomPricing ?? false;

  // Track local prices for each billing cycle
  const [cyclePrices, setCyclePrices] = useState<Record<BillingCycle, string>>(
    () => {
      const prices: Record<BillingCycle, string> = {
        MONTHLY: "",
        QUARTERLY: "",
        SEMI_ANNUAL: "",
        ANNUAL: "",
        ONE_TIME: "",
      };
      // Initialize from existing pricing options
      (tier.pricingOptions ?? []).forEach((opt) => {
        prices[opt.billingCycle] = opt.amount?.toString() ?? "";
      });
      return prices;
    },
  );

  // Update local state when tier.pricingOptions changes
  useEffect(() => {
    setCyclePrices((prev) => {
      const prices = { ...prev };
      (tier.pricingOptions ?? []).forEach((opt) => {
        prices[opt.billingCycle] = opt.amount?.toString() ?? "";
      });
      // Clear prices for cycles that are no longer in pricingOptions
      const activeCyclesSet = new Set(
        (tier.pricingOptions ?? []).map((opt) => opt.billingCycle),
      );
      BILLING_CYCLES.forEach((cycle) => {
        if (!activeCyclesSet.has(cycle.value)) {
          prices[cycle.value] = "";
        }
      });
      return prices;
    });
  }, [tier.pricingOptions]);

  // Get the set of active billing cycles from pricingOptions
  const activeCycles = new Set(
    (tier.pricingOptions ?? []).map((opt) => opt.billingCycle),
  );

  // Get default option
  const defaultOption = (tier.pricingOptions ?? []).find(
    (opt) => opt.isDefault,
  );
  const defaultCycle = defaultOption?.billingCycle ?? "MONTHLY";
  const defaultAmount = defaultOption?.amount ?? 0;

  const handleNameBlur = () => {
    if (localName !== tier.name && localName.trim()) {
      dispatch(
        updateTier({
          id: tier.id,
          name: localName.trim(),
          lastModified: new Date().toISOString(),
        }),
      );
    }
  };

  const handleDescriptionBlur = () => {
    if (localDescription !== (tier.description || "")) {
      dispatch(
        updateTier({
          id: tier.id,
          description: localDescription,
          lastModified: new Date().toISOString(),
        }),
      );
    }
  };

  // Toggle a billing cycle on/off
  const handleCycleToggle = (cycle: BillingCycle, checked: boolean) => {
    const now = new Date().toISOString();
    if (checked) {
      // Add this billing cycle
      const isFirst = (tier.pricingOptions ?? []).length === 0;
      dispatch(
        addTierPricingOption({
          tierId: tier.id,
          pricingOptionId: generateId(),
          billingCycle: cycle,
          amount: 0,
          currency: "USD",
          isDefault: isFirst,
          lastModified: now,
        }),
      );
    } else {
      // Remove this billing cycle
      const option = (tier.pricingOptions ?? []).find(
        (opt) => opt.billingCycle === cycle,
      );
      if (option) {
        // Don't allow removing if it's the only one
        if ((tier.pricingOptions ?? []).length <= 1) {
          return;
        }
        dispatch(
          removeTierPricingOption({
            tierId: tier.id,
            pricingOptionId: option.id,
            lastModified: now,
          }),
        );
      }
    }
  };

  // Update the price for a billing cycle
  const handleCyclePriceChange = (cycle: BillingCycle, value: string) => {
    setCyclePrices((prev) => ({ ...prev, [cycle]: value }));
  };

  const handleCyclePriceBlur = (cycle: BillingCycle) => {
    const option = (tier.pricingOptions ?? []).find(
      (opt) => opt.billingCycle === cycle,
    );
    if (!option) return;

    const amount = parseFloat(cyclePrices[cycle]);
    if (!isNaN(amount) && amount !== option.amount) {
      dispatch(
        updateTierPricingOption({
          tierId: tier.id,
          pricingOptionId: option.id,
          amount,
          lastModified: new Date().toISOString(),
        }),
      );
    }
  };

  // Set a billing cycle as default (clicking it in the dropdown)
  const handleSetDefault = (cycle: BillingCycle) => {
    const option = (tier.pricingOptions ?? []).find(
      (opt) => opt.billingCycle === cycle,
    );
    if (!option || option.isDefault) return;

    dispatch(
      updateTierPricingOption({
        tierId: tier.id,
        pricingOptionId: option.id,
        isDefault: true,
        lastModified: new Date().toISOString(),
      }),
    );
  };

  // Helper to get monthly equivalent
  const getMonthlyEquivalent = (
    amount: number,
    cycle: BillingCycle,
  ): string => {
    if (cycle === "ONE_TIME" || cycle === "MONTHLY" || amount <= 0) return "";
    const months = BILLING_CYCLE_MONTHS[cycle];
    const monthly = amount / months;
    return `$${monthly.toFixed(2)}`;
  };

  // Get the label for the currently selected default cycle
  const getDefaultCycleLabel = () => {
    const cycleInfo = BILLING_CYCLES.find((c) => c.value === defaultCycle);
    return cycleInfo?.label ?? "Month";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".tier-card__cycle-dropdown")) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className={`tier-card ${isRecommended ? "tier-card--popular" : ""}`}>
      {/* Most Popular Badge - Social Proof */}
      {isRecommended && (
        <div className="tier-card__popular-banner">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Most Popular
        </div>
      )}
      <div className="tier-card__accent" style={{ background: accent.color }} />

      <div className="tier-card__body">
        <div className="tier-card__header">
          <div className="tier-card__name-group">
            <span className="tier-card__label">Tier Name</span>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleNameBlur}
              className="tier-card__name-input"
            />
          </div>
          <button onClick={onDelete} className="tier-card__delete-btn">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {isCustomPricing && (
          <div className="tier-card__custom-badge">
            <svg
              className="tier-card__custom-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="tier-card__custom-text">
              <span className="tier-card__custom-title">Custom Pricing</span>
              <span className="tier-card__custom-desc">
                Price varies per client
              </span>
            </div>
          </div>
        )}

        {!isCustomPricing && (
          <div className="tier-card__pricing">
            <span className="tier-card__label">Recurring Price</span>

            {/* Main pricing box with dropdown */}
            <div className="tier-card__pricing-box">
              <span className="tier-card__currency">$</span>
              <input
                type="number"
                value={cyclePrices[defaultCycle] || ""}
                onChange={(e) =>
                  handleCyclePriceChange(defaultCycle, e.target.value)
                }
                onBlur={() => handleCyclePriceBlur(defaultCycle)}
                className="tier-card__amount-input"
                placeholder="0"
                step="0.01"
              />
              <span className="tier-card__divider">/</span>

              {/* Dropdown trigger */}
              <div className="tier-card__cycle-dropdown">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`tier-card__cycle-dropdown-trigger ${dropdownOpen ? "tier-card__cycle-dropdown-trigger--open" : ""}`}
                >
                  <span>{getDefaultCycleLabel()}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown menu with checkboxes */}
                {dropdownOpen && (
                  <div className="tier-card__cycle-dropdown-menu">
                    {BILLING_CYCLES.filter((c) => c.value !== "ONE_TIME").map(
                      (cycle) => {
                        const isActive = activeCycles.has(cycle.value);
                        const option = (tier.pricingOptions ?? []).find(
                          (opt) => opt.billingCycle === cycle.value,
                        );
                        const isDefault = option?.isDefault ?? false;
                        const price = cyclePrices[cycle.value];

                        return (
                          <div
                            key={cycle.value}
                            className={`tier-card__cycle-dropdown-item ${isActive ? "tier-card__cycle-dropdown-item--active" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={isActive}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleCycleToggle(
                                  cycle.value,
                                  e.target.checked,
                                );
                              }}
                              className="tier-card__cycle-checkbox"
                              disabled={
                                isActive &&
                                (tier.pricingOptions ?? []).length <= 1
                              }
                            />
                            <span
                              className="tier-card__cycle-name"
                              onClick={() => {
                                if (isActive && !isDefault) {
                                  handleSetDefault(cycle.value);
                                }
                              }}
                              style={{
                                cursor:
                                  isActive && !isDefault
                                    ? "pointer"
                                    : "default",
                              }}
                            >
                              {cycle.label}
                            </span>
                            {isActive && (
                              <>
                                <div className="tier-card__cycle-price-inline">
                                  <span className="tier-card__cycle-currency-small">
                                    $
                                  </span>
                                  <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleCyclePriceChange(
                                        cycle.value,
                                        e.target.value,
                                      );
                                    }}
                                    onBlur={() =>
                                      handleCyclePriceBlur(cycle.value)
                                    }
                                    placeholder="0"
                                    step="0.01"
                                    className="tier-card__cycle-price-input"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                {isDefault && (
                                  <span className="tier-card__cycle-default-badge">
                                    Default
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Price Per Month - Mental Accounting */}
            {defaultAmount > 0 &&
              defaultCycle !== "ONE_TIME" &&
              defaultCycle !== "MONTHLY" && (
                <div className="tier-card__price-breakdown">
                  <div className="tier-card__per-month">
                    <span className="tier-card__per-month-amount">
                      {getMonthlyEquivalent(defaultAmount, defaultCycle)}
                    </span>
                    <span className="tier-card__per-month-label">/month</span>
                  </div>
                </div>
              )}

            {/* Show summary of active billing cycles */}
            {activeCycles.size > 1 && (
              <div className="tier-card__cycles-summary">
                {(tier.pricingOptions ?? []).map((opt) => {
                  const cycleInfo = BILLING_CYCLES.find(
                    (c) => c.value === opt.billingCycle,
                  );
                  return (
                    <span
                      key={opt.id}
                      className={`tier-card__cycle-tag ${opt.isDefault ? "tier-card__cycle-tag--default" : ""}`}
                    >
                      {cycleInfo?.label}
                      <span className="tier-card__cycle-tag-price">
                        ${opt.amount}
                      </span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="tier-card__description">
          <span className="tier-card__label">Description</span>
          <textarea
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Add a description..."
            rows={2}
            className="tier-card__desc-textarea"
          />
        </div>
      </div>

      <div className="tier-card__footer">
        <svg
          className="tier-card__footer-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="tier-card__footer-text">
          Configure service levels in the Matrix view
        </span>
      </div>
    </div>
  );
}
