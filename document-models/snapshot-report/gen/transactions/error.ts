export type ErrorCode =
  | "DuplicateTransactionError"
  | "AccountNotFoundError"
  | "TransactionNotFoundError";

export interface ReducerError {
  errorCode: ErrorCode;
}

export class DuplicateTransactionError extends Error implements ReducerError {
  errorCode = "DuplicateTransactionError" as ErrorCode;
  constructor(message = "DuplicateTransactionError") {
    super(message);
  }
}

export class AccountNotFoundError extends Error implements ReducerError {
  errorCode = "AccountNotFoundError" as ErrorCode;
  constructor(message = "AccountNotFoundError") {
    super(message);
  }
}

export class TransactionNotFoundError extends Error implements ReducerError {
  errorCode = "TransactionNotFoundError" as ErrorCode;
  constructor(message = "TransactionNotFoundError") {
    super(message);
  }
}

export const errors = {
  AddTransaction: {
    DuplicateTransactionError,
    AccountNotFoundError,
  },
  RemoveTransaction: {
    TransactionNotFoundError,
  },
  UpdateTransactionFlowType: {
    TransactionNotFoundError,
  },
};
