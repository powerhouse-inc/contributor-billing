import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  ServiceOfferingDocument,
  ServiceOfferingAction,
  Service,
  ServiceSubscriptionTier,
  ServiceLevel,
  ServiceLevelBinding,
  OptionGroup,
  ServiceUsageLimit,
} from "../../../document-models/service-offering/gen/types.js";
import {
  addServiceLevel,
  updateServiceLevel,
  addUsageLimit,
  updateUsageLimit,
  removeUsageLimit,
  addService,
} from "../../../document-models/service-offering/gen/creators.js";

interface TheMatrixProps {
  document: ServiceOfferingDocument;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  groupSetupFees?: Record<string, number | null>;
}

const SERVICE_LEVELS: {
  value: ServiceLevel;
  label: string;
  shortLabel: string;
  color: string;
}[] = [
  {
    value: "INCLUDED",
    label: "Included",
    shortLabel: "✓",
    color: "var(--so-emerald-600)",
  },
  {
    value: "OPTIONAL",
    label: "Optional",
    shortLabel: "Optional",
    color: "var(--so-sky-600)",
  },
  {
    value: "NOT_INCLUDED",
    label: "Not Included",
    shortLabel: "—",
    color: "var(--so-slate-400)",
  },
  {
    value: "NOT_APPLICABLE",
    label: "Not Applicable",
    shortLabel: "/",
    color: "var(--so-slate-300)",
  },
  {
    value: "CUSTOM",
    label: "Custom",
    shortLabel: "Custom",
    color: "var(--so-amber-600)",
  },
  {
    value: "VARIABLE",
    label: "Variable",
    shortLabel: "#",
    color: "var(--so-violet-600)",
  },
];

const UNGROUPED_ID = "__ungrouped__";

const FACET_CATEGORIES = {
  FUNCTION: {
    label: "SNO Function",
    options: [
      { id: "operational-hub", label: "Operational Hub" },
      { id: "embryonic-hub", label: "Embryonic Hub" },
    ],
  },
  LEGAL_ENTITY: {
    label: "Legal Entity",
    options: [
      { id: "swiss-association", label: "Swiss Association" },
      { id: "bvi-ltd", label: "BVI Ltd" },
      { id: "unaffiliated", label: "Unaffiliated" },
    ],
  },
  TEAM_STRUCTURE: {
    label: "Team",
    options: [
      { id: "remote-team", label: "Remote" },
      { id: "on-premise", label: "On-Premise" },
      { id: "hybrid", label: "Hybrid" },
    ],
  },
  ANONYMITY: {
    label: "Anonymity",
    options: [
      { id: "high-anonymity", label: "High" },
      { id: "highest-anonymity", label: "Highest" },
    ],
  },
};

