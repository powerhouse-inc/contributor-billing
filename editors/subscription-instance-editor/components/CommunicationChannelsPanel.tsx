import React, { useState, useCallback } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  SubscriptionInstanceAction,
  SubscriptionInstanceDocument,
} from "@powerhousedao/contributor-billing/document-models/subscription-instance";
import type {
  CommunicationChannel,
  CommunicationChannelType,
} from "../../../document-models/subscription-instance/gen/schema/types.js";
import type { ViewMode } from "../types.js";
import {
  addCommunicationChannel,
  removeCommunicationChannel,
  setPrimaryCommunicationChannel,
  verifyCommunicationChannel,
} from "../../../document-models/subscription-instance/gen/customer/creators.js";

interface CommunicationChannelsPanelProps {
  document: SubscriptionInstanceDocument;
  dispatch: DocumentDispatch<SubscriptionInstanceAction>;
  mode: ViewMode;
}

const channelTypes: { value: CommunicationChannelType; label: string }[] = [
  { value: "EMAIL", label: "Email" },
  { value: "TELEGRAM", label: "Telegram" },
  { value: "DISCORD", label: "Discord" },
  { value: "SLACK", label: "Slack" },
  { value: "WHATSAPP", label: "WhatsApp" },
];

const channelIcons: Record<CommunicationChannelType, React.ReactNode> = {
  EMAIL: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  ),
  TELEGRAM: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.97 9.292c-.146.658-.537.818-1.084.508l-3-2.211-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.194 1.006.128.833.931z" />
    </svg>
  ),
  DISCORD: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
  SLACK: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z" />
    </svg>
  ),
  WHATSAPP: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
};

function ChannelItem({
  channel,
  dispatch,
  mode,
  canRemove,
}: {
  channel: CommunicationChannel;
  dispatch: DocumentDispatch<SubscriptionInstanceAction>;
  mode: ViewMode;
  canRemove: boolean;
}) {
  const handleSetPrimary = useCallback(() => {
    dispatch(setPrimaryCommunicationChannel({ channelId: channel.id }));
  }, [dispatch, channel.id]);

  const handleVerify = useCallback(() => {
    dispatch(
      verifyCommunicationChannel({
        channelId: channel.id,
        verifiedAt: new Date().toISOString(),
      }),
    );
  }, [dispatch, channel.id]);

  const handleRemove = useCallback(() => {
    dispatch(removeCommunicationChannel({ channelId: channel.id }));
  }, [dispatch, channel.id]);

  return (
    <div
      className={`si-channel ${channel.isPrimary ? "si-channel--primary" : ""}`}
    >
      <div className="si-channel__icon">{channelIcons[channel.type]}</div>
      <div className="si-channel__info">
        <span className="si-channel__identifier">{channel.identifier}</span>
        <span className="si-channel__type">
          {channelTypes.find((t) => t.value === channel.type)?.label}
          {channel.isPrimary && (
            <span className="si-channel__badge">Primary</span>
          )}
          {channel.verifiedAt && (
            <span className="si-channel__verified" title="Verified">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </span>
      </div>
      <div className="si-channel__actions">
        {!channel.isPrimary && (
          <button
            type="button"
            className="si-channel-btn"
            onClick={handleSetPrimary}
            title="Set as primary"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        )}
        {mode === "operator" && !channel.verifiedAt && (
          <button
            type="button"
            className="si-channel-btn si-channel-btn--verify"
            onClick={handleVerify}
            title="Mark as verified"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        {canRemove && (
          <button
            type="button"
            className="si-channel-btn si-channel-btn--remove"
            onClick={handleRemove}
            title="Remove"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispatch: DocumentDispatch<SubscriptionInstanceAction>;
  existingChannels: CommunicationChannel[];
}

function AddChannelModal({
  isOpen,
  onClose,
  dispatch,
  existingChannels,
}: AddChannelModalProps) {
  const [type, setType] = useState<CommunicationChannelType>("EMAIL");
  const [identifier, setIdentifier] = useState("");
  const [isPrimary, setIsPrimary] = useState(existingChannels.length === 0);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!identifier.trim()) return;

      dispatch(
        addCommunicationChannel({
          channelId: generateId(),
          type,
          identifier: identifier.trim(),
          isPrimary,
        }),
      );

      setType("EMAIL");
      setIdentifier("");
      setIsPrimary(false);
      onClose();
    },
    [type, identifier, isPrimary, dispatch, onClose],
  );

  if (!isOpen) return null;

  const placeholders: Record<CommunicationChannelType, string> = {
    EMAIL: "email@example.com",
    TELEGRAM: "@username",
    DISCORD: "username#1234",
    SLACK: "@username",
    WHATSAPP: "+1234567890",
  };

  return (
    <div className="si-modal-overlay" onClick={onClose}>
      <div
        className="si-modal si-modal--sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="si-modal__header">
          <h3 className="si-modal__title">Add Contact Method</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="si-modal__body">
            <div className="si-form-group">
              <label className="si-form-label" htmlFor="channel-type">
                Type
              </label>
              <select
                id="channel-type"
                className="si-select"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as CommunicationChannelType)
                }
              >
                {channelTypes.map((ct) => (
                  <option key={ct.value} value={ct.value}>
                    {ct.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="si-form-group">
              <label className="si-form-label" htmlFor="channel-identifier">
                {type === "EMAIL" ? "Email Address" : "Username / Handle"}
              </label>
              <input
                id="channel-identifier"
                type={type === "EMAIL" ? "email" : "text"}
                className="si-input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={placeholders[type]}
                required
              />
            </div>

            {existingChannels.length > 0 && (
              <div className="si-form-checkbox">
                <input
                  id="channel-primary"
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                />
                <label htmlFor="channel-primary">Set as primary contact</label>
              </div>
            )}
          </div>

          <div className="si-modal__footer">
            <button
              type="button"
              className="si-btn si-btn--ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="si-btn si-btn--primary"
              disabled={!identifier.trim()}
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CommunicationChannelsPanel({
  document,
  dispatch,
  mode,
}: CommunicationChannelsPanelProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const channels = document.state.global.communications;

  return (
    <>
      <div className="si-panel si-panel--compact">
        <div className="si-panel__header">
          <h3 className="si-panel__title">Contact Methods</h3>
          <button
            type="button"
            className="si-btn si-btn--sm si-btn--ghost"
            onClick={() => setShowAddModal(true)}
          >
            <svg
              className="si-btn__icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add
          </button>
        </div>

        {channels.length === 0 ? (
          <div className="si-empty si-empty--sm">
            <p className="si-empty__text">No contact methods added</p>
          </div>
        ) : (
          <div className="si-channels-list">
            {channels.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                dispatch={dispatch}
                mode={mode}
                canRemove={channels.length > 1 || !channel.isPrimary}
              />
            ))}
          </div>
        )}
      </div>

      <AddChannelModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        dispatch={dispatch}
        existingChannels={channels}
      />
    </>
  );
}
