import { useState, useCallback } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  ResourceTemplateDocument,
  ResourceTemplateAction,
} from "../../../document-models/resource-template/gen/types.js";
import {
  setFacetTarget,
  removeFacetTarget,
  addFacetOption,
  removeFacetOption,
} from "../../../document-models/resource-template/gen/creators.js";

interface FacetTargetingProps {
  document: ResourceTemplateDocument;
  dispatch: DocumentDispatch<ResourceTemplateAction>;
}

export function FacetTargeting({ document, dispatch }: FacetTargetingProps) {
  const facetTargets = document.state.global.facetTargets;

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState("");

  const [editingOptionFor, setEditingOptionFor] = useState<string | null>(null);
  const [newOptionId, setNewOptionId] = useState("");

  const handleAddCategory = useCallback(() => {
    if (!newCategoryLabel.trim()) return;

    const label = newCategoryLabel.trim();
    const key = label.toLowerCase().replace(/\s+/g, "-");

    dispatch(
      setFacetTarget({
        id: generateId(),
        categoryKey: key,
        categoryLabel: label,
        selectedOptions: [],
        lastModified: new Date().toISOString(),
      }),
    );

    setNewCategoryLabel("");
    setShowAddCategory(false);
  }, [newCategoryLabel, dispatch]);

  const handleRemoveCategory = useCallback(
    (categoryKey: string) => {
      if (
        window.confirm(
          "Are you sure you want to remove this facet category and all its options?",
        )
      ) {
        dispatch(
          removeFacetTarget({
            categoryKey,
            lastModified: new Date().toISOString(),
          }),
        );
      }
    },
    [dispatch],
  );

  const handleAddOption = useCallback(
    (categoryKey: string) => {
      if (!newOptionId.trim()) return;

      dispatch(
        addFacetOption({
          categoryKey,
          optionId: newOptionId.trim(),
          lastModified: new Date().toISOString(),
        }),
      );

      setNewOptionId("");
      setEditingOptionFor(null);
    },
    [newOptionId, dispatch],
  );

  const handleRemoveOption = useCallback(
    (categoryKey: string, optionId: string) => {
      dispatch(
        removeFacetOption({
          categoryKey,
          optionId,
          lastModified: new Date().toISOString(),
        }),
      );
    },
    [dispatch],
  );

  return (
    <>
      <style>{styles}</style>
      <section className="facet-targeting">
        <div className="facet-targeting__header">
          <div className="facet-targeting__header-content">
            <div className="facet-targeting__icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <div>
              <h3 className="facet-targeting__title">Facet Targeting</h3>
              <p className="facet-targeting__subtitle">
                Define configuration dimensions and their available options for
                this resource
              </p>
            </div>
          </div>
          <button
            type="button"
            className="facet-targeting__add-btn"
            onClick={() => setShowAddCategory(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Category
          </button>
        </div>

        {showAddCategory && (
          <div className="facet-targeting__new-category">
            <div className="facet-targeting__new-category-form">
              <div className="facet-targeting__form-group">
                <label className="facet-targeting__label">Category Name</label>
                <input
                  type="text"
                  value={newCategoryLabel}
                  onChange={(e) => setNewCategoryLabel(e.target.value)}
                  placeholder="e.g., Region, Environment, Storage Type"
                  className="facet-targeting__input"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddCategory();
                    if (e.key === "Escape") setShowAddCategory(false);
                  }}
                />
              </div>
              <div className="facet-targeting__form-actions">
                <button
                  type="button"
                  className="facet-targeting__btn facet-targeting__btn--secondary"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryLabel("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="facet-targeting__btn facet-targeting__btn--primary"
                  onClick={handleAddCategory}
                  disabled={!newCategoryLabel.trim()}
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}

        {facetTargets.length === 0 && !showAddCategory ? (
          <div className="facet-targeting__empty">
            <div className="facet-targeting__empty-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <p className="facet-targeting__empty-text">
              No facet categories defined. Add categories like Region,
              Environment, or Storage Type to organize your resource options.
            </p>
            <button
              type="button"
              className="facet-targeting__btn facet-targeting__btn--primary"
              onClick={() => setShowAddCategory(true)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add First Category
            </button>
          </div>
        ) : (
          <div className="facet-targeting__categories">
            {facetTargets.map((target) => (
              <div key={target.categoryKey} className="facet-category">
                <div className="facet-category__header">
                  <div className="facet-category__info">
                    <span className="facet-category__label">
                      {target.categoryLabel}
                    </span>
                    <span className="facet-category__key">
                      {target.categoryKey}
                    </span>
                  </div>
                  <div className="facet-category__actions">
                    <button
                      type="button"
                      className="facet-category__btn"
                      onClick={() =>
                        setEditingOptionFor(
                          editingOptionFor === target.categoryKey
                            ? null
                            : target.categoryKey,
                        )
                      }
                      title="Add option"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="facet-category__btn facet-category__btn--danger"
                      onClick={() => handleRemoveCategory(target.categoryKey)}
                      title="Remove category"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {editingOptionFor === target.categoryKey && (
                  <div className="facet-category__add-option">
                    <input
                      type="text"
                      value={newOptionId}
                      onChange={(e) => setNewOptionId(e.target.value)}
                      placeholder="Enter option value..."
                      className="facet-targeting__input facet-targeting__input--sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleAddOption(target.categoryKey);
                        if (e.key === "Escape") {
                          setEditingOptionFor(null);
                          setNewOptionId("");
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="facet-targeting__btn facet-targeting__btn--primary facet-targeting__btn--sm"
                      onClick={() => handleAddOption(target.categoryKey)}
                      disabled={!newOptionId.trim()}
                    >
                      Add
                    </button>
                  </div>
                )}

                <div className="facet-category__options">
                  {target.selectedOptions.length === 0 ? (
                    <p className="facet-category__no-options">
                      No options added yet
                    </p>
                  ) : (
                    target.selectedOptions.map((optionId) => (
                      <div key={optionId} className="facet-option">
                        <span className="facet-option__label">{optionId}</span>
                        <button
                          type="button"
                          className="facet-option__remove"
                          onClick={() =>
                            handleRemoveOption(target.categoryKey, optionId)
                          }
                          title="Remove option"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

const styles = `
  .facet-targeting {
    background: var(--te-surface, #ffffff);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(26, 31, 54, 0.04), 0 4px 16px rgba(26, 31, 54, 0.06);
  }

  .facet-targeting__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .facet-targeting__header-content {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .facet-targeting__icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: #f5f3ff;
    color: #7c5cff;
  }

  .facet-targeting__icon svg {
    width: 20px;
    height: 20px;
  }

  .facet-targeting__title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--te-ink, #1a1f36);
    margin: 0 0 2px;
  }

  .facet-targeting__subtitle {
    font-size: 0.8125rem;
    color: var(--te-ink-muted, #8792a8);
    margin: 0;
  }

  .facet-targeting__add-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    background: #14b8a6;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .facet-targeting__add-btn:hover {
    background: #0d9488;
  }

  .facet-targeting__add-btn svg {
    width: 16px;
    height: 16px;
  }

  .facet-targeting__new-category {
    background: var(--te-surface-raised, #fafbfc);
    border: 1.5px solid var(--te-border, #e4e8f0);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
  }

  .facet-targeting__new-category-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .facet-targeting__form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .facet-targeting__form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .facet-targeting__label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--te-ink-muted, #8792a8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .facet-targeting__input {
    width: 100%;
    padding: 10px 14px;
    font-family: inherit;
    font-size: 0.875rem;
    border: 1.5px solid var(--te-border, #e4e8f0);
    border-radius: 8px;
    background: var(--te-surface, #ffffff);
    color: var(--te-ink, #1a1f36);
    transition: all 0.15s ease;
    box-sizing: border-box;
  }

  .facet-targeting__input:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
  }

  .facet-targeting__input--sm {
    padding: 8px 12px;
    font-size: 0.8125rem;
  }

  .facet-targeting__form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .facet-targeting__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 16px;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    border: none;
  }

  .facet-targeting__btn svg {
    width: 16px;
    height: 16px;
  }

  .facet-targeting__btn--primary {
    background: #14b8a6;
    color: white;
  }

  .facet-targeting__btn--primary:hover:not(:disabled) {
    background: #0d9488;
  }

  .facet-targeting__btn--primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .facet-targeting__btn--secondary {
    background: var(--te-surface-raised, #fafbfc);
    color: var(--te-ink-light, #4a5578);
    border: 1px solid var(--te-border, #e4e8f0);
  }

  .facet-targeting__btn--secondary:hover {
    background: var(--te-border-light, #f0f2f7);
  }

  .facet-targeting__btn--sm {
    padding: 6px 12px;
    font-size: 0.8125rem;
  }

  .facet-targeting__empty {
    padding: 40px 24px;
    text-align: center;
    background: var(--te-surface-raised, #fafbfc);
    border: 2px dashed var(--te-border, #e4e8f0);
    border-radius: 12px;
  }

  .facet-targeting__empty-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 12px;
    color: var(--te-border, #e4e8f0);
  }

  .facet-targeting__empty-icon svg {
    width: 100%;
    height: 100%;
  }

  .facet-targeting__empty-text {
    font-size: 0.875rem;
    color: var(--te-ink-muted, #8792a8);
    margin: 0 0 16px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .facet-targeting__categories {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .facet-category {
    background: var(--te-surface-raised, #fafbfc);
    border: 1px solid var(--te-border-light, #f0f2f7);
    border-radius: 12px;
    padding: 16px;
    transition: border-color 0.15s ease;
  }

  .facet-category:hover {
    border-color: var(--te-border, #e4e8f0);
  }

  .facet-category__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .facet-category__info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .facet-category__label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--te-ink, #1a1f36);
  }

  .facet-category__key {
    font-size: 0.75rem;
    font-family: 'DM Mono', monospace;
    color: var(--te-ink-muted, #8792a8);
    background: var(--te-border-light, #f0f2f7);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .facet-category__actions {
    display: flex;
    gap: 4px;
  }

  .facet-category__btn {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: var(--te-ink-muted, #8792a8);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .facet-category__btn:hover {
    background: var(--te-border-light, #f0f2f7);
    color: var(--te-ink-light, #4a5578);
  }

  .facet-category__btn--danger:hover {
    background: #fee2e2;
    color: #dc2626;
  }

  .facet-category__btn svg {
    width: 16px;
    height: 16px;
  }

  .facet-category__add-option {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .facet-category__add-option .facet-targeting__input {
    flex: 1;
  }

  .facet-category__options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .facet-category__no-options {
    font-size: 0.8125rem;
    color: var(--te-ink-muted, #8792a8);
    margin: 0;
    font-style: italic;
  }

  .facet-option {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px 6px 12px;
    background: var(--te-surface, #ffffff);
    border: 1px solid var(--te-border, #e4e8f0);
    border-radius: 6px;
    font-size: 0.8125rem;
    color: var(--te-ink, #1a1f36);
    transition: all 0.15s ease;
  }

  .facet-option:hover {
    border-color: var(--te-ink-muted, #8792a8);
  }

  .facet-option__label {
    font-weight: 500;
  }

  .facet-option__remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: var(--te-ink-muted, #8792a8);
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.15s ease;
  }

  .facet-option__remove:hover {
    opacity: 1;
    color: #dc2626;
    background: #fee2e2;
  }

  .facet-option__remove svg {
    width: 12px;
    height: 12px;
  }

  @media (max-width: 640px) {
    .facet-targeting__header {
      flex-direction: column;
      gap: 16px;
    }

    .facet-targeting__form-row {
      grid-template-columns: 1fr;
    }
  }
`;
