import type { DocumentModelUtils } from "document-model";
import type { SnapshotReportPHState } from "./gen/types.js";
import { utils as genUtils } from "./gen/utils.js";
import * as customUtils from "./src/utils.js";

/** Utils for the SnapshotReport document model */
export const utils = {
  ...genUtils,
  ...customUtils,
} satisfies DocumentModelUtils<SnapshotReportPHState>;