const matrixStyles = `
  .matrix {
    background: var(--so-white);
    border-radius: var(--so-radius-lg);
    box-shadow: var(--so-shadow-md);
    overflow: hidden;
  }

  /* Facet Selector */
  .matrix__facets {
    padding: 1.25rem 1.5rem;
    background: linear-gradient(to bottom, var(--so-slate-50), var(--so-white));
    border-bottom: 1px solid var(--so-slate-200);
  }

  .matrix__facets-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 1.5rem;
  }

  .matrix__facet-group {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .matrix__facet-label {
    font-family: var(--so-font-mono);
    font-size: 0.625rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--so-slate-500);
  }

  .matrix__facet-select {
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    color: var(--so-slate-700);
    background: var(--so-white);
    border: 1px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    cursor: pointer;
    outline: none;
    transition: var(--so-transition-fast);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1rem;
  }

  .matrix__facet-select:hover {
    border-color: var(--so-slate-300);
  }

  .matrix__facet-select:focus {
    border-color: var(--so-violet-400);
    box-shadow: 0 0 0 3px var(--so-violet-100);
  }

  /* Toggle Button Group */
  .matrix__toggle-group {
    display: flex;
    background: var(--so-white);
    border: 1px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    overflow: hidden;
  }

  .matrix__toggle-btn {
    padding: 0.5rem 0.875rem;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--so-slate-600);
    background: var(--so-white);
    border: none;
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__toggle-btn:not(:first-child) {
    border-left: 1px solid var(--so-slate-200);
  }

  .matrix__toggle-btn:hover:not(.matrix__toggle-btn--active) {
    background: var(--so-slate-50);
  }

  .matrix__toggle-btn--active {
    background: var(--so-violet-100);
    color: var(--so-violet-700);
  }

  /* Facet Notice */
  .matrix__facet-notice {
    margin-top: 0.875rem;
    padding: 0.625rem 0.875rem;
    background: var(--so-amber-50);
    border: 1px solid var(--so-amber-200);
    border-radius: var(--so-radius-md);
  }

  .matrix__facet-notice-text {
    font-size: 0.75rem;
    color: var(--so-amber-700);
  }

  .matrix__facet-notice-text strong {
    color: var(--so-amber-800);
  }

  /* Table */
  .matrix__table-wrap {
    overflow-x: auto;
  }

  .matrix__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
  }

  /* Header */
  .matrix__corner-cell {
    position: sticky;
    left: 0;
    z-index: 10;
    background: var(--so-white);
    padding: 1rem;
    text-align: left;
    font-weight: 400;
    color: var(--so-slate-500);
    border-bottom: 1px solid var(--so-slate-200);
    min-width: 260px;
  }

  .matrix__tier-header {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid var(--so-slate-200);
    min-width: 140px;
    cursor: pointer;
    transition: var(--so-transition-fast);
    background: var(--so-white);
  }

  .matrix__tier-header:hover:not(.matrix__tier-header--selected) {
    background: var(--so-violet-50);
  }

  .matrix__tier-header--selected {
    background: var(--so-violet-600);
    color: var(--so-white);
  }

  .matrix__tier-header-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
  }

  .matrix__tier-radio {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid var(--so-slate-300);
    transition: var(--so-transition-fast);
  }

  .matrix__tier-header--selected .matrix__tier-radio {
    border-color: var(--so-white);
    background: var(--so-violet-600);
    box-shadow: inset 0 0 0 3px var(--so-white);
  }

  .matrix__tier-name {
    font-family: var(--so-font-sans);
    font-weight: 600;
  }

  .matrix__tier-price {
    font-size: 0.6875rem;
    opacity: 0.7;
  }

  .matrix__tier-header--selected .matrix__tier-price {
    color: var(--so-violet-200);
  }

  /* Section Header */
  .matrix__section-header {
    background: var(--so-slate-100);
    padding: 0.625rem 1rem;
    font-family: var(--so-font-mono);
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--so-slate-600);
    border-bottom: 1px solid var(--so-slate-200);
  }

  /* Category Header */
  .matrix__category-header {
    background: var(--so-slate-50);
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--so-slate-700);
    border-bottom: 1px solid var(--so-slate-200);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .matrix__category-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    color: var(--so-slate-500);
  }

  .matrix__category-icon svg {
    width: 100%;
    height: 100%;
  }

  /* Group Header */
  .matrix__group-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--so-slate-200);
  }

  .matrix__group-header--setup {
    background: var(--so-amber-100);
  }

  .matrix__group-header--optional {
    background: var(--so-sky-100);
  }

  .matrix__group-header--regular {
    background: var(--so-slate-100);
  }

  .matrix__group-header-sticky {
    position: sticky;
    left: 0;
    z-index: 10;
  }

  .matrix__group-header-inner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .matrix__group-toggle {
    position: relative;
    width: 2.5rem;
    height: 1.25rem;
    border-radius: 9999px;
    border: none;
    cursor: pointer;
    transition: var(--so-transition-base);
  }

  .matrix__group-toggle--on {
    background: var(--so-violet-600);
  }

  .matrix__group-toggle--off {
    background: var(--so-slate-300);
  }

  .matrix__group-toggle-knob {
    position: absolute;
    top: 0.125rem;
    width: 1rem;
    height: 1rem;
    background: var(--so-white);
    border-radius: 50%;
    box-shadow: var(--so-shadow-sm);
    transition: var(--so-transition-fast);
  }

  .matrix__group-toggle--on .matrix__group-toggle-knob {
    left: calc(100% - 1.125rem);
  }

  .matrix__group-toggle--off .matrix__group-toggle-knob {
    left: 0.125rem;
  }

  .matrix__group-name {
    font-family: var(--so-font-sans);
    font-weight: 600;
    color: var(--so-slate-800);
  }

  .matrix__group-badge {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    border-radius: var(--so-radius-sm);
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .matrix__group-badge--included {
    background: var(--so-emerald-100);
    color: var(--so-emerald-700);
  }

  .matrix__group-badge--optional {
    background: var(--so-sky-200);
    color: var(--so-sky-700);
  }

  /* Service Row */
  .matrix__service-row {
    transition: var(--so-transition-fast);
  }

  .matrix__service-row--setup {
    background: var(--so-amber-50);
  }

  .matrix__service-row--optional {
    background: var(--so-sky-50);
  }

  .matrix__service-row--regular {
    background: var(--so-slate-50);
  }

  .matrix__service-row:hover {
    filter: brightness(0.98);
  }

  .matrix__service-cell {
    padding: 0.625rem 1rem;
    padding-left: 2rem;
    border-bottom: 1px solid var(--so-slate-100);
    position: sticky;
    left: 0;
    z-index: 10;
  }

  .matrix__service-title {
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    color: var(--so-slate-700);
  }

  .matrix__level-cell {
    padding: 0.625rem 1rem;
    text-align: center;
    border-bottom: 1px solid var(--so-slate-100);
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__level-cell:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .matrix__level-cell--selected {
    box-shadow: inset 0 0 0 2px var(--so-violet-500);
  }

  .matrix__level-cell--highlight {
    background: var(--so-violet-50);
  }

  .matrix__level-value {
    font-family: var(--so-font-sans);
    font-weight: 500;
  }

  /* Metric Row */
  .matrix__metric-row {
    background: inherit;
  }

  .matrix__metric-cell {
    padding: 0.375rem 1rem;
    padding-left: 3rem;
    border-bottom: 1px solid var(--so-slate-100);
    position: sticky;
    left: 0;
    z-index: 10;
  }

  .matrix__metric-name {
    font-family: var(--so-font-sans);
    font-size: 0.6875rem;
    font-style: italic;
    color: var(--so-slate-500);
  }

  .matrix__metric-value-cell {
    padding: 0.375rem 1rem;
    text-align: center;
    border-bottom: 1px solid var(--so-slate-100);
  }

  .matrix__metric-value {
    font-size: 0.6875rem;
    color: var(--so-slate-500);
  }

  /* Add Service Row */
  .matrix__add-service-row td {
    padding: 0.5rem 1rem;
    padding-left: 2rem;
    border-bottom: 1px solid var(--so-slate-100);
  }

  .matrix__add-service-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--so-violet-600);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__add-service-btn:hover {
    color: var(--so-violet-700);
  }

  .matrix__add-service-icon {
    width: 1rem;
    height: 1rem;
  }

  /* Total Rows */
  .matrix__total-row {
    background: var(--so-slate-100);
  }

  .matrix__total-row td {
    padding: 0.625rem 1rem;
    font-weight: 600;
    color: var(--so-slate-700);
    border-bottom: 1px solid var(--so-slate-300);
  }

  .matrix__total-row td:first-child {
    position: sticky;
    left: 0;
    z-index: 10;
    background: var(--so-slate-100);
  }

  .matrix__setup-total-row {
    background: var(--so-slate-50);
  }

  .matrix__setup-total-row td {
    padding: 0.625rem 1rem;
    font-weight: 600;
    color: var(--so-slate-700);
    border-bottom: 1px solid var(--so-slate-200);
  }

  .matrix__setup-total-row td:first-child {
    position: sticky;
    left: 0;
    z-index: 10;
    background: var(--so-slate-50);
  }

  /* Grand Total */
  .matrix__grand-total-row {
    background: var(--so-violet-100);
  }

  .matrix__grand-total-row td {
    padding: 0.875rem 1rem;
    font-weight: 700;
    color: var(--so-violet-900);
    border-top: 2px solid var(--so-violet-300);
  }

  .matrix__grand-total-row td:first-child {
    position: sticky;
    left: 0;
    z-index: 10;
    background: var(--so-violet-100);
  }

  .matrix__grand-total-cell--selected {
    background: var(--so-violet-600);
    color: var(--so-white);
  }

  /* Empty State */
  .matrix__empty {
    padding: 4rem 2rem;
    text-align: center;
  }

  .matrix__empty-icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1rem;
    color: var(--so-slate-300);
  }

  .matrix__empty-title {
    font-family: var(--so-font-sans);
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--so-slate-900);
    margin-bottom: 0.5rem;
  }

  .matrix__empty-text {
    font-size: 0.875rem;
    color: var(--so-slate-500);
    max-width: 28rem;
    margin: 0 auto;
  }

  /* Detail Panel */
  .matrix__panel-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 50;
    animation: panel-overlay-fade 0.2s ease-out;
  }

  @keyframes panel-overlay-fade {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(4px);
    }
  }

  .matrix__panel {
    width: 24rem;
    height: 100%;
    background: #ffffff;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow-y: auto;
    animation: panel-slide-in 0.2s ease-out;
  }

  @keyframes panel-slide-in {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .matrix__panel-header {
    background: #7c3aed;
    color: #ffffff;
    padding: 1rem;
  }

  .matrix__panel-header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.25rem;
  }

  .matrix__panel-tier {
    font-family: var(--so-font-mono);
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.8;
  }

  .matrix__panel-close {
    padding: 0.25rem;
    background: transparent;
    border: none;
    color: #ffffff;
    cursor: pointer;
    border-radius: var(--so-radius-sm);
    transition: var(--so-transition-fast);
  }

  .matrix__panel-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .matrix__panel-close-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .matrix__panel-title {
    font-family: var(--so-font-sans);
    font-size: 1.125rem;
    font-weight: 600;
  }

  .matrix__panel-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .matrix__panel-section-label {
    display: block;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 0.75rem;
  }

  .matrix__panel-level-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .matrix__panel-level-btn {
    padding: 0.625rem 0.875rem;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    color: #1e293b;
    border-radius: var(--so-radius-md);
    border: 2px solid #cbd5e1;
    background: #ffffff;
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__panel-level-btn:hover:not(.matrix__panel-level-btn--active) {
    border-color: #94a3b8;
    background: #f8fafc;
  }

  .matrix__panel-level-btn--active {
    border-color: #8b5cf6;
    background: #f5f3ff;
    color: #6d28d9;
    font-weight: 600;
  }

  .matrix__panel-input {
    width: 100%;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    color: #0f172a;
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: var(--so-radius-md);
    padding: 0.625rem 0.875rem;
    outline: none;
    transition: var(--so-transition-fast);
  }

  .matrix__panel-input:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .matrix__panel-limits-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .matrix__panel-add-btn {
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 600;
    color: #7c3aed;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__panel-add-btn:hover {
    color: #6d28d9;
  }

  .matrix__panel-empty-text {
    font-size: 0.8125rem;
    font-style: italic;
    color: #64748b;
  }

  .matrix__panel-limit-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: var(--so-radius-md);
    margin-bottom: 0.75rem;
  }

  .matrix__panel-limit-item:hover .matrix__panel-limit-actions {
    opacity: 1;
  }

  .matrix__panel-limit-content {
    flex: 1;
    cursor: pointer;
    padding: 0.25rem;
    margin: -0.25rem;
    border-radius: var(--so-radius-sm);
    transition: var(--so-transition-fast);
  }

  .matrix__panel-limit-content:hover {
    background: #e2e8f0;
  }

  .matrix__panel-limit-metric {
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }

  .matrix__panel-limit-value {
    font-size: 0.8125rem;
    color: #64748b;
  }

  .matrix__panel-limit-actions {
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: var(--so-transition-fast);
  }

  .matrix__panel-limit-btn {
    padding: 0.25rem;
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    border-radius: var(--so-radius-sm);
    transition: var(--so-transition-fast);
  }

  .matrix__panel-limit-btn:hover {
    background: #e2e8f0;
  }

  .matrix__panel-limit-btn--edit:hover {
    color: #7c3aed;
  }

  .matrix__panel-limit-btn--remove:hover {
    color: #e11d48;
  }

  .matrix__panel-limit-icon {
    width: 1rem;
    height: 1rem;
  }

  /* Edit Form */
  .matrix__panel-edit-form {
    padding: 0.75rem;
    background: #f5f3ff;
    border-radius: var(--so-radius-md);
    margin-bottom: 0.75rem;
  }

  .matrix__panel-edit-form > div {
    margin-bottom: 0.625rem;
  }

  .matrix__panel-edit-form > div:last-child {
    margin-bottom: 0;
  }

  .matrix__panel-edit-label {
    display: block;
    font-family: var(--so-font-mono);
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #64748b;
    margin-bottom: 0.25rem;
  }

  .matrix__panel-edit-hint {
    font-size: 0.6875rem;
    color: #94a3b8;
    margin-top: 0.25rem;
  }

  .matrix__panel-edit-actions {
    display: flex;
    gap: 0.5rem;
  }

  .matrix__panel-edit-btn {
    flex: 1;
    padding: 0.5rem 0.75rem;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: var(--so-radius-md);
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__panel-edit-btn--primary {
    background: #7c3aed;
    color: #ffffff;
    border: none;
  }

  .matrix__panel-edit-btn--primary:hover:not(:disabled) {
    background: #6d28d9;
  }

  .matrix__panel-edit-btn--primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .matrix__panel-edit-btn--secondary {
    background: #e2e8f0;
    color: #334155;
    border: none;
  }

  .matrix__panel-edit-btn--secondary:hover {
    background: #cbd5e1;
  }

  .matrix__panel-footer {
    padding: 1rem;
    border-top: 1px solid #e2e8f0;
    background: #ffffff;
  }

  .matrix__panel-done-btn {
    width: 100%;
    padding: 0.625rem 1rem;
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    font-weight: 600;
    background: #7c3aed;
    color: #ffffff;
    border: none;
    border-radius: var(--so-radius-md);
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__panel-done-btn:hover {
    background: var(--so-violet-700);
  }

  /* Modal */
  .matrix__modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: modal-backdrop 0.2s ease-out;
  }

  @keyframes modal-backdrop {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(4px);
    }
  }

  .matrix__modal {
    width: 24rem;
    background: #ffffff;
    border-radius: var(--so-radius-lg);
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.35),
      0 0 0 1px rgba(0, 0, 0, 0.08);
    padding: 1.5rem;
    animation: modal-pop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes modal-pop {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .matrix__modal-title {
    font-family: var(--so-font-sans);
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 1.25rem;
    letter-spacing: -0.02em;
  }

  .matrix__modal-field {
    margin-bottom: 1.25rem;
  }

  .matrix__modal-label {
    display: block;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 0.5rem;
  }

  .matrix__modal-input {
    width: 100%;
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    color: #0f172a;
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: var(--so-radius-md);
    padding: 0.75rem 1rem;
    outline: none;
    transition: var(--so-transition-fast);
  }

  .matrix__modal-input:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .matrix__modal-input::placeholder {
    color: #94a3b8;
  }

  .matrix__modal-hint {
    font-size: 0.8125rem;
    color: #475569;
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }

  .matrix__modal-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    padding-top: 0.5rem;
  }

  .matrix__modal-btn {
    padding: 0.625rem 1.25rem;
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: var(--so-radius-md);
    cursor: pointer;
    transition: all var(--so-transition-fast);
  }

  .matrix__modal-btn--cancel {
    background: #e2e8f0;
    color: #475569;
    border: none;
  }

  .matrix__modal-btn--cancel:hover {
    background: #cbd5e1;
    color: #1e293b;
  }

  .matrix__modal-btn--primary {
    background: #7c3aed;
    color: #ffffff;
    border: none;
    box-shadow: 0 2px 4px rgba(124, 58, 237, 0.3);
  }

  .matrix__modal-btn--primary:hover:not(:disabled) {
    background: #6d28d9;
    box-shadow: 0 4px 8px rgba(124, 58, 237, 0.4);
    transform: translateY(-1px);
  }

  .matrix__modal-btn--primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .matrix__modal-btn--primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  .matrix__modal--wide {
    width: 32rem;
    max-height: 85vh;
    overflow-y: auto;
  }

  .matrix__modal-textarea {
    width: 100%;
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    color: #0f172a;
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: var(--so-radius-md);
    padding: 0.75rem 1rem;
    outline: none;
    transition: var(--so-transition-fast);
    resize: vertical;
    min-height: 80px;
  }

  .matrix__modal-textarea:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .matrix__modal-textarea::placeholder {
    color: #94a3b8;
  }

  .matrix__modal-tier-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.75rem;
  }

  .matrix__modal-tier-option {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #ffffff;
    border: 2px solid #cbd5e1;
    border-radius: var(--so-radius-lg);
    cursor: pointer;
    transition: all var(--so-transition-fast);
  }

  .matrix__modal-tier-option:hover {
    border-color: #a78bfa;
    background: #f5f3ff;
  }

  .matrix__modal-tier-option--selected {
    border-color: #8b5cf6;
    background: #f5f3ff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .matrix__modal-tier-option--selected:hover {
    border-color: #7c3aed;
    background: #f5f3ff;
  }

  /* Custom checkbox styling */
  .matrix__modal-tier-checkbox {
    position: relative;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    appearance: none;
    -webkit-appearance: none;
    background: #ffffff;
    border: 2px solid #94a3b8;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all var(--so-transition-fast);
  }

  .matrix__modal-tier-checkbox:checked {
    background: #7c3aed;
    border-color: #7c3aed;
  }

  .matrix__modal-tier-checkbox:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.375rem;
    height: 0.625rem;
    border: 2px solid white;
    border-top: none;
    border-left: none;
    transform: translate(-50%, -60%) rotate(45deg);
  }

  .matrix__modal-tier-option:hover .matrix__modal-tier-checkbox:not(:checked) {
    border-color: #a78bfa;
  }

  .matrix__modal-tier-name {
    flex: 1;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1e293b;
  }

  .matrix__modal-tier-price {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #64748b;
    white-space: nowrap;
  }

  .matrix__modal-tier-option--selected .matrix__modal-tier-name {
    color: #4c1d95;
  }

  .matrix__modal-tier-option--selected .matrix__modal-tier-price {
    color: #7c3aed;
  }

  .matrix__modal-tier-hint {
    font-size: 0.8125rem;
    color: #64748b;
    margin: 0.75rem 0 0;
    font-style: italic;
  }

  .matrix__modal-hint strong {
    color: #334155;
    font-weight: 600;
  }
`;

