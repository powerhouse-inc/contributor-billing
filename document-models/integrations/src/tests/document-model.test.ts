/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */
/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import {
  utils,
  initialGlobalState,
  initialLocalState,
  integrationsDocumentType,
  isIntegrationsDocument,
  assertIsIntegrationsDocument,
  isIntegrationsState,
  assertIsIntegrationsState,
} from "@powerhousedao/contributor-billing/document-models/integrations";
import { ZodError } from "zod";

describe("Integrations Document Model", () => {
  it("should create a new Integrations document", () => {
    const document = utils.createDocument();

    expect(document).toBeDefined();
    expect(document.header.documentType).toBe(integrationsDocumentType);
  });

  it("should create a new Integrations document with a valid initial state", () => {
    const document = utils.createDocument();
    expect(document.state.global).toStrictEqual(initialGlobalState);
    expect(document.state.local).toStrictEqual(initialLocalState);
    expect(isIntegrationsDocument(document)).toBe(true);
    expect(isIntegrationsState(document.state)).toBe(true);
  });
  it("should reject a document that is not a Integrations document", () => {
    const wrongDocumentType = utils.createDocument();
    wrongDocumentType.header.documentType = "the-wrong-thing-1234";
    try {
      expect(assertIsIntegrationsDocument(wrongDocumentType)).toThrow();
      expect(isIntegrationsDocument(wrongDocumentType)).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }
  });
  const wrongState = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  wrongState.state.global = {
    ...{ notWhat: "you want" },
  };
  try {
    expect(isIntegrationsState(wrongState.state)).toBe(false);
    expect(assertIsIntegrationsState(wrongState.state)).toThrow();
    expect(isIntegrationsDocument(wrongState)).toBe(false);
    expect(assertIsIntegrationsDocument(wrongState)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const wrongInitialState = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  wrongInitialState.initialState.global = {
    ...{ notWhat: "you want" },
  };
  try {
    expect(isIntegrationsState(wrongInitialState.state)).toBe(false);
    expect(assertIsIntegrationsState(wrongInitialState.state)).toThrow();
    expect(isIntegrationsDocument(wrongInitialState)).toBe(false);
    expect(assertIsIntegrationsDocument(wrongInitialState)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingIdInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingIdInHeader.header.id;
  try {
    expect(isIntegrationsDocument(missingIdInHeader)).toBe(false);
    expect(assertIsIntegrationsDocument(missingIdInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingNameInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingNameInHeader.header.name;
  try {
    expect(isIntegrationsDocument(missingNameInHeader)).toBe(false);
    expect(assertIsIntegrationsDocument(missingNameInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingCreatedAtUtcIsoInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingCreatedAtUtcIsoInHeader.header.createdAtUtcIso;
  try {
    expect(isIntegrationsDocument(missingCreatedAtUtcIsoInHeader)).toBe(false);
    expect(
      assertIsIntegrationsDocument(missingCreatedAtUtcIsoInHeader),
    ).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingLastModifiedAtUtcIsoInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingLastModifiedAtUtcIsoInHeader.header.lastModifiedAtUtcIso;
  try {
    expect(isIntegrationsDocument(missingLastModifiedAtUtcIsoInHeader)).toBe(
      false,
    );
    expect(
      assertIsIntegrationsDocument(missingLastModifiedAtUtcIsoInHeader),
    ).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }
});
