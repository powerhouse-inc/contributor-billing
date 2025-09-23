/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import utils from "../../gen/utils.js";
import {
  z,
  type SetRequestFinanceInput,
  type SetGnosisSafeInput,
  type SetGoogleCloudInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/integrations/creators.js";
import type { IntegrationsDocument } from "../../gen/types.js";

describe("Integrations Operations", () => {
  let document: IntegrationsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle setRequestFinance operation", () => {
    const input: SetRequestFinanceInput = {
      apiKey: "1234567890",
      email: "test@test.com",
    }

    const updatedDocument = reducer(
      document,
      creators.setRequestFinance(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe(
      "SET_REQUEST_FINANCE",
    );
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.requestFinance).toStrictEqual(input);
  });
  it("should handle setGnosisSafe operation", () => {
    const input: SetGnosisSafeInput = {
      safeAddress: "0x1234567890abcdef1234567890abcdef12345678",
      signerPrivateKey: "test-private-key-gnosis-safe",
    };

    const updatedDocument = reducer(document, creators.setGnosisSafe(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_GNOSIS_SAFE");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.gnosisSafe).toStrictEqual(input);
  });
  it("should handle setGoogleCloud operation", () => {
    const input: SetGoogleCloudInput = {
      projectId: "test-project-123",
      location: "us-central1",
      processorId: "processor-abc-123",
      keyFile: {
        type: "service_account",
        project_id: "test-project-123",
        private_key_id: "abcdef1234567890",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n",
        client_email: "gcloud-user@example.com",
        client_id: "123456789012345678901",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/gcloud-user%40example.com",
        universe_domain: "googleapis.com",
      },
    };

    const updatedDocument = reducer(document, creators.setGoogleCloud(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_GOOGLE_CLOUD");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.googleCloud).toStrictEqual(input);
  });
});
