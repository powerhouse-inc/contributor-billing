/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  reducer,
  utils,
  isIntegrationsDocument,
  setRequestFinance,
  SetRequestFinanceInputSchema,
  setGnosisSafe,
  SetGnosisSafeInputSchema,
  setGoogleCloud,
  SetGoogleCloudInputSchema,
} from "@powerhousedao/contributor-billing/document-models/integrations";

describe("Integrations Operations", () => {
  it("should handle setRequestFinance operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetRequestFinanceInputSchema());

    const updatedDocument = reducer(document, setRequestFinance(input));

    expect(isIntegrationsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_REQUEST_FINANCE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle setGnosisSafe operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetGnosisSafeInputSchema());

    const updatedDocument = reducer(document, setGnosisSafe(input));

    expect(isIntegrationsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_GNOSIS_SAFE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle setGoogleCloud operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetGoogleCloudInputSchema());

    const updatedDocument = reducer(document, setGoogleCloud(input));

    expect(isIntegrationsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_GOOGLE_CLOUD",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
