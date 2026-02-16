import { useState, useCallback, useEffect } from "react";
import { Icon, Modal, PowerhouseButton } from "@powerhousedao/design-system";
import { FormInput } from "@powerhousedao/design-system/connect";
import {
  addDocument,
  dispatchActions,
  useSelectedDrive,
  setSelectedNode,
} from "@powerhousedao/reactor-browser";
import { setName } from "document-model";
import { isValidName } from "document-drive";
import { twMerge } from "tailwind-merge";
import { setOperationalHubName } from "../../../document-models/operational-hub-profile/gen/configuration/creators.js";

const buttonStyles =
  "min-h-[48px] min-w-[142px] text-base font-semibold py-3 px-6 rounded-xl outline-none active:opacity-75 hover:scale-105 transform transition-all";

const CLOSE_ANIMATION_DURATION = 300;

interface CreateHubProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (documentId: string) => void;
}

/**
 * Custom modal for creating an Operational Hub Profile
 * Uses the same design as the classic Connect CreateDocumentModal
 */
export function CreateHubProfileModal({
  isOpen,
  onClose,
  onCreated,
}: CreateHubProfileModalProps) {
  const [hubName, setHubName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDrive] = useSelectedDrive();

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setHubName("");
        setIsValid(false);
      }, CLOSE_ANIMATION_DURATION);
      setIsCreating(false);
    }
  }, [isOpen]);

  const handleCancel = useCallback(() => {
    onClose();
    setTimeout(() => {
      setHubName("");
      setIsValid(false);
    }, CLOSE_ANIMATION_DURATION);
  }, [onClose]);

  const handleCreate = useCallback(async () => {
    const trimmedName = hubName.trim();
    const driveId = selectedDrive?.header.id;

    if (!isValid || !driveId || isCreating) return;

    setIsCreating(true);

    try {
      // Create the document with the entered name
      const createdNode = await addDocument(
        driveId,
        trimmedName,
        "powerhouse/operational-hub-profile",
        undefined,
        undefined,
        undefined,
        "operational-hub-profile-editor",
      );

      if (!createdNode?.id) {
        console.error("Failed to create operational hub profile document");
        return;
      }

      // Set the hub name field in the document state
      await dispatchActions(
        setOperationalHubName({ name: trimmedName }),
        createdNode.id,
      );

      // Set the document name to match
      await dispatchActions(setName(trimmedName), createdNode.id);

      // Select the newly created document
      setSelectedNode(createdNode.id);

      // Notify parent and close
      onCreated?.(createdNode.id);
      onClose();
      setTimeout(() => {
        setHubName("");
        setIsValid(false);
      }, CLOSE_ANIMATION_DURATION);
    } catch (error) {
      console.error("Error creating operational hub profile:", error);
    } finally {
      setIsCreating(false);
    }
  }, [
    hubName,
    selectedDrive?.header.id,
    isValid,
    isCreating,
    onCreated,
    onClose,
  ]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValid && !isCreating) {
        void handleCreate();
      }
    },
    [isValid, isCreating, handleCreate],
  );

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
      contentProps={{
        className: "rounded-3xl",
      }}
    >
      <form
        name="create-hub-profile"
        className="w-[400px] p-6 text-slate-300"
        onSubmit={handleSubmit}
      >
        <div className="border-b border-slate-50 pb-2 text-2xl font-bold text-gray-800">
          Create your Operational Hub profile
        </div>
        <div className="my-6">
          {!isValid && hubName && (
            <div className="mb-2 text-red-500">
              Document name must be valid URL characters.
            </div>
          )}
          <FormInput
            icon={<Icon name="BrickGlobe" />}
            onChange={(e) => {
              const name = e.target.value;
              setHubName(name);
              setIsValid(isValidName(name));
            }}
            placeholder="Operational Hub name"
            required
            value={hubName}
            disabled={isCreating}
          />
        </div>
        <div className="mt-8 flex justify-between gap-3">
          <button
            type="button"
            className={twMerge(
              buttonStyles,
              "flex-1 bg-slate-50 text-slate-800",
            )}
            onClick={handleCancel}
            disabled={isCreating}
          >
            Cancel
          </button>
          <PowerhouseButton
            type="submit"
            className={twMerge(buttonStyles, "flex-1 bg-gray-800 text-gray-50")}
            disabled={!isValid || isCreating}
          >
            {isCreating ? "Creating..." : "Create"}
          </PowerhouseButton>
        </div>
      </form>
    </Modal>
  );
}
