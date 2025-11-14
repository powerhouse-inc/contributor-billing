import { BaseSubgraph } from "@powerhousedao/reactor-api";
import type { DocumentNode } from "graphql";
import { schema } from "./schema.js";
import { getResolvers } from "./resolvers.js";

export class IntegrationsSubgraph extends BaseSubgraph {
  name = "integrations";
  typeDefs: DocumentNode = schema;
  resolvers = getResolvers(this);
  additionalContextFields = {};
  async onSetup() {}
  async onDisconnect() {}
}
