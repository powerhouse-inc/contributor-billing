import { DriveExplorer } from "./components/DriveExplorer.js";
import { useSetPHDriveEditorConfig } from "@powerhousedao/reactor-browser";
import type { EditorProps } from "document-model";
import { editorConfig } from "./config.js";

export default function Editor(props: EditorProps) {
    useSetPHDriveEditorConfig(editorConfig);
    return <DriveExplorer {...props} />;
  }