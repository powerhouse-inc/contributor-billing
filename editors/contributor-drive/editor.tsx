import {
  DocumentDriveState,
  DocumentDriveAction,
  DocumentDriveLocalState,
} from "@powerhousedao/common/document-drive";
import { GenericDriveExplorer } from "@powerhousedao/common";
import { EditorProps } from "document-model/document";
import "./tailwind.css";

export type IProps = EditorProps<
  DocumentDriveState,
  DocumentDriveAction,
  DocumentDriveLocalState
>;

const GenericDriveEditor = GenericDriveExplorer.Component;

export default function Editor(props: IProps) {
  return (
    <GenericDriveEditor {...props} className="bg-blue-100/40 px-4">
      <h2 className="text-center text-xl font-semibold my-3">
        Contributor Drive
      </h2>
    </GenericDriveEditor>
  );
}
