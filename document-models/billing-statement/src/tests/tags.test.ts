/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import utils from "../../gen/utils.js";
import { type EditLineItemTagInput, type AddLineItemInput } from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/tags/creators.js";
import * as lineItemCreators from "../../gen/line-items/creators.js";
import type { BillingStatementDocument } from "../../gen/types.js";

describe("Billing Statement Tags Operations", () => {
  let document: BillingStatementDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  describe("editLineItemTag", () => {
    it("should edit a line item tag", () => {
      // First, add a line item
      const addInput: AddLineItemInput = {
        description: "Test Line Item",
        quantity: 1,
        unitPricePwt: 10,
        unitPriceCash: 20,
        totalPricePwt: 10,
        totalPriceCash: 20,
      };

      let updatedDocument = reducer(document, lineItemCreators.addLineItem(addInput));
      const lineItemId = updatedDocument.state.global.lineItems[0].id;

      // Now edit the line item tag
      const input: EditLineItemTagInput = {
        lineItemId: lineItemId,
        dimension: "category",
        value: "expense",
        label: "Office Supplies",
      };

      updatedDocument = reducer(updatedDocument, creators.editLineItemTag(input));

      // Verify operation was recorded
      expect(updatedDocument.operations.global).toHaveLength(2);
      expect(updatedDocument.operations.global[1].type).toBe("EDIT_LINE_ITEM_TAG");
      expect(updatedDocument.operations.global[1].input).toStrictEqual(input);

      // Verify state was updated
      const lineItem = updatedDocument.state.global.lineItems.find(item => item.id === input.lineItemId);
      expect(lineItem).toBeDefined();
      expect(lineItem?.lineItemTag).toContainEqual({
        dimension: input.dimension,
        value: input.value,
        label: input.label,
      });
    });
  });
});
