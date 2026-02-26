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

  return "https://jetstream.powerhouse.io/api/graphql/";
}
