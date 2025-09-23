/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import utils from "../../gen/utils.js";
import {
  type AddLineItemInput,
  type EditLineItemInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/line-items/creators.js";
import type { BillingStatementDocument } from "../../gen/types.js";
import { generateId } from "document-model";

describe("Billing Statement Line Items Operations", () => {
  let document: BillingStatementDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  describe("addLineItem", () => {
    it("should add a new line item and update totals", () => {
      const input: AddLineItemInput = {
        id: generateId(),
        description: "Test Line Item",
        quantity: 2,
        unit: "HOUR",
        unitPricePwt: 10,
        unitPriceCash: 20,
        totalPricePwt: 20,
        totalPriceCash: 40,
      };

      const updatedDocument = reducer(
        document,
        creators.addLineItem(input)
      );

      // Verify operation was recorded
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("ADD_LINE_ITEM");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);

      // Verify state was updated
      expect(updatedDocument.state.global.lineItems).toHaveLength(1);
      const addedItem = updatedDocument.state.global.lineItems[0];
      expect(addedItem.description).toBe(input.description);
      expect(addedItem.quantity).toBe(input.quantity);
      expect(addedItem.unitPricePwt).toBe(input.unitPricePwt);
      expect(addedItem.unitPriceCash).toBe(input.unitPriceCash);
      expect(addedItem.totalPricePwt).toBe(input.totalPricePwt);
      expect(addedItem.totalPriceCash).toBe(input.totalPriceCash);
      expect(addedItem.lineItemTag).toEqual([]);

      // Verify totals were updated
      expect(updatedDocument.state.global.totalCash).toBe(input.totalPriceCash);
      expect(updatedDocument.state.global.totalPowt).toBe(input.totalPricePwt);
    });
  });

  describe("editLineItem", () => {
    it("should edit an existing line item and update totals", () => {
      // First, add a line item
      const addInput: AddLineItemInput = {
        id: generateId(),
        description: "Original Line Item",
        quantity: 1,
        unit: "HOUR",
        unitPricePwt: 10,
        unitPriceCash: 20,
        totalPricePwt: 10,
        totalPriceCash: 20,
      };

      let updatedDocument = reducer(
        document,
        creators.addLineItem(addInput)
      );

      const lineItemId = updatedDocument.state.global.lineItems[0].id;

      // Now edit the line item
      const editInput: EditLineItemInput = {
        id: lineItemId,
        description: "Updated Line Item",
        quantity: 3,
        unit: "HOUR",
        unitPricePwt: 15,
        unitPriceCash: 25,
        totalPricePwt: 45,
        totalPriceCash: 75,
      };

      updatedDocument = reducer(
        updatedDocument,
        creators.editLineItem(editInput)
      );

      // Verify operation was recorded
      expect(updatedDocument.operations.global).toHaveLength(2);
      expect((updatedDocument.operations.global[1] as any).type).toBe("EDIT_LINE_ITEM");
      expect((updatedDocument.operations.global[1] as any).input).toStrictEqual(editInput);

      // Verify state was updated
      expect(updatedDocument.state.global.lineItems).toHaveLength(1);
      const editedItem = updatedDocument.state.global.lineItems[0];
      expect(editedItem.description).toBe(editInput.description);
      expect(editedItem.quantity).toBe(editInput.quantity);
      expect(editedItem.unitPricePwt).toBe(editInput.unitPricePwt);
      expect(editedItem.unitPriceCash).toBe(editInput.unitPriceCash);
      expect(editedItem.totalPricePwt).toBe(editInput.totalPricePwt);
      expect(editedItem.totalPriceCash).toBe(editInput.totalPriceCash);

      // Verify totals were updated
      expect(updatedDocument.state.global.totalCash).toBe(editInput.totalPriceCash);
      expect(updatedDocument.state.global.totalPowt).toBe(editInput.totalPricePwt);
    });

    it("should handle partial updates to a line item", () => {
      // First, add a line item
      const addInput: AddLineItemInput = {
        id: generateId(),
        description: "Original Line Item",
        quantity: 1,
        unit: "HOUR",
        unitPricePwt: 10,
        unitPriceCash: 20,
        totalPricePwt: 10,
        totalPriceCash: 20,
      };

      let updatedDocument = reducer(
        document,
        creators.addLineItem(addInput)
      );

      const lineItemId = updatedDocument.state.global.lineItems[0].id;

      // Now edit the line item with partial fields
      const editInput: EditLineItemInput = {
        id: lineItemId,
        description: "Updated Description",
        quantity: 2,
        unit: "UNIT",
      };

      updatedDocument = reducer(
        updatedDocument,
        creators.editLineItem(editInput)
      );

      // Verify operation was recorded
      expect(updatedDocument.operations.global).toHaveLength(2);
      expect((updatedDocument.operations.global[1] as any).type).toBe("EDIT_LINE_ITEM");
      expect((updatedDocument.operations.global[1] as any).input).toStrictEqual(editInput);

      // Verify state was updated
      expect(updatedDocument.state.global.lineItems).toHaveLength(1);
      const editedItem = updatedDocument.state.global.lineItems[0];
      expect(editedItem.description).toBe(editInput.description);
      expect(editedItem.quantity).toBe(editInput.quantity);
      // Other fields should remain unchanged
      expect(editedItem.unitPricePwt).toBe(addInput.unitPricePwt);
      expect(editedItem.unitPriceCash).toBe(addInput.unitPriceCash);

      // Verify totals were updated based on new quantity
      expect(editInput.quantity).not.toBeNull();
      expect(editInput.quantity).not.toBeUndefined();
      expect(updatedDocument.state.global.totalCash).toBe(editInput.quantity! * addInput.unitPriceCash);
      expect(updatedDocument.state.global.totalPowt).toBe(editInput.quantity! * addInput.unitPricePwt);
    });
  });
});
