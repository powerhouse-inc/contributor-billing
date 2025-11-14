/**
 * This is a scaffold file meant for customization.
 * Delete the file and run the code generator again to have it reset
 */

import type { ProcessorRecord } from "document-drive/processors/types";
import { LineItemProcessorProcessor } from "./line-item-processor/index.js";

export const processorFactory =
  (module: any) =>
  (driveId: string): ProcessorRecord[] => {
    return [
      {
        processor: new LineItemProcessorProcessor(module.analyticsStore),
        filter: {
          branch: ["main"],
          documentId: ["*"],
          scope: ["*"],
          documentType: ["powerhouse/billing-statement"],
        },
      },
    ];
  };
