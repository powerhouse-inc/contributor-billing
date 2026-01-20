import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isServiceSubscriptionsDocument,
  addVendor,
  updateVendor,
  deleteVendor,
  AddVendorInputSchema,
  UpdateVendorInputSchema,
  DeleteVendorInputSchema,
} from "@powerhousedao/contributor-billing/document-models/service-subscriptions";

describe("VendorsOperations", () => {
  it("should handle addVendor operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddVendorInputSchema());

    const updatedDocument = reducer(document, addVendor(input));

    expect(isServiceSubscriptionsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("ADD_VENDOR");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle updateVendor operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateVendorInputSchema());

    const updatedDocument = reducer(document, updateVendor(input));

    expect(isServiceSubscriptionsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_VENDOR",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle deleteVendor operation", () => {
    const document = utils.createDocument();
    const input = generateMock(DeleteVendorInputSchema());

    const updatedDocument = reducer(document, deleteVendor(input));

    expect(isServiceSubscriptionsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "DELETE_VENDOR",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
