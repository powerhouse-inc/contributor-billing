import {
  BaseDocumentHeaderSchema,
  BaseDocumentStateSchema,
} from "document-model";
import { z } from "zod";
import { integrationsDocumentType } from "./document-type.js";
import { IntegrationsStateSchema } from "./schema/zod.js";
import type { IntegrationsDocument, IntegrationsPHState } from "./types.js";

/** Schema for validating the header object of a Integrations document */
export const IntegrationsDocumentHeaderSchema = BaseDocumentHeaderSchema.extend(
  {
    documentType: z.literal(integrationsDocumentType),
  },
);

/** Schema for validating the state object of a Integrations document */
export const IntegrationsPHStateSchema = BaseDocumentStateSchema.extend({
  global: IntegrationsStateSchema(),
});

export const IntegrationsDocumentSchema = z.object({
  header: IntegrationsDocumentHeaderSchema,
  state: IntegrationsPHStateSchema,
  initialState: IntegrationsPHStateSchema,
});

/** Simple helper function to check if a state object is a Integrations document state object */
export function isIntegrationsState(
  state: unknown,
): state is IntegrationsPHState {
  return IntegrationsPHStateSchema.safeParse(state).success;
}

/** Simple helper function to assert that a document state object is a Integrations document state object */
export function assertIsIntegrationsState(
  state: unknown,
): asserts state is IntegrationsPHState {
  IntegrationsPHStateSchema.parse(state);
}

/** Simple helper function to check if a document is a Integrations document */
export function isIntegrationsDocument(
  document: unknown,
): document is IntegrationsDocument {
  return IntegrationsDocumentSchema.safeParse(document).success;
}

/** Simple helper function to assert that a document is a Integrations document */
export function assertIsIntegrationsDocument(
  document: unknown,
): asserts document is IntegrationsDocument {
  IntegrationsDocumentSchema.parse(document);
}