export function TheMatrix({
  document,
  dispatch,
  groupSetupFees = {},
}: TheMatrixProps) {
  const { state } = document;
  const services = state.global.services ?? [];
  const tiers = state.global.tiers ?? [];
  const optionGroups = state.global.optionGroups ?? [];

  const [enabledOptionalGroups, setEnabledOptionalGroups] = useState<
    Set<string>
  >(new Set(optionGroups.filter((g) => g.defaultSelected).map((g) => g.id)));

  const [selectedCell, setSelectedCell] = useState<{
    serviceId: string;
    tierId: string;
  } | null>(null);

  const [addServiceModal, setAddServiceModal] = useState<{
    groupId: string;
    isSetupFormation: boolean;
  } | null>(null);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [newServiceSelectedTiers, setNewServiceSelectedTiers] = useState<
    Set<string>
  >(new Set());

  const [selectedTierIdx, setSelectedTierIdx] = useState<number>(0);

  const [selectedFacets, setSelectedFacets] = useState<Record<string, string>>({
    FUNCTION: "operational-hub",
    LEGAL_ENTITY: "swiss-association",
    TEAM_STRUCTURE: "remote-team",
    ANONYMITY: "high-anonymity",
  });

  const getServiceGroup = (service: Service): string | null => {
    // Services now have optionGroupId directly on them
    return service.optionGroupId || null;
  };

  const groupedServices = useMemo(() => {
    const groups: Map<string, Service[]> = new Map();
    optionGroups.forEach((g) => groups.set(g.id, []));
    groups.set(UNGROUPED_ID, []);

    services.forEach((service) => {
      const groupId = getServiceGroup(service) || UNGROUPED_ID;
      const groupServices = groups.get(groupId) || [];
      groupServices.push(service);
      groups.set(groupId, groupServices);
    });

    return groups;
  }, [services, tiers, optionGroups]);

  const setupGroups = useMemo(() => {
    // Groups are setup groups if they're in groupSetupFees (passed from parent)
    return optionGroups.filter((g) => groupSetupFees && g.id in groupSetupFees);
  }, [optionGroups, groupSetupFees]);

  const regularGroups = useMemo(() => {
    // Regular groups are not setup groups and not add-ons
    const isSetupGroup = (groupId: string) =>
      groupSetupFees && groupId in groupSetupFees;
    return optionGroups.filter((g) => !isSetupGroup(g.id) && !g.isAddOn);
  }, [optionGroups, groupSetupFees]);

  const addonGroups = useMemo(() => {
    return optionGroups.filter((g) => g.isAddOn);
  }, [optionGroups]);

  const ungroupedSetupServices = useMemo(() => {
    return (groupedServices.get(UNGROUPED_ID) || []).filter(
      (s) => s.isSetupFormation,
    );
  }, [groupedServices]);

  const ungroupedRegularServices = useMemo(() => {
    return (groupedServices.get(UNGROUPED_ID) || []).filter(
      (s) => !s.isSetupFormation,
    );
  }, [groupedServices]);

  const getServiceLevelForTier = (
    serviceId: string,
    tier: ServiceSubscriptionTier,
  ) => {
    return tier.serviceLevels.find((sl) => sl.serviceId === serviceId);
  };

  const getUniqueMetricsForService = (serviceId: string): string[] => {
    const metricsSet = new Set<string>();
    tiers.forEach((tier) => {
      tier.usageLimits
        .filter((ul) => ul.serviceId === serviceId)
        .forEach((ul) => metricsSet.add(ul.metric));
    });
    return Array.from(metricsSet);
  };

  const getUsageLimitForMetric = (
    serviceId: string,
    metric: string,
    tier: ServiceSubscriptionTier,
  ): ServiceUsageLimit | undefined => {
    return tier.usageLimits.find(
      (ul) => ul.serviceId === serviceId && ul.metric === metric,
    );
  };

  const handleSetServiceLevel = (
    serviceId: string,
    tierId: string,
    level: ServiceLevel,
    existingLevelId?: string,
    optionGroupId?: string,
  ) => {
    if (existingLevelId) {
      dispatch(
        updateServiceLevel({
          tierId,
          serviceLevelId: existingLevelId,
          level,
          lastModified: new Date().toISOString(),
        }),
      );
    } else {
      dispatch(
        addServiceLevel({
          tierId,
          serviceLevelId: generateId(),
          serviceId,
          level,
          optionGroupId,
          lastModified: new Date().toISOString(),
        }),
      );
    }
  };

  const toggleOptionalGroup = (groupId: string) => {
    setEnabledOptionalGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleAddService = () => {
    if (!addServiceModal || !newServiceName.trim()) return;

    const newServiceId = generateId();
    const now = new Date().toISOString();

    // Add the service with optionGroupId directly on the service
    dispatch(
      addService({
        id: newServiceId,
        title: newServiceName.trim(),
        description: newServiceDescription.trim() || null,
        isSetupFormation: addServiceModal.isSetupFormation,
        optionGroupId:
          addServiceModal.groupId !== UNGROUPED_ID
            ? addServiceModal.groupId
            : undefined,
        lastModified: now,
      }),
    );

    // Create ServiceLevelBindings for each selected tier
    newServiceSelectedTiers.forEach((tierId) => {
      dispatch(
        addServiceLevel({
          tierId,
          serviceLevelId: generateId(),
          serviceId: newServiceId,
          level: "INCLUDED",
          optionGroupId:
            addServiceModal.groupId !== UNGROUPED_ID
              ? addServiceModal.groupId
              : undefined,
          lastModified: now,
        }),
      );
    });

    setNewServiceName("");
    setNewServiceDescription("");
    setNewServiceSelectedTiers(new Set());
    setAddServiceModal(null);
  };

  const openAddServiceModal = (groupId: string, isSetupFormation: boolean) => {
    setAddServiceModal({ groupId, isSetupFormation });
    setNewServiceName("");
    setNewServiceDescription("");
    setNewServiceSelectedTiers(new Set());
  };

  const getLevelDisplay = (
    serviceLevel: ServiceLevelBinding | undefined,
  ): { label: string; color: string } => {
    if (!serviceLevel) return { label: "—", color: "var(--so-slate-300)" };

    const level = serviceLevel.level;
    const config = SERVICE_LEVELS.find((l) => l.value === level);

    if (level === "CUSTOM" && serviceLevel.customValue) {
      return {
        label: serviceLevel.customValue,
        color: config?.color || "var(--so-amber-600)",
      };
    }

    return {
      label: config?.shortLabel || level,
      color: config?.color || "var(--so-slate-600)",
    };
  };

  if (services.length === 0 || tiers.length === 0) {
    return (
      <>
        <style>{matrixStyles}</style>
        <div className="matrix">
          <div className="matrix__empty">
            <svg
              className="matrix__empty-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <h3 className="matrix__empty-title">Matrix Not Ready</h3>
            <p className="matrix__empty-text">
              {services.length === 0 && tiers.length === 0
                ? "Add services in the Service Catalog and tiers in Tier Definition to configure the matrix."
                : services.length === 0
                  ? "Add services in the Service Catalog to configure the matrix."
                  : "Add tiers in Tier Definition to configure the matrix."}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{matrixStyles}</style>
      <div className="matrix">
        {/* Facet Selector */}
        <div className="matrix__facets">
          <div className="matrix__facets-row">
            {Object.entries(FACET_CATEGORIES).map(([key, category]) => (
              <div key={key} className="matrix__facet-group">
                <span className="matrix__facet-label">{category.label}</span>
                {key === "ANONYMITY" ? (
                  <div className="matrix__toggle-group">
                    {category.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() =>
                          setSelectedFacets((prev) => ({
                            ...prev,
                            [key]: option.id,
                          }))
                        }
                        className={`matrix__toggle-btn ${
                          selectedFacets[key] === option.id
                            ? "matrix__toggle-btn--active"
                            : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <select
                    value={selectedFacets[key] || ""}
                    onChange={(e) =>
                      setSelectedFacets((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="matrix__facet-select"
                  >
                    {category.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
          {selectedFacets.ANONYMITY === "highest-anonymity" && (
            <div className="matrix__facet-notice">
              <p className="matrix__facet-notice-text">
                <strong>Highest Anonymity:</strong> Additional setup services
                may be required for enhanced privacy configurations.
              </p>
            </div>
          )}
        </div>

        <div className="matrix__table-wrap">
          <table className="matrix__table">
            <thead>
              <tr>
                <th className="matrix__corner-cell" />
                {tiers.map((tier, idx) => (
                  <th
                    key={tier.id}
                    onClick={() => setSelectedTierIdx(idx)}
                    className={`matrix__tier-header ${
                      idx === selectedTierIdx
                        ? "matrix__tier-header--selected"
                        : ""
                    }`}
                  >
                    <div className="matrix__tier-header-inner">
                      <div className="matrix__tier-radio" />
                      <span className="matrix__tier-name">{tier.name}</span>
                      <span className="matrix__tier-price">
                        {tier.isCustomPricing
                          ? "Custom"
                          : `$${tier.pricing.amount}/mo`}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={tiers.length + 1}
                  className="matrix__section-header"
                >
                  Service Catalog
                </td>
              </tr>

              {/* Setup & Formation category header */}
              {(setupGroups.length > 0 ||
                ungroupedSetupServices.length > 0) && (
                <tr>
                  <td
                    colSpan={tiers.length + 1}
                    className="matrix__category-header"
                  >
                    <span className="matrix__category-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                      >
                        <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
                        <path d="M9 21v-6h6v6" />
                        <path d="M9 7h.01M9 11h.01M15 7h.01M15 11h.01" />
                      </svg>
                    </span>
                    Setup & Formation
                  </td>
                </tr>
              )}

              {setupGroups.map((group) => (
                <ServiceGroupSection
                  key={group.id}
                  group={group}
                  services={groupedServices.get(group.id) || []}
                  tiers={tiers}
                  isSetupFormation={true}
                  isOptional={false}
                  isEnabled={true}
                  onToggle={() => {}}
                  getServiceLevelForTier={getServiceLevelForTier}
                  getUniqueMetricsForService={getUniqueMetricsForService}
                  getUsageLimitForMetric={getUsageLimitForMetric}
                  getLevelDisplay={getLevelDisplay}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  handleSetServiceLevel={handleSetServiceLevel}
                  dispatch={dispatch}
                  setupFee={groupSetupFees[group.id]}
                  onAddService={openAddServiceModal}
                  selectedTierIdx={selectedTierIdx}
                />
              ))}

              {ungroupedSetupServices.length > 0 && (
                <ServiceGroupSection
                  key="ungrouped-setup"
                  group={{
                    id: UNGROUPED_ID,
                    name: "Setup & Formation",
                    description: null,
                    isAddOn: false,
                    defaultSelected: true,
                  }}
                  services={ungroupedSetupServices}
                  tiers={tiers}
                  isSetupFormation={true}
                  isOptional={false}
                  isEnabled={true}
                  onToggle={() => {}}
                  getServiceLevelForTier={getServiceLevelForTier}
                  getUniqueMetricsForService={getUniqueMetricsForService}
                  getUsageLimitForMetric={getUsageLimitForMetric}
                  getLevelDisplay={getLevelDisplay}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  handleSetServiceLevel={handleSetServiceLevel}
                  dispatch={dispatch}
                  setupFee={groupSetupFees[UNGROUPED_ID]}
                  selectedTierIdx={selectedTierIdx}
                />
              )}

              {/* Recurring Services category header */}
              {(regularGroups.length > 0 ||
                ungroupedRegularServices.length > 0) && (
                <tr>
                  <td
                    colSpan={tiers.length + 1}
                    className="matrix__category-header"
                  >
                    <span className="matrix__category-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    </span>
                    Recurring Services
                  </td>
                </tr>
              )}

              {regularGroups.map((group) => (
                <ServiceGroupSection
                  key={group.id}
                  group={group}
                  services={groupedServices.get(group.id) || []}
                  tiers={tiers}
                  isSetupFormation={false}
                  isOptional={false}
                  isEnabled={true}
                  onToggle={() => {}}
                  getServiceLevelForTier={getServiceLevelForTier}
                  getUniqueMetricsForService={getUniqueMetricsForService}
                  getUsageLimitForMetric={getUsageLimitForMetric}
                  getLevelDisplay={getLevelDisplay}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  handleSetServiceLevel={handleSetServiceLevel}
                  onAddService={openAddServiceModal}
                  selectedTierIdx={selectedTierIdx}
                  dispatch={dispatch}
                />
              ))}

              {ungroupedRegularServices.length > 0 && (
                <ServiceGroupSection
                  key="ungrouped-regular"
                  group={{
                    id: UNGROUPED_ID,
                    name: "Recurring Services",
                    description: null,
                    isAddOn: false,
                    defaultSelected: true,
                  }}
                  services={ungroupedRegularServices}
                  tiers={tiers}
                  isSetupFormation={false}
                  isOptional={false}
                  isEnabled={true}
                  onToggle={() => {}}
                  getServiceLevelForTier={getServiceLevelForTier}
                  getUniqueMetricsForService={getUniqueMetricsForService}
                  getUsageLimitForMetric={getUsageLimitForMetric}
                  getLevelDisplay={getLevelDisplay}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  handleSetServiceLevel={handleSetServiceLevel}
                  dispatch={dispatch}
                  selectedTierIdx={selectedTierIdx}
                />
              )}

              <tr className="matrix__total-row">
                <td>SUBTOTAL</td>
                {tiers.map((tier) => (
                  <td key={tier.id} style={{ textAlign: "center" }}>
                    {tier.isCustomPricing
                      ? "Custom"
                      : `$${tier.pricing.amount}`}
                  </td>
                ))}
              </tr>

              {addonGroups.map((group) => (
                <ServiceGroupSection
                  key={group.id}
                  group={group}
                  services={groupedServices.get(group.id) || []}
                  tiers={tiers}
                  isSetupFormation={false}
                  isOptional={true}
                  isEnabled={enabledOptionalGroups.has(group.id)}
                  onToggle={() => toggleOptionalGroup(group.id)}
                  getServiceLevelForTier={getServiceLevelForTier}
                  getUniqueMetricsForService={getUniqueMetricsForService}
                  getUsageLimitForMetric={getUsageLimitForMetric}
                  getLevelDisplay={getLevelDisplay}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  handleSetServiceLevel={handleSetServiceLevel}
                  dispatch={dispatch}
                  onAddService={openAddServiceModal}
                  selectedTierIdx={selectedTierIdx}
                />
              ))}

              <tr className="matrix__grand-total-row">
                <td>Grand Total (Recurring)</td>
                {tiers.map((tier, idx) => {
                  const tierPrice = tier.pricing.amount || 0;
                  const grandTotal = tierPrice;

                  return (
                    <td
                      key={tier.id}
                      className={
                        idx === selectedTierIdx
                          ? "matrix__grand-total-cell--selected"
                          : ""
                      }
                      style={{ textAlign: "center" }}
                    >
                      {tier.isCustomPricing ? "Custom" : `$${grandTotal}/mo`}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {selectedCell && (
          <ServiceLevelDetailPanel
            serviceId={selectedCell.serviceId}
            tierId={selectedCell.tierId}
            services={services}
            tiers={tiers}
            optionGroups={optionGroups}
            dispatch={dispatch}
            onClose={() => setSelectedCell(null)}
          />
        )}

        {addServiceModal && (
          <div className="matrix__modal-overlay">
            <div className="matrix__modal matrix__modal--wide">
              <h3 className="matrix__modal-title">Add New Service</h3>

              {/* Service Name */}
              <div className="matrix__modal-field">
                <label className="matrix__modal-label">Service Name</label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Enter service name"
                  className="matrix__modal-input"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div className="matrix__modal-field">
                <label className="matrix__modal-label">
                  Description (optional)
                </label>
                <textarea
                  value={newServiceDescription}
                  onChange={(e) => setNewServiceDescription(e.target.value)}
                  placeholder="Enter description..."
                  rows={2}
                  className="matrix__modal-textarea"
                />
              </div>

              {/* Tier Selection */}
              {tiers.length > 0 && (
                <div className="matrix__modal-field">
                  <label className="matrix__modal-label">
                    Include in Tiers
                  </label>
                  <div className="matrix__modal-tier-grid">
                    {tiers.map((tier) => {
                      const isSelected = newServiceSelectedTiers.has(tier.id);
                      return (
                        <label
                          key={tier.id}
                          className={`matrix__modal-tier-option ${isSelected ? "matrix__modal-tier-option--selected" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const newSet = new Set(newServiceSelectedTiers);
                              if (e.target.checked) {
                                newSet.add(tier.id);
                              } else {
                                newSet.delete(tier.id);
                              }
                              setNewServiceSelectedTiers(newSet);
                            }}
                            className="matrix__modal-tier-checkbox"
                          />
                          <span className="matrix__modal-tier-name">
                            {tier.name}
                          </span>
                          {tier.pricing.amount !== null && (
                            <span className="matrix__modal-tier-price">
                              ${tier.pricing.amount}/
                              {tier.pricing.billingCycle.toLowerCase()}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  {newServiceSelectedTiers.size === 0 && (
                    <p className="matrix__modal-tier-hint">
                      Select at least one tier to include this service
                    </p>
                  )}
                </div>
              )}

              <p className="matrix__modal-hint">
                This service will be added to{" "}
                <strong>
                  {addServiceModal.groupId !== UNGROUPED_ID
                    ? optionGroups.find((g) => g.id === addServiceModal.groupId)
                        ?.name || "Unknown Group"
                    : "Ungrouped Services"}
                </strong>{" "}
                as a{" "}
                {addServiceModal.isSetupFormation
                  ? "Setup/Formation"
                  : "Recurring"}{" "}
                service.
              </p>

              <div className="matrix__modal-actions">
                <button
                  onClick={() => {
                    setAddServiceModal(null);
                    setNewServiceName("");
                    setNewServiceDescription("");
                    setNewServiceSelectedTiers(new Set());
                  }}
                  className="matrix__modal-btn matrix__modal-btn--cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddService}
                  disabled={
                    !newServiceName.trim() || newServiceSelectedTiers.size === 0
                  }
                  className="matrix__modal-btn matrix__modal-btn--primary"
                >
                  Add Service
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

interface ServiceGroupSectionProps {
  group: OptionGroup;
  services: Service[];
  tiers: ServiceSubscriptionTier[];
  isSetupFormation: boolean;
  isOptional: boolean;
  isEnabled: boolean;
  onToggle: () => void;
  getServiceLevelForTier: (
    serviceId: string,
    tier: ServiceSubscriptionTier,
  ) => ServiceLevelBinding | undefined;
  getUniqueMetricsForService: (serviceId: string) => string[];
  getUsageLimitForMetric: (
    serviceId: string,
    metric: string,
    tier: ServiceSubscriptionTier,
  ) => ServiceUsageLimit | undefined;
  getLevelDisplay: (serviceLevel: ServiceLevelBinding | undefined) => {
    label: string;
    color: string;
  };
  selectedCell: { serviceId: string; tierId: string } | null;
  setSelectedCell: (cell: { serviceId: string; tierId: string } | null) => void;
  handleSetServiceLevel: (
    serviceId: string,
    tierId: string,
    level: ServiceLevel,
    existingLevelId?: string,
    optionGroupId?: string,
  ) => void;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  setupFee?: number | null;
  onAddService?: (groupId: string, isSetupFormation: boolean) => void;
  selectedTierIdx: number;
}

function ServiceGroupSection({
  group,
  services,
  tiers,
  isSetupFormation,
  isOptional,
  isEnabled,
  onToggle,
  getServiceLevelForTier,
  getUniqueMetricsForService,
  getUsageLimitForMetric,
  getLevelDisplay,
  selectedCell,
  setSelectedCell,
  setupFee,
  onAddService,
  selectedTierIdx,
}: ServiceGroupSectionProps) {
  const showGroup = services.length > 0 || onAddService;
  if (!showGroup) return null;

  const headerClass = isSetupFormation
    ? "matrix__group-header--setup"
    : isOptional
      ? "matrix__group-header--optional"
      : "matrix__group-header--regular";

  const rowClass = isSetupFormation
    ? "matrix__service-row--setup"
    : isOptional
      ? "matrix__service-row--optional"
      : "matrix__service-row--regular";

  return (
    <>
      <tr className={`matrix__group-header ${headerClass}`}>
        <td className={`matrix__group-header-sticky ${headerClass}`}>
          <div className="matrix__group-header-inner">
            {isOptional && (
              <button
                onClick={onToggle}
                className={`matrix__group-toggle ${isEnabled ? "matrix__group-toggle--on" : "matrix__group-toggle--off"}`}
              >
                <span className="matrix__group-toggle-knob" />
              </button>
            )}
            <span className="matrix__group-name">{group.name}</span>
          </div>
        </td>
        <td
          colSpan={tiers.length}
          className={headerClass}
          style={{ textAlign: "center" }}
        >
          <span
            className={`matrix__group-badge ${
              isSetupFormation || !isOptional
                ? "matrix__group-badge--included"
                : "matrix__group-badge--optional"
            }`}
          >
            {isSetupFormation
              ? "INCLUDED"
              : isOptional
                ? "OPTIONAL"
                : "INCLUDED"}
          </span>
        </td>
      </tr>

      {services.map((service) => {
        const metrics = getUniqueMetricsForService(service.id);

        return (
          <ServiceRowWithMetrics
            key={service.id}
            service={service}
            metrics={metrics}
            tiers={tiers}
            rowClass={rowClass}
            getServiceLevelForTier={getServiceLevelForTier}
            getUsageLimitForMetric={getUsageLimitForMetric}
            getLevelDisplay={getLevelDisplay}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
            selectedTierIdx={selectedTierIdx}
          />
        );
      })}

      {onAddService && group.id !== "__ungrouped__" && (
        <tr className={`matrix__add-service-row ${rowClass}`}>
          <td className={rowClass}>
            <button
              onClick={() => onAddService(group.id, isSetupFormation)}
              className="matrix__add-service-btn"
            >
              <svg
                className="matrix__add-service-icon"
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
              + Add a Service
            </button>
          </td>
          <td colSpan={tiers.length} className={rowClass} />
        </tr>
      )}

      {isSetupFormation && (
        <tr className="matrix__setup-total-row">
          <td>TOTAL SETUP FEE</td>
          <td colSpan={tiers.length} style={{ textAlign: "center" }}>
            {setupFee
              ? `$${setupFee} flat fee (applied to all tiers)`
              : "No setup fee configured"}
          </td>
        </tr>
      )}

      {isOptional && (
        <tr className={`matrix__total-row ${headerClass}`}>
          <td className={headerClass}>SUBTOTAL</td>
          {tiers.map((tier, tierIdx) => {
            const priceDisplay = "$0";

            return (
              <td
                key={tier.id}
                style={{
                  textAlign: "center",
                  background:
                    tierIdx === selectedTierIdx && isEnabled
                      ? "var(--so-violet-200)"
                      : undefined,
                  color:
                    tierIdx === selectedTierIdx && isEnabled
                      ? "var(--so-violet-900)"
                      : undefined,
                }}
              >
                {isEnabled ? priceDisplay : "$0"}
              </td>
            );
          })}
        </tr>
      )}
    </>
  );
}

interface ServiceRowWithMetricsProps {
  service: Service;
  metrics: string[];
  tiers: ServiceSubscriptionTier[];
  rowClass: string;
  getServiceLevelForTier: (
    serviceId: string,
    tier: ServiceSubscriptionTier,
  ) => ServiceLevelBinding | undefined;
  getUsageLimitForMetric: (
    serviceId: string,
    metric: string,
    tier: ServiceSubscriptionTier,
  ) => ServiceUsageLimit | undefined;
  getLevelDisplay: (serviceLevel: ServiceLevelBinding | undefined) => {
    label: string;
    color: string;
  };
  selectedCell: { serviceId: string; tierId: string } | null;
  setSelectedCell: (cell: { serviceId: string; tierId: string } | null) => void;
  selectedTierIdx: number;
}

function ServiceRowWithMetrics({
  service,
  metrics,
  tiers,
  rowClass,
  getServiceLevelForTier,
  getUsageLimitForMetric,
  getLevelDisplay,
  selectedCell,
  setSelectedCell,
  selectedTierIdx,
}: ServiceRowWithMetricsProps) {
  return (
    <>
      <tr className={`matrix__service-row ${rowClass}`}>
        <td className={`matrix__service-cell ${rowClass}`}>
          <span className="matrix__service-title">{service.title}</span>
        </td>
        {tiers.map((tier, tierIdx) => {
          const serviceLevel = getServiceLevelForTier(service.id, tier);
          const display = getLevelDisplay(serviceLevel);
          const isSelected =
            selectedCell?.serviceId === service.id &&
            selectedCell?.tierId === tier.id;

          return (
            <td
              key={tier.id}
              className={`matrix__level-cell ${
                isSelected ? "matrix__level-cell--selected" : ""
              } ${tierIdx === selectedTierIdx ? "matrix__level-cell--highlight" : ""}`}
              onClick={() =>
                setSelectedCell(
                  isSelected
                    ? null
                    : { serviceId: service.id, tierId: tier.id },
                )
              }
            >
              <span
                className="matrix__level-value"
                style={{ color: display.color }}
              >
                {display.label}
              </span>
            </td>
          );
        })}
      </tr>

      {metrics.map((metric) => (
        <tr
          key={`${service.id}-${metric}`}
          className={`matrix__metric-row ${rowClass}`}
        >
          <td className={`matrix__metric-cell ${rowClass}`}>
            <span className="matrix__metric-name">{metric}</span>
          </td>
          {tiers.map((tier, tierIdx) => {
            const usageLimit = getUsageLimitForMetric(service.id, metric, tier);

            return (
              <td
                key={tier.id}
                className={`matrix__metric-value-cell ${
                  tierIdx === selectedTierIdx
                    ? "matrix__level-cell--highlight"
                    : ""
                }`}
              >
                <span className="matrix__metric-value">
                  {usageLimit
                    ? usageLimit.limit
                      ? `Up to ${usageLimit.limit}`
                      : "Unlimited"
                    : "—"}
                </span>
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

interface ServiceLevelDetailPanelProps {
  serviceId: string;
  tierId: string;
  services: Service[];
  tiers: ServiceSubscriptionTier[];
  optionGroups: OptionGroup[];
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  onClose: () => void;
}

function ServiceLevelDetailPanel({
  serviceId,
  tierId,
  services,
  tiers,
  optionGroups: _optionGroups,
  dispatch,
  onClose,
}: ServiceLevelDetailPanelProps) {
  const service = services.find((s) => s.id === serviceId);
  const tier = tiers.find((t) => t.id === tierId);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Scroll lock when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus trap - keep focus inside the panel
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, []);

  // Click outside to close
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  const serviceLevel = service
    ? tier?.serviceLevels.find((sl) => sl.serviceId === serviceId)
    : undefined;
  const usageLimits = service
    ? tier?.usageLimits.filter((ul) => ul.serviceId === serviceId) || []
    : [];

  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [newMetric, setNewMetric] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [customValue, setCustomValue] = useState(
    serviceLevel?.customValue || "",
  );

  if (!service || !tier) return null;

  const handleAddLimit = () => {
    if (!newMetric.trim()) return;
    dispatch(
      addUsageLimit({
        tierId: tier.id,
        limitId: generateId(),
        serviceId: service.id,
        metric: newMetric.trim(),
        limit: newLimit ? parseInt(newLimit) : undefined,
        resetPeriod: "MONTHLY",
        lastModified: new Date().toISOString(),
      }),
    );
    setNewMetric("");
    setNewLimit("");
    setIsAddingMetric(false);
  };

  const handleRemoveLimit = (limitId: string) => {
    dispatch(
      removeUsageLimit({
        tierId: tier.id,
        limitId,
        lastModified: new Date().toISOString(),
      }),
    );
  };

  const handleSetLevel = (level: ServiceLevel) => {
    if (serviceLevel) {
      dispatch(
        updateServiceLevel({
          tierId: tier.id,
          serviceLevelId: serviceLevel.id,
          level,
          customValue: level === "CUSTOM" ? customValue : undefined,
          lastModified: new Date().toISOString(),
        }),
      );
    } else {
      dispatch(
        addServiceLevel({
          tierId: tier.id,
          serviceLevelId: generateId(),
          serviceId: service.id,
          level,
          customValue: level === "CUSTOM" ? customValue : undefined,
          lastModified: new Date().toISOString(),
        }),
      );
    }
  };

  const handleUpdateCustomValue = () => {
    if (serviceLevel && serviceLevel.level === "CUSTOM") {
      dispatch(
        updateServiceLevel({
          tierId: tier.id,
          serviceLevelId: serviceLevel.id,
          customValue,
          lastModified: new Date().toISOString(),
        }),
      );
    }
  };

  return (
    <div
      ref={overlayRef}
      className="matrix__panel-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
    >
      <div ref={panelRef} className="matrix__panel">
        <div className="matrix__panel-header">
          <div className="matrix__panel-header-top">
            <span className="matrix__panel-tier">{tier.name} Tier</span>
            <button onClick={onClose} className="matrix__panel-close">
              <svg
                className="matrix__panel-close-icon"
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
          <h3 id="panel-title" className="matrix__panel-title">
            {service.title}
          </h3>
        </div>

        <div className="matrix__panel-body">
          <div>
            <label className="matrix__panel-section-label">Service Level</label>
            <div className="matrix__panel-level-grid">
              {SERVICE_LEVELS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSetLevel(option.value)}
                  className={`matrix__panel-level-btn ${
                    serviceLevel?.level === option.value
                      ? "matrix__panel-level-btn--active"
                      : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {serviceLevel?.level === "CUSTOM" && (
            <div>
              <label className="matrix__panel-section-label">
                Custom Value
              </label>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onBlur={handleUpdateCustomValue}
                placeholder="e.g., Expedited, Basic, Pro"
                className="matrix__panel-input"
              />
            </div>
          )}

          <div>
            <div className="matrix__panel-limits-header">
              <label
                className="matrix__panel-section-label"
                style={{ marginBottom: 0 }}
              >
                Usage Limits / Metrics
              </label>
              <button
                onClick={() => setIsAddingMetric(true)}
                className="matrix__panel-add-btn"
              >
                + Add Metric
              </button>
            </div>

            {usageLimits.map((limit) => (
              <MetricLimitItem
                key={limit.id}
                limit={limit}
                tierId={tier.id}
                dispatch={dispatch}
                onRemove={() => handleRemoveLimit(limit.id)}
              />
            ))}

            {usageLimits.length === 0 && !isAddingMetric && (
              <p className="matrix__panel-empty-text">
                No metrics added yet. Metrics will appear as nested rows under
                this service in the matrix.
              </p>
            )}

            {isAddingMetric && (
              <div className="matrix__panel-edit-form">
                <div>
                  <label className="matrix__panel-edit-label">
                    Metric Name
                  </label>
                  <input
                    type="text"
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    placeholder="e.g., API Calls, Storage, Users"
                    className="matrix__panel-input"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="matrix__panel-edit-label">
                    Limit Value
                  </label>
                  <input
                    type="text"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    placeholder="e.g., 100, 5, leave empty for Unlimited"
                    className="matrix__panel-input"
                  />
                  <p className="matrix__panel-edit-hint">
                    Enter a number or leave empty for &quot;Unlimited&quot;
                  </p>
                </div>
                <div className="matrix__panel-edit-actions">
                  <button
                    onClick={handleAddLimit}
                    disabled={!newMetric.trim()}
                    className="matrix__panel-edit-btn matrix__panel-edit-btn--primary"
                  >
                    Add Metric
                  </button>
                  <button
                    onClick={() => {
                      setNewMetric("");
                      setNewLimit("");
                      setIsAddingMetric(false);
                    }}
                    className="matrix__panel-edit-btn matrix__panel-edit-btn--secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="matrix__panel-footer">
          <button onClick={onClose} className="matrix__panel-done-btn">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

interface MetricLimitItemProps {
  limit: ServiceUsageLimit;
  tierId: string;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  onRemove: () => void;
}

function MetricLimitItem({
  limit,
  tierId,
  dispatch,
  onRemove,
}: MetricLimitItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMetric, setEditMetric] = useState(limit.metric);
  const [editLimit, setEditLimit] = useState(limit.limit?.toString() || "");

  const handleSave = () => {
    dispatch(
      updateUsageLimit({
        tierId,
        limitId: limit.id,
        metric: editMetric.trim() || limit.metric,
        limit: editLimit ? parseInt(editLimit) : undefined,
        lastModified: new Date().toISOString(),
      }),
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditMetric(limit.metric);
    setEditLimit(limit.limit?.toString() || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="matrix__panel-edit-form">
        <div>
          <label className="matrix__panel-edit-label">Metric Name</label>
          <input
            type="text"
            value={editMetric}
            onChange={(e) => setEditMetric(e.target.value)}
            placeholder="Metric name"
            className="matrix__panel-input"
            autoFocus
          />
        </div>
        <div>
          <label className="matrix__panel-edit-label">Limit Value</label>
          <input
            type="text"
            value={editLimit}
            onChange={(e) => setEditLimit(e.target.value)}
            placeholder="e.g., 3, Unlimited, As needed"
            className="matrix__panel-input"
          />
          <p className="matrix__panel-edit-hint">
            Can be numeric (3) or descriptive (Unlimited, Custom)
          </p>
        </div>
        <div className="matrix__panel-edit-actions">
          <button
            onClick={handleSave}
            className="matrix__panel-edit-btn matrix__panel-edit-btn--primary"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="matrix__panel-edit-btn matrix__panel-edit-btn--secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="matrix__panel-limit-item">
      <div
        className="matrix__panel-limit-content"
        onClick={() => setIsEditing(true)}
      >
        <div className="matrix__panel-limit-metric">{limit.metric}</div>
        <div className="matrix__panel-limit-value">
          {limit.limit ? `Up to ${limit.limit}` : "Unlimited"}
        </div>
      </div>
      <div className="matrix__panel-limit-actions">
        <button
          onClick={() => setIsEditing(true)}
          className="matrix__panel-limit-btn matrix__panel-limit-btn--edit"
          title="Edit metric"
        >
          <svg
            className="matrix__panel-limit-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          onClick={onRemove}
          className="matrix__panel-limit-btn matrix__panel-limit-btn--remove"
          title="Remove metric"
        >
          <svg
            className="matrix__panel-limit-icon"
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
    </div>
  );
}
