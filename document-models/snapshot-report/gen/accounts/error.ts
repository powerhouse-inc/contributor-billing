export type ErrorCode = "DuplicateAccountError" | "AccountNotFoundError";

export interface ReducerError {
  errorCode: ErrorCode;
}

export class DuplicateAccountError extends Error implements ReducerError {
  errorCode = "DuplicateAccountError" as ErrorCode;
  constructor(message = "DuplicateAccountError") {
    super(message);
  }
}

export class AccountNotFoundError extends Error implements ReducerError {
  errorCode = "AccountNotFoundError" as ErrorCode;
  constructor(message = "AccountNotFoundError") {
    super(message);
  }
}

export const errors = {
  AddSnapshotAccount: {
    DuplicateAccountError,
  },
  UpdateSnapshotAccountType: {
    AccountNotFoundError,
  },
  RemoveSnapshotAccount: {
    AccountNotFoundError,
  },
};
