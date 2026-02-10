import { useState, useCallback } from "react";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  SubscriptionInstanceAction,
  SubscriptionInstanceDocument,
  CustomerType,
  KycStatus,
} from "@powerhousedao/contributor-billing/document-models/subscription-instance";
import type { ViewMode } from "../types.js";
import { StatusBadge } from "./StatusBadge.js";
import {
  updateCustomerWallet,
  setCustomerType,
  updateKycStatus,
} from "../../../document-models/subscription-instance/gen/customer/creators.js";
import { updateCustomerInfo } from "../../../document-models/subscription-instance/gen/subscription/creators.js";

interface CustomerInfoProps {
  document: SubscriptionInstanceDocument;
  dispatch: DocumentDispatch<SubscriptionInstanceAction>;
  mode: ViewMode;
}

export function CustomerInfo({ document, dispatch, mode }: CustomerInfoProps) {
  const state = document.state.global;

  // Edit states for different fields
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(state.customerName || "");

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editEmail, setEditEmail] = useState(state.customerEmail || "");

  const [isEditingWallet, setIsEditingWallet] = useState(false);
  const [walletAddress, setWalletAddress] = useState(
    state.customerWalletAddress || "",
  );

  const [isEditingType, setIsEditingType] = useState(false);
  const [editType, setEditType] = useState<CustomerType>(
    state.customerType || "INDIVIDUAL",
  );
  const [editMemberCount, setEditMemberCount] = useState(
    state.teamMemberCount || 1,
  );

  const [isEditingKyc, setIsEditingKyc] = useState(false);
  const [editKycStatus, setEditKycStatus] = useState<KycStatus>(
    state.kycStatus || "NOT_REQUIRED",
  );

  const getPrimaryChannel = () => {
    return (
      state.communications.find((c) => c.isPrimary) || state.communications[0]
    );
  };

  const primaryChannel = getPrimaryChannel();

  const formatChannelType = (type: string) => {
    const labels: Record<string, string> = {
      EMAIL: "Email",
      TELEGRAM: "Telegram",
      DISCORD: "Discord",
      SLACK: "Slack",
      WHATSAPP: "WhatsApp",
    };
    return labels[type] || type;
  };

  // Name handlers
  const handleSaveName = useCallback(() => {
    dispatch(
      updateCustomerInfo({
        customerName: editName || undefined,
      }),
    );
    setIsEditingName(false);
  }, [dispatch, editName]);

  const handleCancelName = useCallback(() => {
    setEditName(state.customerName || "");
    setIsEditingName(false);
  }, [state.customerName]);

  // Email handlers
  const handleSaveEmail = useCallback(() => {
    dispatch(
      updateCustomerInfo({
        customerEmail: editEmail || undefined,
      }),
    );
    setIsEditingEmail(false);
  }, [dispatch, editEmail]);

  const handleCancelEmail = useCallback(() => {
    setEditEmail(state.customerEmail || "");
    setIsEditingEmail(false);
  }, [state.customerEmail]);

  // Wallet handlers
  const handleSaveWallet = useCallback(() => {
    dispatch(
      updateCustomerWallet({
        walletAddress: walletAddress || null,
      }),
    );
    setIsEditingWallet(false);
  }, [dispatch, walletAddress]);

  const handleCancelWallet = useCallback(() => {
    setWalletAddress(state.customerWalletAddress || "");
    setIsEditingWallet(false);
  }, [state.customerWalletAddress]);

  // Type handlers
  const handleSaveType = useCallback(() => {
    dispatch(
      setCustomerType({
        customerType: editType,
        teamMemberCount: editType === "TEAM" ? editMemberCount : undefined,
      }),
    );
    setIsEditingType(false);
  }, [dispatch, editType, editMemberCount]);

  const handleCancelType = useCallback(() => {
    setEditType(state.customerType || "INDIVIDUAL");
    setEditMemberCount(state.teamMemberCount || 1);
    setIsEditingType(false);
  }, [state.customerType, state.teamMemberCount]);

  // KYC handlers (operator only)
  const handleSaveKyc = useCallback(() => {
    dispatch(
      updateKycStatus({
        kycStatus: editKycStatus,
      }),
    );
    setIsEditingKyc(false);
  }, [dispatch, editKycStatus]);

  const handleCancelKyc = useCallback(() => {
    setEditKycStatus(state.kycStatus || "NOT_REQUIRED");
    setIsEditingKyc(false);
  }, [state.kycStatus]);

  const isValidEthAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Edit button component for reuse
  const EditButton = ({ onClick }: { onClick: () => void }) => (
    <button
      type="button"
      className="si-customer-info__edit-btn"
      onClick={onClick}
      aria-label="Edit"
    >
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );

  return (
    <div className="si-panel si-panel--compact">
      <div className="si-panel__header">
        <h3 className="si-panel__title">
          {mode === "client" ? "Your Information" : "Customer Information"}
        </h3>
      </div>

      <div className="si-customer-info">
        {/* Customer Details */}
        <div className="si-customer-info__section">
          {/* Name - Editable */}
          <div className="si-customer-info__row">
            <span className="si-customer-info__label">Name</span>
            {isEditingName ? (
              <div className="si-customer-info__edit-field">
                <input
                  type="text"
                  className="si-input si-input--sm"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter name..."
                />
                <div className="si-customer-info__edit-actions">
                  <button
                    type="button"
                    className="si-btn si-btn--xs si-btn--ghost"
                    onClick={handleCancelName}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="si-btn si-btn--xs si-btn--primary"
                    onClick={handleSaveName}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <span className="si-customer-info__value">
                {state.customerName || (
                  <span className="si-customer-info__value--empty">
                    Not set
                  </span>
                )}
                <EditButton onClick={() => setIsEditingName(true)} />
              </span>
            )}
          </div>

          {/* Email - Editable */}
          <div className="si-customer-info__row">
            <span className="si-customer-info__label">Email</span>
            {isEditingEmail ? (
              <div className="si-customer-info__edit-field">
                <input
                  type="email"
                  className="si-input si-input--sm"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="email@example.com"
                />
                <div className="si-customer-info__edit-actions">
                  <button
                    type="button"
                    className="si-btn si-btn--xs si-btn--ghost"
                    onClick={handleCancelEmail}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="si-btn si-btn--xs si-btn--primary"
                    onClick={handleSaveEmail}
                    disabled={editEmail !== "" && !isValidEmail(editEmail)}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <span className="si-customer-info__value">
                {state.customerEmail || (
                  <span className="si-customer-info__value--empty">
                    Not set
                  </span>
                )}
                <EditButton onClick={() => setIsEditingEmail(true)} />
              </span>
            )}
          </div>

          {/* Type - Editable */}
          <div className="si-customer-info__row">
            <span className="si-customer-info__label">Type</span>
            {isEditingType ? (
              <div className="si-customer-info__edit-field">
                <div className="si-customer-info__type-edit">
                  <select
                    className="si-input si-input--sm si-select"
                    value={editType}
                    onChange={(e) =>
                      setEditType(e.target.value as CustomerType)
                    }
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="TEAM">Team</option>
                  </select>
                  {editType === "TEAM" && (
                    <input
                      type="number"
                      className="si-input si-input--sm si-input--number"
                      value={editMemberCount}
                      onChange={(e) =>
                        setEditMemberCount(parseInt(e.target.value) || 1)
                      }
                      min="1"
                      placeholder="Members"
                    />
                  )}
                </div>
                <div className="si-customer-info__edit-actions">
                  <button
                    type="button"
                    className="si-btn si-btn--xs si-btn--ghost"
                    onClick={handleCancelType}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="si-btn si-btn--xs si-btn--primary"
                    onClick={handleSaveType}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <span className="si-customer-info__value">
                {state.customerType ? (
                  <>
                    {state.customerType === "TEAM" ? "Team" : "Individual"}
                    {state.customerType === "TEAM" && state.teamMemberCount && (
                      <span className="si-customer-info__detail">
                        {" "}
                        ({state.teamMemberCount} members)
                      </span>
                    )}
                  </>
                ) : (
                  <span className="si-customer-info__value--empty">
                    Not set
                  </span>
                )}
                <EditButton onClick={() => setIsEditingType(true)} />
              </span>
            )}
          </div>

          {/* Wallet Address - Editable */}
          <div className="si-customer-info__row">
            <span className="si-customer-info__label">Payment Wallet</span>
            {isEditingWallet ? (
              <div className="si-customer-info__edit-field">
                <input
                  type="text"
                  className="si-input si-input--sm si-input--mono"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                />
                <div className="si-customer-info__edit-actions">
                  <button
                    type="button"
                    className="si-btn si-btn--xs si-btn--ghost"
                    onClick={handleCancelWallet}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="si-btn si-btn--xs si-btn--primary"
                    onClick={handleSaveWallet}
                    disabled={
                      walletAddress !== "" && !isValidEthAddress(walletAddress)
                    }
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <span className="si-customer-info__value">
                {state.customerWalletAddress ? (
                  <span className="si-customer-info__value--mono">
                    {state.customerWalletAddress.slice(0, 6)}...
                    {state.customerWalletAddress.slice(-4)}
                  </span>
                ) : (
                  <span className="si-customer-info__value--empty">
                    Not set
                  </span>
                )}
                <EditButton onClick={() => setIsEditingWallet(true)} />
              </span>
            )}
          </div>
        </div>

        {/* KYC Status - Editable by operator */}
        <div className="si-customer-info__section">
          <div className="si-customer-info__row">
            <span className="si-customer-info__label">KYC Status</span>
            {isEditingKyc && mode === "operator" ? (
              <div className="si-customer-info__edit-field">
                <select
                  className="si-input si-input--sm si-select"
                  value={editKycStatus}
                  onChange={(e) =>
                    setEditKycStatus(e.target.value as KycStatus)
                  }
                >
                  <option value="NOT_REQUIRED">Not Required</option>
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="PENDING">Pending</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <div className="si-customer-info__edit-actions">
                  <button
                    type="button"
                    className="si-btn si-btn--xs si-btn--ghost"
                    onClick={handleCancelKyc}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="si-btn si-btn--xs si-btn--primary"
                    onClick={handleSaveKyc}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <span className="si-customer-info__value">
                <StatusBadge
                  status={state.kycStatus || "NOT_REQUIRED"}
                  size="sm"
                />
                {mode === "operator" && (
                  <EditButton onClick={() => setIsEditingKyc(true)} />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Primary Contact */}
        {primaryChannel && (
          <div className="si-customer-info__section">
            <div className="si-customer-info__row">
              <span className="si-customer-info__label">Primary Contact</span>
              <span className="si-customer-info__value">
                {formatChannelType(primaryChannel.type)}:{" "}
                {primaryChannel.identifier}
                {primaryChannel.verifiedAt && (
                  <svg
                    className="si-customer-info__verified"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Budget Category - Operator view */}
        {mode === "operator" && state.budget && (
          <div className="si-customer-info__section">
            <div className="si-customer-info__row">
              <span className="si-customer-info__label">Budget Category</span>
              <span className="si-customer-info__value">
                {state.budget.label}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
