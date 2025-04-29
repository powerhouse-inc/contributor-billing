import { type DocumentDriveDocument } from "document-drive";
import { GenericDriveExplorer } from "@powerhousedao/common";
import {
  type DriveEditorProps,
  DriveContextProvider,
} from "@powerhousedao/reactor-browser";
import { WagmiContext } from "@powerhousedao/design-system";
import "./tailwind.css";

export type IProps = DriveEditorProps<DocumentDriveDocument>;

const GenericDriveEditor = GenericDriveExplorer.Component;

function BaseEditor(props: IProps) {
  return (
    <GenericDriveEditor {...props} className="bg-green-100/40 px-4">
      <h2 className="text-center text-xl font-semibold my-3">
        OH Administrator Drive
      </h2>
    </GenericDriveEditor>
  );
}

export default function Editor(props: IProps) {
  return (
    <DriveContextProvider value={props.context}>
      <WagmiContext>
        <BaseEditor {...props} />
      </WagmiContext>
    </DriveContextProvider>
  );
}
