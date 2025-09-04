import {
  BaseDocumentClass,
  applyMixins,
  type SignalDispatch,
} from "document-model";
import { IntegrationsPHState } from "./ph-factories.js";
import { type IntegrationsAction } from "./actions.js";
import { reducer } from "./reducer.js";
import { createDocument } from "./utils.js";
import Integrations_Integrations from "./integrations/object.js";

export * from "./integrations/object.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface Integrations extends Integrations_Integrations {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Integrations extends BaseDocumentClass<IntegrationsPHState> {
  static fileExtension = ".phdm";

  constructor(
    initialState?: Partial<IntegrationsPHState>,
    dispatch?: SignalDispatch,
  ) {
    super(reducer, createDocument(initialState), dispatch);
  }

  public saveToFile(path: string, name?: string) {
    return super.saveToFile(path, Integrations.fileExtension, name);
  }

  public loadFromFile(path: string) {
    return super.loadFromFile(path);
  }

  static async fromFile(path: string) {
    const document = new this();
    await document.loadFromFile(path);
    return document;
  }
}

applyMixins(Integrations, [Integrations_Integrations]);

export { Integrations };
