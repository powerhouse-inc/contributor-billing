/**
 * Shared GraphQL utility for determining the correct Switchboard URL
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

  if (baseURI.includes("-dev.")) {
    return "https://switchboard-dev.powerhouse.xyz/graphql";
  }

  if (baseURI.includes("-staging.")) {
    return "https://switchboard-staging.powerhouse.xyz/graphql";
  }

  // Production environment
  return "https://switchboard.powerhouse.xyz/graphql";
}

/**
 * Returns the GraphQL endpoint for a custom subgraph.
 * Custom subgraphs are served at `/graphql/<subgraph-name>`.
 */
export function getSubgraphUrl(subgraph: string): string {
  return `${getGraphQLUrl()}/${subgraph}`;
}
