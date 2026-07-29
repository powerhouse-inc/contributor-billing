// Types for validation
export type ValidationSeverity = "error" | "warning" | "none";

export type ValidationResult = {
  isValid: boolean;
  message: string;
  severity: ValidationSeverity;
};
