/**
 * Service for creating Account Transactions documents and fetching transactions
 * Integrates with the existing GraphQL subgraph system
 */

import type { AccountEntry } from "../../../document-models/accounts/gen/schema/types.js";

export interface CreateAccountTransactionsResult {
  success: boolean;
  documentId?: string;
  transactionsAdded?: number;
  message: string;
}

export class AccountTransactionsService {
  private graphqlEndpoint: string;

  constructor() {
    // Use the same environment detection as other services
    this.graphqlEndpoint = this.getGraphQLEndpoint();
  }

  private getGraphQLEndpoint(): string {
    // Environment-aware endpoint selection
    if (typeof window !== 'undefined' && !window.document.baseURI.includes('localhost')) {
      return 'https://switchboard-dev.powerhouse.xyz/graphql';
    }
    return 'http://localhost:4001/graphql';
  }

  /**
   * Create an Account Transactions document and fetch transactions for the account
   */
  async createAccountTransactionsDocument(
    account: AccountEntry,
    accountsDocumentId: string,
    driveId?: string
  ): Promise<CreateAccountTransactionsResult> {
    try {
      // Step 1: Create the Account Transactions document
      const documentName = `${account.name} Transactions`;
      const createResult = await this.createDocument(documentName, driveId);

      if (!createResult.success || !createResult.documentId) {
        throw new Error(createResult.message || "Failed to create document");
      }

      // Step 2: Set the account information in the document
      await this.setAccountInfo(createResult.documentId, account);

      // Step 3: Fetch and add transactions from Alchemy
      const transactionsResult = await this.fetchTransactionsFromAlchemy(
        createResult.documentId,
        account.account
      );

      if (!transactionsResult.success) {
        console.warn('[AccountTransactionsService] fetchTransactionsFromAlchemy failed:', transactionsResult.message);
      }

      // Step 4: Update the account with the transaction document ID
      // Always set the AccountTransactionsId so the documents are linked
      await this.updateAccountTransactionsId(
        accountsDocumentId,
        account.id,
        createResult.documentId
      );

      return {
        success: true,
        documentId: createResult.documentId,
        transactionsAdded: transactionsResult.transactionsAdded || 0,
        message: `Successfully created document and fetched ${transactionsResult.transactionsAdded || 0} transactions`
      };

    } catch (error) {
      return {
        success: false,
        message: `Failed to create account transactions: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Create a new Account Transactions document
   */
  private async createDocument(name: string, driveId?: string): Promise<CreateAccountTransactionsResult> {
    console.log('[AccountTransactionsService] Creating document', {
      name,
      driveId,
      hasDriveId: !!driveId,
      endpoint: this.graphqlEndpoint
    });
    
    const variables = {
      name,
      ...(driveId && { driveId })
    };
    
    console.log('[AccountTransactionsService] Sending GraphQL request with variables:', variables);
    
    const requestBody = {
      query: `
        mutation CreateAccountTransactionsDocument($name: String!, $driveId: String) {
          AccountTransactions_createDocument(name: $name, driveId: $driveId)
        }
      `,
      variables
    };
    
    console.log('[AccountTransactionsService] GraphQL request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(this.graphqlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json() as {
      errors?: Array<{message: string}>;
      data?: {
        AccountTransactions_createDocument?: string;
      };
    };

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    const documentId = result.data?.AccountTransactions_createDocument;
    if (!documentId) {
      throw new Error("Failed to create Account Transactions document");
    }

    return {
      success: true,
      documentId,
      message: "Document created successfully"
    };
  }

  /**
   * Set account information in the Account Transactions document
   */
  private async setAccountInfo(documentId: string, account: AccountEntry): Promise<void> {
    console.log('[AccountTransactionsService] Setting account info:', {
      documentId,
      address: account.account,
      name: account.name
    });

    const response = await fetch(this.graphqlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation SetAccount($docId: PHID!, $input: AccountTransactions_SetAccountInput!) {
            AccountTransactions_setAccount(docId: $docId, input: $input)
          }
        `,
        variables: {
          docId: documentId,
          input: {
            address: account.account,
            name: account.name
          }
        }
      })
    });

    console.log('[AccountTransactionsService] SetAccount response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AccountTransactionsService] SetAccount failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`Failed to set account info: ${response.status} - ${response.statusText} - ${errorText}`);
    }

    const result = await response.json() as {
      errors?: Array<{message: string}>;
      data?: {
        AccountTransactions_setAccount?: boolean;
      };
    };

    console.log('[AccountTransactionsService] SetAccount result:', result);

    if (result.errors) {
      console.error('[AccountTransactionsService] SetAccount GraphQL errors:', result.errors);
      throw new Error(result.errors[0]?.message || 'Failed to set account info');
    }

    if (result.data?.AccountTransactions_setAccount) {
      console.log('[AccountTransactionsService] Account successfully set!');
    } else {
      console.warn('[AccountTransactionsService] SetAccount returned false or undefined');
    }
  }

  /**
   * Fetch transactions from Alchemy and add them to the document
   */
  private async fetchTransactionsFromAlchemy(
    documentId: string,
    address: string
  ): Promise<{ success: boolean; transactionsAdded?: number; message: string }> {
    const response = await fetch(this.graphqlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation FetchTransactionsFromAlchemy($docId: PHID!, $address: EthereumAddress!) {
            AccountTransactions_fetchTransactionsFromAlchemy(docId: $docId, address: $address) {
              success
              transactionsAdded
              message
            }
          }
        `,
        variables: { docId: documentId, address }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json() as {
      errors?: Array<{message: string}>;
      data?: {
        AccountTransactions_fetchTransactionsFromAlchemy?: {
          success: boolean;
          transactionsAdded?: number;
          message: string;
        };
      };
    };

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to fetch transactions');
    }

    const fetchResult = result.data?.AccountTransactions_fetchTransactionsFromAlchemy;
    if (!fetchResult) {
      throw new Error("No result from transaction fetch");
    }

    return fetchResult;
  }

  /**
   * Update the account with the Account Transactions document ID
   */
  private async updateAccountTransactionsId(
    accountsDocumentId: string,
    accountId: string,
    transactionsDocumentId: string
  ): Promise<void> {
    console.log('[AccountTransactionsService] Updating account with transactions ID:', {
      accountsDocumentId,
      accountId,
      transactionsDocumentId
    });

    const response = await fetch(this.graphqlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation UpdateAccountTransactionsId($docId: PHID!, $input: Accounts_UpdateAccountInput!) {
            Accounts_updateAccount(docId: $docId, input: $input)
          }
        `,
        variables: {
          docId: accountsDocumentId,
          input: {
            id: accountId,
            accountTransactionsId: transactionsDocumentId
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AccountTransactionsService] Failed to update account:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`Failed to update account: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json() as {
      errors?: Array<{message: string}>;
      data?: {
        Accounts_updateAccount?: number;
      };
    };

    if (result.errors) {
      console.error('[AccountTransactionsService] GraphQL errors:', result.errors);
      throw new Error(result.errors[0]?.message || 'Failed to update account');
    }

    console.log('[AccountTransactionsService] Account successfully updated with transactions ID');
  }

  /**
   * Sync transactions for an existing Account Transactions document
   */
  async syncTransactionsForDocument(
    documentId: string,
    address: string
  ): Promise<{ success: boolean; transactionsAdded?: number; message: string }> {
    try {
      return await this.fetchTransactionsFromAlchemy(documentId, address);
    } catch (error) {
      return {
        success: false,
        message: `Failed to sync transactions: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get environment information for debugging
   */
  getEnvironmentInfo() {
    return {
      endpoint: this.graphqlEndpoint,
      mode: this.graphqlEndpoint.includes('localhost') ? 'Local Connect' : 'Remote Switchboard'
    };
  }
}

// Export singleton instance
export const accountTransactionsService = new AccountTransactionsService();