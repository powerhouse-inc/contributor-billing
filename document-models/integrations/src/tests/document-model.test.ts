/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  initialGlobalState,
  initialLocalState,
  createDocument,
} from "../../gen/utils.js";

describe("Integrations Document Model", () => {
  it("should create a new Integrations document", () => {
    const document = createDocument();

    expect(document).toBeDefined();
    expect(document.header.documentType).toBe("powerhouse/integrations");
  });

  it("should create a new Integrations document with a valid initial state", () => {
    const document = createDocument();
    expect(document.state.global).toStrictEqual(initialGlobalState);
    expect(document.state.local).toStrictEqual(initialLocalState);
  });
});
