import { ValidationSeverity } from '../types';

/**
 * ValidationResult Value Object
 * Represents the result of validating an invoice against a profile
 */
export class ValidationResult {
  constructor(
    public readonly profile: string,
    public readonly timestamp: Date,
    public readonly isValid: boolean,
    public readonly errors: ValidationIssue[],
    public readonly warnings: ValidationIssue[],
    public readonly info: ValidationIssue[]
  ) {
    Object.freeze(this.errors);
    Object.freeze(this.warnings);
    Object.freeze(this.info);
    Object.freeze(this);
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  hasWarnings(): boolean {
    return this.warnings.length > 0;
  }

  getAllIssues(): ValidationIssue[] {
    return [...this.errors, ...this.warnings, ...this.info];
  }

  getIssuesBySeverity(severity: ValidationSeverity): ValidationIssue[] {
    switch (severity) {
      case ValidationSeverity.ERROR:
        return this.errors;
      case ValidationSeverity.WARNING:
        return this.warnings;
      case ValidationSeverity.INFO:
        return this.info;
      default:
        return [];
    }
  }

  toString(): string {
    const parts = [`Validation ${this.isValid ? 'PASSED' : 'FAILED'} for ${this.profile}`];
    
    if (this.errors.length > 0) {
      parts.push(`Errors: ${this.errors.length}`);
    }
    if (this.warnings.length > 0) {
      parts.push(`Warnings: ${this.warnings.length}`);
    }
    
    return parts.join(', ');
  }

  toJSON() {
    return {
      profile: this.profile,
      timestamp: this.timestamp.toISOString(),
      isValid: this.isValid,
      errors: this.errors.map(e => e.toJSON()),
      warnings: this.warnings.map(w => w.toJSON()),
      info: this.info.map(i => i.toJSON())
    };
  }

  static success(profile: string, warnings: ValidationIssue[] = [], info: ValidationIssue[] = []): ValidationResult {
    return new ValidationResult(
      profile,
      new Date(),
      true,
      [],
      warnings,
      info
    );
  }

  static failure(profile: string, errors: ValidationIssue[], warnings: ValidationIssue[] = [], info: ValidationIssue[] = []): ValidationResult {
    return new ValidationResult(
      profile,
      new Date(),
      false,
      errors,
      warnings,
      info
    );
  }
}

/**
 * ValidationIssue
 * Represents a single validation issue
 */
export class ValidationIssue {
  constructor(
    public readonly code: string, // e.g., "BR-01", "PEPPOL-EN16931-R002"
    public readonly message: string,
    public readonly severity: ValidationSeverity,
    public readonly path?: string, // XPath or field path
    public readonly businessTerm?: string,
    public readonly value?: any, // The invalid value
    public readonly suggestion?: string // Suggested fix
  ) {
    Object.freeze(this);
  }

  toString(): string {
    const parts = [`[${this.severity}] ${this.code}: ${this.message}`];
    
    if (this.path) {
      parts.push(`at ${this.path}`);
    }
    if (this.value !== undefined) {
      parts.push(`(value: ${JSON.stringify(this.value)})`);
    }
    if (this.suggestion) {
      parts.push(`Suggestion: ${this.suggestion}`);
    }
    
    return parts.join(' ');
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      severity: this.severity,
      path: this.path,
      businessTerm: this.businessTerm,
      value: this.value,
      suggestion: this.suggestion
    };
  }
}

/**
 * ValidationProfile
 * Represents a validation profile configuration
 */
export class ValidationProfile {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly rules: ValidationRule[],
    public readonly schemaPath?: string,
    public readonly schematronPath?: string
  ) {
    Object.freeze(this.rules);
    Object.freeze(this);
  }

  getRuleByCode(code: string): ValidationRule | undefined {
    return this.rules.find(r => r.code === code);
  }

  getMandatoryRules(): ValidationRule[] {
    return this.rules.filter(r => r.severity === ValidationSeverity.ERROR);
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      rules: this.rules.map(r => r.toJSON()),
      schemaPath: this.schemaPath,
      schematronPath: this.schematronPath
    };
  }
}

/**
 * ValidationRule
 * Represents a single validation rule
 */
export class ValidationRule {
  constructor(
    public readonly code: string,
    public readonly description: string,
    public readonly severity: ValidationSeverity,
    public readonly category: string, // e.g., "syntax", "semantic", "business"
    public readonly expression?: string, // XPath or other expression
    public readonly errorMessage: string = description
  ) {
    Object.freeze(this);
  }

  toJSON() {
    return {
      code: this.code,
      description: this.description,
      severity: this.severity,
      category: this.category,
      expression: this.expression,
      errorMessage: this.errorMessage
    };
  }
}