import { BaseSubgraph } from "@powerhousedao/reactor-api";
import type { DocumentNode } from "graphql";
import { schema } from "./schema.js";
import { getResolvers } from "./resolvers.js";
import { handleWebhook, cleanupOldPendingTransactions, setReactor } from "./customResolvers.js";
import express from "express";
import cors from "cors";


export class InvoiceSubgraph extends BaseSubgraph {
  name = "invoice";
  typeDefs: DocumentNode = schema;
  resolvers = getResolvers(this);
  additionalContextFields = {};
  async onSetup() {
    try {
      // Set the reactor instance for custom resolvers
      setReactor(this.reactor);

      if (this.graphqlManager && this.graphqlManager['app']) {
        console.log('Registering webhook handler at /webhook');

        // Add CORS middleware for the webhook route
        this.graphqlManager['app'].post('/webhook',
          cors(), // Add CORS middleware
          express.json({ limit: '3mb' }),
          handleWebhook.bind(this)
        );
      }

      // Set up a periodic cleanup of old pending transactions
      setInterval(() => cleanupOldPendingTransactions(), 3600000); // Run every hour
    } catch (error) {
      console.error('Error in invoice subgraph setup:', error);
    }
  }
  async onDisconnect() {}
}
