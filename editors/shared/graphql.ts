/**
 * Shared GraphQL utility for determining the correct GraphQL URL
 * based on the current environment.
 */

export function getGraphQLUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:4001/graphql";
  }

  const baseURI = window.document.baseURI;

  if (baseURI.includes("localhost")) {
    return "http://localhost:4001/graphql";
  }

  if (baseURI.includes("vetra.io")) {
    return "https://switchboard.jetstream.vetra.io/graphql";
  }

  return "http://localhost:4001/graphql";
}

/**
 * Returns the GraphQL endpoint for a custom subgraph.
 * Custom subgraphs are served at `/graphql/<subgraph-name>`.
 */
export function getSubgraphUrl(subgraph: string): string {
  return `${getGraphQLUrl()}/${subgraph}`;
}
