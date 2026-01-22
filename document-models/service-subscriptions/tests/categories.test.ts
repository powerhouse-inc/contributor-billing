import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isServiceSubscriptionsDocument,
  addCategory,
  updateCategory,
  deleteCategory,
  AddCategoryInputSchema,
  UpdateCategoryInputSchema,
  DeleteCategoryInputSchema,
} from "@powerhousedao/contributor-billing/document-models/service-subscriptions";

describe("CategoriesOperations", () => {
  it("should handle addCategory operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddCategoryInputSchema());

    const updatedDocument = reducer(document, addCategory(input));

    expect(isServiceSubscriptionsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_CATEGORY",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle updateCategory operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateCategoryInputSchema());

    const updatedDocument = reducer(document, updateCategory(input));

    expect(isServiceSubscriptionsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_CATEGORY",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle deleteCategory operation", () => {
    const document = utils.createDocument();
    const input = generateMock(DeleteCategoryInputSchema());

    const updatedDocument = reducer(document, deleteCategory(input));

    expect(isServiceSubscriptionsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "DELETE_CATEGORY",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
