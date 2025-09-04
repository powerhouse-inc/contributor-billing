import { Subgraph } from "@powerhousedao/reactor-api";
import type { DocumentNode } from "graphql";
import { schema } from "./schema.js";
import { getResolvers } from "./resolvers.js";

export class BillingStatementSubgraph extends Subgraph {
  name = "billing-statement";
  typeDefs: DocumentNode = schema;
  resolvers: Record<string, any> = getResolvers(this);
  additionalContextFields = {};
  async onSetup() {}
  async onDisconnect() {}
}
