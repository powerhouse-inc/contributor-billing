import { setName } from "document-model";
import type { FormEventHandler, MouseEventHandler } from "react";
import { useState } from "react";
import { useSelectedIntegrationsDocument } from "@powerhousedao/contributor-billing/document-models/integrations";

/** Displays the name of the selected Integrations document and allows editing it */
export function EditIntegrationsName() {
  const [integrationsDocument, dispatch] = useSelectedIntegrationsDocument();
  const [isEditing, setIsEditing] = useState(false);

  if (!integrationsDocument) return null;

  const integrationsDocumentName = integrationsDocument.header.name;

  const onClickEditIntegrationsName: MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setIsEditing(true);
  };

  const onClickCancelEditIntegrationsName: MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setIsEditing(false);
  };

  const onSubmitSetName: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const name = nameInput.value;
    if (!name) return;

    dispatch(setName(name));
    setIsEditing(false);
  };

  if (isEditing)
    return (
      <form
        className="flex gap-2 items-center justify-between"
        onSubmit={onSubmitSetName}
      >
        <input
          className="text-lg font-semibold text-gray-900 p-1"
          type="text"
          name="name"
          defaultValue={integrationsDocumentName}
          autoFocus
        />
        <div className="flex gap-2">
          <button type="submit" className="text-sm text-gray-600">
            Save
          </button>
          <button
            className="text-sm text-red-800"
            onClick={onClickCancelEditIntegrationsName}
          >
            Cancel
          </button>
        </div>
      </form>
    );

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-900">
        {integrationsDocumentName}
      </h2>
      <button
        className="text-sm text-gray-600"
        onClick={onClickEditIntegrationsName}
      >
        Edit Name
      </button>
    </div>
  );
}
