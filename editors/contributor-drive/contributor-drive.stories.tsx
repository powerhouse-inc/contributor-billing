import Editor from "./editor";
import { createDriveStoryWithUINodes } from "@powerhousedao/common/storybook";

const { meta, CreateDocumentStory: ContributorDrive } =
  createDriveStoryWithUINodes(Editor);
export { ContributorDrive };

export default { ...meta, title: "Drive Explorer" };
