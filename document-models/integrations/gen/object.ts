import {
  BaseDocumentClass,
  type ExtendedState,
  type PartialState,
  applyMixins,
  type SignalDispatch,
} from "document-model";
import {
  type IntegrationsState,
  type IntegrationsLocalState,
} from "./types.js";
import { type IntegrationsAction } from "./actions.js";
import { reducer } from "./reducer.js";
import utils from "./utils.js";
import Integrations_Integrations from "./integrations/object.js";

export * from "./integrations/object.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface Integrations extends Integrations_Integrations {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Integrations extends BaseDocumentClass<
  IntegrationsState,
  IntegrationsLocalState,
  IntegrationsAction
> {
  static fileExtension = ".phdm";

  constructor(
    initialState?: Partial<
      ExtendedState<
        PartialState<IntegrationsState>,
        PartialState<IntegrationsLocalState>
      >
    >,
    dispatch?: SignalDispatch,
  ) {
    super(reducer, utils.createDocument(initialState), dispatch);
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
