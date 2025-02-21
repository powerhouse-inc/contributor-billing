import Editor from "./editor";
import { createDriveStoryWithUINodes } from "@powerhousedao/common/storybook";

const { meta, CreateDocumentStory: AdministratorDrive } =
  createDriveStoryWithUINodes(Editor);
export { AdministratorDrive };

export default { ...meta, title: "Drive Explorer" };
