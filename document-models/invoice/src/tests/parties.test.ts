/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from "@powerhousedao/codegen";
import * as utils from "../../gen/utils.js";
import {
  type EditIssuerInput,
  type EditIssuerBankInput,
  type EditIssuerWalletInput,
  type EditPayerInput,
  type EditPayerBankInput,
  type EditPayerWalletInput,
  EditIssuerInputSchema,
  EditIssuerBankInputSchema,
  EditIssuerWalletInputSchema,
  EditPayerInputSchema,
  EditPayerBankInputSchema,
  EditPayerWalletInputSchema,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/parties/creators.js";
import type { InvoiceDocument } from "../../gen/types.js";

describe("Parties Operations", () => {
  let document: InvoiceDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle editIssuer operation", () => {
    const input: EditIssuerInput = generateMock(EditIssuerInputSchema());

    const updatedDocument = reducer(document, creators.editIssuer(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("EDIT_ISSUER");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle editIssuerBank operation", () => {
    const input: EditIssuerBankInput = generateMock(
      EditIssuerBankInputSchema(),
    );

    const updatedDocument = reducer(document, creators.editIssuerBank(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("EDIT_ISSUER_BANK");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle editIssuerWallet operation", () => {
    const input: EditIssuerWalletInput = generateMock(
      EditIssuerWalletInputSchema(),
    );

    const updatedDocument = reducer(document, creators.editIssuerWallet(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe(
      "EDIT_ISSUER_WALLET",
    );
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle editPayer operation", () => {
    const input: EditPayerInput = generateMock(EditPayerInputSchema());

    const updatedDocument = reducer(document, creators.editPayer(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("EDIT_PAYER");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle editPayerBank operation", () => {
    const input: EditPayerBankInput = generateMock(
      EditPayerBankInputSchema(),
    );

    const updatedDocument = reducer(document, creators.editPayerBank(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("EDIT_PAYER_BANK");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle editPayerWallet operation", () => {
    const input: EditPayerWalletInput = generateMock(
      EditPayerWalletInputSchema(),
    );

    const updatedDocument = reducer(document, creators.editPayerWallet(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("EDIT_PAYER_WALLET");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
