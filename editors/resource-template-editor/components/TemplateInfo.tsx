import { useState, useEffect, useRef } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  ResourceTemplateDocument,
  ResourceTemplateAction,
  TargetAudience,
} from "../../../document-models/resource-template/gen/types.js";
import {
  updateTemplateInfo,
  updateTemplateStatus,
  setOperator,
  addTargetAudience,
  removeTargetAudience,
  setSetupServices,
  setRecurringServices,
} from "../../../document-models/resource-template/gen/creators.js";

interface TemplateInfoProps {
  document: ResourceTemplateDocument;
  dispatch: DocumentDispatch<ResourceTemplateAction>;
}

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft", color: "slate" },
  { value: "COMING_SOON", label: "Coming Soon", color: "sky" },
  { value: "ACTIVE", label: "Active", color: "emerald" },
  { value: "DEPRECATED", label: "Deprecated", color: "rose" },
] as const;

const AUDIENCE_PRESETS = [
  { label: "Founders", color: "#8b5cf6" },
  { label: "SNO Governors", color: "#f43f5e" },
  { label: "Builders", color: "#0ea5e9" },
  { label: "Operators", color: "#f97316" },
  { label: "Contributors", color: "#10b981" },
  { label: "Investors", color: "#6366f1" },
];

export function TemplateInfo({ document, dispatch }: TemplateInfoProps) {
  const { state } = document;
  const globalState = state.global;

  const [formData, setFormData] = useState({
    title: globalState.title || "",
    summary: globalState.summary || "",
    description: globalState.description || "",
    operatorId: globalState.operatorId || "",
    thumbnailUrl: globalState.thumbnailUrl || "",
    infoLink: globalState.infoLink || "",
    status: globalState.status,
  });

  const [newSetupService, setNewSetupService] = useState("");
  const [newRecurringService, setNewRecurringService] = useState("");
  const [newAudienceLabel, setNewAudienceLabel] = useState("");
  const [showAudienceInput, setShowAudienceInput] = useState(false);
  const setupServiceInputRef = useRef<HTMLInputElement>(null);
  const recurringServiceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      title: globalState.title || "",
      summary: globalState.summary || "",
      description: globalState.description || "",
      operatorId: globalState.operatorId || "",
      thumbnailUrl: globalState.thumbnailUrl || "",
      infoLink: globalState.infoLink || "",
      status: globalState.status,
    });
  }, [
    globalState.title,
    globalState.summary,
    globalState.description,
    globalState.operatorId,
    globalState.thumbnailUrl,
    globalState.infoLink,
    globalState.status,
  ]);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInfoBlur = () => {
    const changes: Record<string, string | null> = {};
    let hasChanges = false;

    if (formData.title !== globalState.title) {
      changes.title = formData.title;
      hasChanges = true;
    }
    if (formData.summary !== globalState.summary) {
      changes.summary = formData.summary;
      hasChanges = true;
    }
    if (formData.description !== (globalState.description || "")) {
      changes.description = formData.description || null;
      hasChanges = true;
    }
    if (formData.thumbnailUrl !== (globalState.thumbnailUrl || "")) {
      changes.thumbnailUrl = formData.thumbnailUrl || null;
      hasChanges = true;
    }
    if (formData.infoLink !== (globalState.infoLink || "")) {
      changes.infoLink = formData.infoLink || null;
      hasChanges = true;
    }

    if (hasChanges) {
      dispatch(
        updateTemplateInfo({
          ...changes,
          lastModified: new Date().toISOString(),
        }),
      );
    }
  };

  const handleOperatorBlur = () => {
    if (formData.operatorId !== globalState.operatorId) {
      dispatch(
        setOperator({
          operatorId: formData.operatorId,
          lastModified: new Date().toISOString(),
        }),
      );
    }
  };

  const handleStatusChange = (value: string) => {
    const status = value as "DRAFT" | "COMING_SOON" | "ACTIVE" | "DEPRECATED";
    setFormData((prev) => ({ ...prev, status }));
    dispatch(
      updateTemplateStatus({
        status,
        lastModified: new Date().toISOString(),
      }),
    );
  };

  const handleAddAudience = (label: string, color?: string) => {
    if (!label.trim()) return;
    dispatch(
      addTargetAudience({
        id: generateId(),
        label: label.trim(),
        color: color || null,
        lastModified: new Date().toISOString(),
      }),
    );
    setNewAudienceLabel("");
    setShowAudienceInput(false);
  };

  const handleRemoveAudience = (id: string) => {
    dispatch(
      removeTargetAudience({
        id,
        lastModified: new Date().toISOString(),
      }),
    );
  };

  const handleAddSetupService = () => {
    if (!newSetupService.trim()) return;
    const updatedServices = [
      ...globalState.setupServices,
      newSetupService.trim(),
    ];
    dispatch(
      setSetupServices({
        services: updatedServices,
        lastModified: new Date().toISOString(),
      }),
    );
    setNewSetupService("");
    setupServiceInputRef.current?.focus();
  };

  const handleRemoveSetupService = (index: number) => {
    const updatedServices = globalState.setupServices.filter(
      (_, i) => i !== index,
    );
    dispatch(
      setSetupServices({
        services: updatedServices,
        lastModified: new Date().toISOString(),
      }),
    );
  };

  const handleAddRecurringService = () => {
    if (!newRecurringService.trim()) return;
    const updatedServices = [
      ...globalState.recurringServices,
      newRecurringService.trim(),
    ];
    dispatch(
      setRecurringServices({
        services: updatedServices,
        lastModified: new Date().toISOString(),
      }),
    );
    setNewRecurringService("");
    recurringServiceInputRef.current?.focus();
  };

  const handleRemoveRecurringService = (index: number) => {
    const updatedServices = globalState.recurringServices.filter(
      (_, i) => i !== index,
    );
    dispatch(
      setRecurringServices({
        services: updatedServices,
        lastModified: new Date().toISOString(),
      }),
    );
  };

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === formData.status);

  const availablePresets = AUDIENCE_PRESETS.filter(
    (preset) =>
      !globalState.targetAudiences.some((a) => a.label === preset.label),
  );

  return (
    <>
      <style>{styles}</style>
      <div className="template-editor">
        {/* Hero Section - Thumbnail & Core Identity */}
        <section className="template-editor__hero">
          <div className="template-editor__thumbnail-area">
            <div
              className="template-editor__thumbnail"
              style={{
                backgroundImage: formData.thumbnailUrl
                  ? `url(${formData.thumbnailUrl})`
                  : undefined,
              }}
            >
              {!formData.thumbnailUrl && (
                <div className="template-editor__thumbnail-placeholder">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span>Add Thumbnail</span>
                </div>
              )}
              {formData.thumbnailUrl && (
                <div
                  className={`template-editor__status-badge template-editor__status-badge--${currentStatus?.color}`}
                >
                  {currentStatus?.label}
                </div>
              )}
            </div>
            <div className="template-editor__thumbnail-input">
              <input
                type="text"
                value={formData.thumbnailUrl}
                onChange={(e) =>
                  handleFieldChange("thumbnailUrl", e.target.value)
                }
                onBlur={handleInfoBlur}
                placeholder="https://example.com/image.jpg"
                className="template-editor__input template-editor__input--sm"
              />
            </div>
          </div>

          <div className="template-editor__identity">
            <div className="template-editor__title-row">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                onBlur={handleInfoBlur}
                className="template-editor__title-input"
                placeholder="Resource Template Title"
              />
              <div className="template-editor__status-select">
                <select
                  value={formData.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="template-editor__select"
                  data-status={currentStatus?.color}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span
                  className={`template-editor__status-indicator template-editor__status-indicator--${currentStatus?.color}`}
                />
              </div>
            </div>

            {/* Target Audiences */}
            <div className="template-editor__audiences">
              {globalState.targetAudiences.map((audience: TargetAudience) => (
                <span
                  key={audience.id}
                  className="template-editor__audience-tag"
                  style={
                    audience.color
                      ? {
                          backgroundColor: `${audience.color}15`,
                          borderColor: `${audience.color}40`,
                          color: audience.color,
                        }
                      : undefined
                  }
                >
                  {audience.label}
                  <button
                    type="button"
                    onClick={() => handleRemoveAudience(audience.id)}
                    className="template-editor__audience-remove"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
                    </svg>
                  </button>
                </span>
              ))}

              {showAudienceInput ? (
                <div className="template-editor__audience-input-wrap">
                  <input
                    type="text"
                    value={newAudienceLabel}
                    onChange={(e) => setNewAudienceLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleAddAudience(newAudienceLabel);
                      if (e.key === "Escape") setShowAudienceInput(false);
                    }}
                    placeholder="Audience name..."
                    className="template-editor__audience-input"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleAddAudience(newAudienceLabel)}
                    className="template-editor__audience-add-btn"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAudienceInput(true)}
                  className="template-editor__add-audience-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5v14M5 12h14" strokeWidth="2" />
                  </svg>
                  Add Audience
                </button>
              )}
            </div>

            {availablePresets.length > 0 && (
              <div className="template-editor__audience-presets">
                <span className="template-editor__presets-label">
                  Quick add:
                </span>
                {availablePresets.slice(0, 4).map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      handleAddAudience(preset.label, preset.color)
                    }
                    className="template-editor__preset-btn"
                    style={{ color: preset.color }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            <textarea
              value={formData.summary}
              onChange={(e) => handleFieldChange("summary", e.target.value)}
              onBlur={handleInfoBlur}
              className="template-editor__summary"
              placeholder="Brief summary of your resource template..."
              rows={2}
            />
          </div>
        </section>

        {/* Description */}
        <section className="template-editor__card template-editor__card--full">
          <div className="template-editor__card-header">
            <div className="template-editor__card-icon template-editor__card-icon--violet">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            </div>
            <div>
              <h3 className="template-editor__card-title">Description</h3>
              <p className="template-editor__card-subtitle">
                Detailed description of your resource template
              </p>
            </div>
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            onBlur={handleInfoBlur}
            className="template-editor__textarea"
            placeholder="Provide a comprehensive description of your resource template, including what makes it unique and valuable..."
            rows={4}
          />
        </section>

        {/* Services Grid */}
        <div className="template-editor__grid">
          <section className="template-editor__card">
            <div className="template-editor__card-header">
              <div className="template-editor__card-icon template-editor__card-icon--emerald">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3 className="template-editor__card-title">
                  Formation & Setup
                </h3>
                <p className="template-editor__card-subtitle">
                  One-time setup services
                </p>
              </div>
            </div>
            <div className="template-editor__services">
              {globalState.setupServices.map(
                (service: string, index: number) => (
                  <div key={index} className="template-editor__service">
                    <span className="template-editor__service-bullet" />
                    <span className="template-editor__service-text">
                      {service}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSetupService(index)}
                      className="template-editor__service-remove"
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
                ),
              )}
              <div className="template-editor__add-service">
                <span className="template-editor__service-bullet template-editor__service-bullet--ghost" />
                <input
                  ref={setupServiceInputRef}
                  type="text"
                  value={newSetupService}
                  onChange={(e) => setNewSetupService(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddSetupService();
                  }}
                  placeholder="Add a setup service..."
                  className="template-editor__service-new-input"
                />
                {newSetupService && (
                  <button
                    type="button"
                    onClick={handleAddSetupService}
                    className="template-editor__service-add-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 5v14M5 12h14" strokeWidth="2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="template-editor__card">
            <div className="template-editor__card-header">
              <div className="template-editor__card-icon template-editor__card-icon--amber">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <div>
                <h3 className="template-editor__card-title">
                  Recurring Services
                </h3>
                <p className="template-editor__card-subtitle">
                  Ongoing services included
                </p>
              </div>
            </div>
            <div className="template-editor__services">
              {globalState.recurringServices.map(
                (service: string, index: number) => (
                  <div key={index} className="template-editor__service">
                    <span className="template-editor__service-bullet template-editor__service-bullet--recurring" />
                    <span className="template-editor__service-text">
                      {service}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecurringService(index)}
                      className="template-editor__service-remove"
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
                ),
              )}
              <div className="template-editor__add-service">
                <span className="template-editor__service-bullet template-editor__service-bullet--ghost" />
                <input
                  ref={recurringServiceInputRef}
                  type="text"
                  value={newRecurringService}
                  onChange={(e) => setNewRecurringService(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddRecurringService();
                  }}
                  placeholder="Add a recurring service..."
                  className="template-editor__service-new-input"
                />
                {newRecurringService && (
                  <button
                    type="button"
                    onClick={handleAddRecurringService}
                    className="template-editor__service-add-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 5v14M5 12h14" strokeWidth="2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Metadata Row */}
        <section className="template-editor__metadata">
          <div className="template-editor__meta-field">
            <label className="template-editor__label">Operator ID</label>
            <input
              type="text"
              value={formData.operatorId}
              onChange={(e) => handleFieldChange("operatorId", e.target.value)}
              onBlur={handleOperatorBlur}
              className="template-editor__input template-editor__input--mono"
              placeholder="operator-123"
            />
          </div>
          <div className="template-editor__meta-field">
            <label className="template-editor__label">More Info Link</label>
            <input
              type="text"
              value={formData.infoLink}
              onChange={(e) => handleFieldChange("infoLink", e.target.value)}
              onBlur={handleInfoBlur}
              className="template-editor__input"
              placeholder="https://example.com/more-info"
            />
          </div>
        </section>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');

  .template-editor {
    --te-font: 'Instrument Sans', system-ui, sans-serif;
    --te-mono: 'DM Mono', 'SF Mono', monospace;

    --te-ink: #1a1f36;
    --te-ink-light: #4a5578;
    --te-ink-muted: #8792a8;
    --te-surface: #ffffff;
    --te-surface-raised: #fafbfc;
    --te-border: #e4e8f0;
    --te-border-light: #f0f2f7;

    --te-violet: #7c5cff;
    --te-violet-light: #f4f1ff;
    --te-amber: #f59e0b;
    --te-amber-light: #fef7e6;
    --te-emerald: #10b981;
    --te-emerald-light: #e8faf3;
    --te-sky: #0ea5e9;
    --te-sky-light: #e8f7fc;
    --te-rose: #f43f5e;
    --te-rose-light: #fef1f3;
    --te-slate: #64748b;
    --te-slate-light: #f1f5f9;
    --te-teal: #14b8a6;
    --te-teal-light: #ccfbf1;

    font-family: var(--te-font);
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* Hero Section */
  .template-editor__hero {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 28px;
    background: var(--te-surface);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(26, 31, 54, 0.04), 0 4px 16px rgba(26, 31, 54, 0.06);
    border-left: 4px solid var(--te-teal);
  }

  .template-editor__thumbnail-area {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .template-editor__thumbnail {
    width: 160px;
    height: 120px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--te-border-light) 0%, var(--te-border) 100%);
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease;
  }

  .template-editor__thumbnail:hover {
    transform: scale(1.02);
  }

  .template-editor__thumbnail-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--te-ink-muted);
    font-size: 0.75rem;
    font-weight: 500;
  }

  .template-editor__thumbnail-placeholder svg {
    width: 32px;
    height: 32px;
    opacity: 0.5;
  }

  .template-editor__status-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    padding: 4px 10px;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 100px;
    backdrop-filter: blur(8px);
  }

  .template-editor__status-badge--emerald {
    background: rgba(16, 185, 129, 0.9);
    color: white;
  }

  .template-editor__status-badge--sky {
    background: rgba(14, 165, 233, 0.9);
    color: white;
  }

  .template-editor__status-badge--slate {
    background: rgba(100, 116, 139, 0.9);
    color: white;
  }

  .template-editor__status-badge--rose {
    background: rgba(244, 63, 94, 0.9);
    color: white;
  }

  .template-editor__thumbnail-input {
    width: 100%;
  }

  .template-editor__identity {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .template-editor__title-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .template-editor__title-input {
    flex: 1;
    font-family: var(--te-font);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--te-ink);
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    letter-spacing: -0.02em;
  }

  .template-editor__title-input::placeholder {
    color: var(--te-ink-muted);
  }

  .template-editor__status-select {
    position: relative;
    display: flex;
    align-items: center;
  }

  .template-editor__select {
    appearance: none;
    font-family: var(--te-font);
    font-size: 0.8125rem;
    font-weight: 600;
    padding: 8px 32px 8px 28px;
    border-radius: 100px;
    border: 1.5px solid var(--te-border);
    background: var(--te-surface-raised);
    color: var(--te-ink-light);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .template-editor__select:hover {
    border-color: var(--te-ink-muted);
  }

  .template-editor__select:focus {
    outline: none;
    border-color: var(--te-teal);
    box-shadow: 0 0 0 3px var(--te-teal-light);
  }

  .template-editor__status-indicator {
    position: absolute;
    left: 10px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    pointer-events: none;
  }

  .template-editor__status-indicator--emerald { background: var(--te-emerald); }
  .template-editor__status-indicator--sky { background: var(--te-sky); }
  .template-editor__status-indicator--slate { background: var(--te-slate); }
  .template-editor__status-indicator--rose { background: var(--te-rose); }

  /* Audiences */
  .template-editor__audiences {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .template-editor__audience-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: 100px;
    background: var(--te-teal-light);
    border: 1px solid rgba(20, 184, 166, 0.2);
    color: var(--te-teal);
    transition: all 0.15s ease;
  }

  .template-editor__audience-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.15s ease;
  }

  .template-editor__audience-remove:hover {
    opacity: 1;
  }

  .template-editor__audience-remove svg {
    width: 12px;
    height: 12px;
  }

  .template-editor__add-audience-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    font-family: var(--te-font);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--te-ink-muted);
    background: transparent;
    border: 1.5px dashed var(--te-border);
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .template-editor__add-audience-btn:hover {
    border-color: var(--te-ink-muted);
    color: var(--te-ink-light);
  }

  .template-editor__add-audience-btn svg {
    width: 14px;
    height: 14px;
  }

  .template-editor__audience-input-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .template-editor__audience-input {
    width: 140px;
    padding: 6px 12px;
    font-family: var(--te-font);
    font-size: 0.8125rem;
    border: 1.5px solid var(--te-teal);
    border-radius: 100px;
    outline: none;
    background: var(--te-surface);
  }

  .template-editor__audience-add-btn {
    padding: 6px 12px;
    font-family: var(--te-font);
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    background: var(--te-teal);
    border: none;
    border-radius: 100px;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .template-editor__audience-add-btn:hover {
    background: #0d9488;
  }

  .template-editor__audience-presets {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 4px;
  }

  .template-editor__presets-label {
    font-size: 0.75rem;
    color: var(--te-ink-muted);
  }

  .template-editor__preset-btn {
    font-family: var(--te-font);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 4px 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.15s ease;
  }

  .template-editor__preset-btn:hover {
    opacity: 1;
  }

  .template-editor__summary {
    width: 100%;
    font-family: var(--te-font);
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--te-ink-light);
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    padding: 0;
  }

  .template-editor__summary::placeholder {
    color: var(--te-ink-muted);
  }

  /* Grid Cards */
  .template-editor__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .template-editor__card {
    background: var(--te-surface);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(26, 31, 54, 0.04), 0 4px 16px rgba(26, 31, 54, 0.06);
  }

  .template-editor__card-header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 20px;
  }

  .template-editor__card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .template-editor__card-icon svg {
    width: 20px;
    height: 20px;
  }

  .template-editor__card-icon--violet {
    background: var(--te-violet-light);
    color: var(--te-violet);
  }

  .template-editor__card-icon--amber {
    background: var(--te-amber-light);
    color: var(--te-amber);
  }

  .template-editor__card-icon--emerald {
    background: var(--te-emerald-light);
    color: var(--te-emerald);
  }

  .template-editor__card--full {
    grid-column: 1 / -1;
  }

  .template-editor__card-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--te-ink);
    margin: 0 0 2px;
  }

  .template-editor__card-subtitle {
    font-size: 0.8125rem;
    color: var(--te-ink-muted);
    margin: 0;
  }

  .template-editor__textarea {
    width: 100%;
    font-family: var(--te-font);
    font-size: 0.9375rem;
    line-height: 1.7;
    color: var(--te-ink);
    background: var(--te-surface-raised);
    border: 1.5px solid var(--te-border-light);
    border-radius: 12px;
    padding: 16px;
    resize: vertical;
    transition: all 0.15s ease;
  }

  .template-editor__textarea:hover {
    border-color: var(--te-border);
  }

  .template-editor__textarea:focus {
    outline: none;
    border-color: var(--te-teal);
    box-shadow: 0 0 0 3px var(--te-teal-light);
  }

  .template-editor__textarea::placeholder {
    color: var(--te-ink-muted);
  }

  /* Services */
  .template-editor__services {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .template-editor__service {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: var(--te-surface-raised);
    border-radius: 8px;
    transition: background 0.15s ease;
  }

  .template-editor__service:hover {
    background: var(--te-border-light);
  }

  .template-editor__service-bullet {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--te-emerald);
    flex-shrink: 0;
  }

  .template-editor__service-bullet--recurring {
    background: var(--te-amber);
  }

  .template-editor__service-bullet--ghost {
    background: var(--te-border);
  }

  .template-editor__service-text {
    flex: 1;
    font-size: 0.875rem;
    color: var(--te-ink);
  }

  .template-editor__service-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: var(--te-ink-muted);
    opacity: 0;
    transition: all 0.15s ease;
  }

  .template-editor__service:hover .template-editor__service-remove {
    opacity: 1;
  }

  .template-editor__service-remove:hover {
    background: var(--te-rose-light);
    color: var(--te-rose);
  }

  .template-editor__service-remove svg {
    width: 14px;
    height: 14px;
  }

  .template-editor__add-service {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: transparent;
    border: 1.5px dashed var(--te-border);
    border-radius: 8px;
    transition: all 0.15s ease;
  }

  .template-editor__add-service:focus-within {
    border-color: var(--te-teal);
    border-style: solid;
  }

  .template-editor__service-new-input {
    flex: 1;
    font-family: var(--te-font);
    font-size: 0.875rem;
    background: transparent;
    border: none;
    outline: none;
    color: var(--te-ink);
  }

  .template-editor__service-new-input::placeholder {
    color: var(--te-ink-muted);
  }

  .template-editor__service-add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    background: var(--te-teal);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: white;
    transition: background 0.15s ease;
  }

  .template-editor__service-add-btn:hover {
    background: #0d9488;
  }

  .template-editor__service-add-btn svg {
    width: 16px;
    height: 16px;
  }

  /* Metadata */
  .template-editor__metadata {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    background: var(--te-surface);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(26, 31, 54, 0.04), 0 4px 16px rgba(26, 31, 54, 0.06);
  }

  .template-editor__meta-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .template-editor__label {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--te-ink-muted);
  }

  .template-editor__input {
    width: 100%;
    font-family: var(--te-font);
    font-size: 0.9375rem;
    padding: 12px 16px;
    background: var(--te-surface-raised);
    border: 1.5px solid var(--te-border-light);
    border-radius: 10px;
    color: var(--te-ink);
    transition: all 0.15s ease;
  }

  .template-editor__input:hover {
    border-color: var(--te-border);
  }

  .template-editor__input:focus {
    outline: none;
    border-color: var(--te-teal);
    box-shadow: 0 0 0 3px var(--te-teal-light);
  }

  .template-editor__input::placeholder {
    color: var(--te-ink-muted);
  }

  .template-editor__input--sm {
    font-size: 0.8125rem;
    padding: 8px 12px;
  }

  .template-editor__input--mono {
    font-family: var(--te-mono);
    font-size: 0.875rem;
  }

  /* Facet Targeting */
  .template-editor__facets {
    background: var(--te-surface);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(26, 31, 54, 0.04), 0 4px 16px rgba(26, 31, 54, 0.06);
  }

  .template-editor__facets-header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 20px;
  }

  .template-editor__card-icon--sky {
    background: var(--te-sky-light);
    color: var(--te-sky);
  }

  .template-editor__facets-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .template-editor__facet-card {
    background: var(--te-surface-raised);
    border: 1px solid var(--te-border-light);
    border-radius: 12px;
    padding: 16px;
    transition: border-color 0.15s ease;
  }

  .template-editor__facet-card:hover {
    border-color: var(--te-border);
  }

  .template-editor__facet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .template-editor__facet-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--te-ink);
  }

  .template-editor__facet-clear {
    font-family: var(--te-font);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 4px 8px;
    background: transparent;
    border: none;
    color: var(--te-ink-muted);
    cursor: pointer;
    transition: color 0.15s ease;
  }

  .template-editor__facet-clear:hover {
    color: var(--te-rose);
  }

  .template-editor__facet-desc {
    font-size: 0.75rem;
    color: var(--te-ink-muted);
    margin: 0 0 12px;
  }

  .template-editor__facet-options {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .template-editor__facet-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    font-family: var(--te-font);
    font-size: 0.8125rem;
    color: var(--te-ink-light);
    background: var(--te-surface);
    border: 1.5px solid var(--te-border-light);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .template-editor__facet-option:hover {
    border-color: var(--te-border);
    background: var(--te-surface);
  }

  .template-editor__facet-option--selected {
    border-color: var(--te-teal);
    background: var(--te-teal-light);
    color: var(--te-ink);
  }

  .template-editor__facet-option--selected:hover {
    border-color: var(--te-teal);
    background: var(--te-teal-light);
  }

  .template-editor__facet-checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background: var(--te-surface);
    border: 1.5px solid var(--te-border);
    transition: all 0.15s ease;
  }

  .template-editor__facet-option--selected .template-editor__facet-checkbox {
    background: var(--te-teal);
    border-color: var(--te-teal);
  }

  .template-editor__facet-checkbox svg {
    width: 12px;
    height: 12px;
    color: white;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .template-editor__hero {
      grid-template-columns: 1fr;
    }

    .template-editor__thumbnail-area {
      flex-direction: row;
      align-items: flex-start;
    }

    .template-editor__thumbnail {
      width: 120px;
      height: 90px;
    }

    .template-editor__thumbnail-input {
      flex: 1;
    }

    .template-editor__grid {
      grid-template-columns: 1fr;
    }

    .template-editor__metadata {
      grid-template-columns: 1fr;
    }

    .template-editor__facets-grid {
      grid-template-columns: 1fr;
    }
  }
`;
