export type ErrorCode = "AccountNotFoundError" | "BalanceNotFoundError";

export interface ReducerError {
  errorCode: ErrorCode;
}

export class AccountNotFoundError extends Error implements ReducerError {
  errorCode = "AccountNotFoundError" as ErrorCode;
  constructor(message = "AccountNotFoundError") {
    super(message);
  }
}

export class BalanceNotFoundError extends Error implements ReducerError {
  errorCode = "BalanceNotFoundError" as ErrorCode;
  constructor(message = "BalanceNotFoundError") {
    super(message);
  }
}

export const errors = {
  SetStartingBalance: {
    AccountNotFoundError,
  },
  SetEndingBalance: {
    AccountNotFoundError,
  },
  RemoveStartingBalance: {
    BalanceNotFoundError,
  },
  RemoveEndingBalance: {
    BalanceNotFoundError,
  },
};
