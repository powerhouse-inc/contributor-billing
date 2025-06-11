import type { EditorProps } from "document-model";
import {
  type BillingStatementDocument,
  actions,
} from "../../document-models/billing-statement/index.js";
import { Button } from "@powerhousedao/design-system";

export type IProps = EditorProps<BillingStatementDocument>;

export default function Editor(props: IProps) {
  return (
    <div>
      <Button onClick={() => console.log("Hello world!")}>My Button</Button>
    </div>
  );
}
