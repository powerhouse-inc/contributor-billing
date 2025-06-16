/**
 * Tests for Billing Statement operations
 */

import utils from "../../gen/utils.js";
import {
  type EditBillingStatementInput,
  type EditContributorInput,
  type EditStatusInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/general/creators.js";
import type { BillingStatementDocument } from "../../gen/types.js";

describe("Billing Statement Operations", () => {
  let document: BillingStatementDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  describe("editBillingStatement", () => {
    it("should update billing statement with all fields", () => {
      const input: EditBillingStatementInput = {
        dateIssued: "2024-03-20T10:00:00Z",
        dateDue: "2024-04-20T10:00:00Z",
        currency: "USD",
        notes: "Test billing statement notes"
      };

      const updatedDocument = reducer(
        document,
        creators.editBillingStatement(input)
      );

      // Verify operation was recorded
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect(updatedDocument.operations.global[0].type).toBe("EDIT_BILLING_STATEMENT");
      expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
      expect(updatedDocument.operations.global[0].index).toEqual(0);

      // Verify state was updated
      expect(updatedDocument.state.global.dateIssued).toBe(input.dateIssued);
      expect(updatedDocument.state.global.dateDue).toBe(input.dateDue);
      expect(updatedDocument.state.global.currency).toBe(input.currency);
      expect(updatedDocument.state.global.notes).toBe(input.notes); 
    });

    it("should update billing statement with partial fields", () => {
      const input: EditBillingStatementInput = {
        dateIssued: "2024-03-20T10:00:00Z",
        currency: "EUR"
      };

      const updatedDocument = reducer(
        document,
        creators.editBillingStatement(input)
      );

      // Verify operation was recorded
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect(updatedDocument.operations.global[0].type).toBe("EDIT_BILLING_STATEMENT");
      expect(updatedDocument.operations.global[0].input).toStrictEqual(input);

      // Verify only specified fields were updated
      expect(updatedDocument.state.global.dateIssued).toBe(input.dateIssued);
      expect(updatedDocument.state.global.currency).toBe(input.currency);
      // Other fields should remain unchanged
      expect(updatedDocument.state.global.dateDue).toBe(document.state.global.dateDue);
      expect(updatedDocument.state.global.notes).toBe(document.state.global.notes);
    });
  });

  describe("editContributor", () => {
    it("should update contributor ID", () => {
      const input: EditContributorInput = {
        contributor: "PHID-USER-123456789"
      };

      const updatedDocument = reducer(
        document,
        creators.editContributor(input)
      );

      // Verify operation was recorded
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect(updatedDocument.operations.global[0].type).toBe("EDIT_CONTRIBUTOR");
      expect(updatedDocument.operations.global[0].input).toStrictEqual(input);

      // Verify state was updated
      expect(updatedDocument.state.global.contributor).toBe(input.contributor);
    });
  });

  describe("editStatus", () => {
    it("should update billing statement status", () => {
      const input: EditStatusInput = {
        status: "ISSUED"
      };

      const updatedDocument = reducer(
        document,
        creators.editStatus(input)
      );

      // Verify operation was recorded
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect(updatedDocument.operations.global[0].type).toBe("EDIT_STATUS");
      expect(updatedDocument.operations.global[0].input).toStrictEqual(input);

      // Verify state was updated
      expect(updatedDocument.state.global.status).toBe(input.status);
    });

    it("should handle all possible status transitions", () => {
      const statuses: Array<EditStatusInput["status"]> = [
        "DRAFT",
        "ISSUED",
        "ACCEPTED",
        "REJECTED",
        "PAID"
      ];

      let currentDocument = document;

      for (const status of statuses) {
        const input: EditStatusInput = { status };
        currentDocument = reducer(currentDocument, creators.editStatus(input));
        expect(currentDocument.state.global.status).toBe(status);
      }
    });
  });
});
