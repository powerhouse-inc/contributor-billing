/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import utils, {
  initialGlobalState,
  initialLocalState,
} from "../../gen/utils.js";

describe("Billing Statement Document Model", () => {
  it("should create a new Billing Statement document", () => {
    const document = utils.createDocument();

    expect(document).toBeDefined();
    expect(document.header.documentType).toBe("powerhouse/billing-statement");
  });

  it("should create a new Billing Statement document with a valid initial state", () => {
    const document = utils.createDocument();
    expect(document.state.global).toStrictEqual(initialGlobalState);
    expect(document.state.local).toStrictEqual(initialLocalState);
  });
});
