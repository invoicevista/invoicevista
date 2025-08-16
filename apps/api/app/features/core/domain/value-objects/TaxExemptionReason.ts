import { TaxExemptionReasonCode } from '../../../invoice-management/domain/value-objects';

/**
 * TaxExemptionReason Value Object
 * Represents the reason for tax exemption
 */
export class TaxExemptionReason {
  constructor(
    public readonly text: string, // Free text reason
    public readonly code?: TaxExemptionReasonCode | string // Coded reason
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.text || this.text.trim().length === 0) {
      if (!this.code) {
        throw new Error('Either exemption reason text or code is required');
      }
    }

    if (this.text && this.text.length > 500) {
      throw new Error('Exemption reason text cannot exceed 500 characters');
    }

    // Validate known codes
    if (this.code && !this.isValidCode(this.code)) {
      console.warn(`Non-standard tax exemption reason code: ${this.code}`);
    }
  }

  private isValidCode(code: string): boolean {
    // Check if it's a known code from TaxExemptionReasonEnum
    return Object.values(TaxExemptionReasonCode).includes(code as TaxExemptionReasonCode);
  }

  getDisplayText(): string {
    if (this.text) {
      return this.text;
    }

    // Generate text from code
    switch (this.code) {
      case TaxExemptionReasonCode.EXPORT:
        return 'Export';
      case TaxExemptionReasonCode.INTER_JURISDICTION:
        return 'Inter-jurisdictional supply';
      case TaxExemptionReasonCode.REVERSE_CHARGE:
        return 'Reverse charge';
      case TaxExemptionReasonCode.PUBLIC_BODY:
        return 'Public body exemption';
      case TaxExemptionReasonCode.EDUCATIONAL:
        return 'Educational exemption';
      case TaxExemptionReasonCode.CHARITABLE:
        return 'Charitable exemption';
      case TaxExemptionReasonCode.MEDICAL:
        return 'Medical/Healthcare exemption';
      case TaxExemptionReasonCode.FINANCIAL:
        return 'Financial services exemption';
      case TaxExemptionReasonCode.SMALL_BUSINESS:
        return 'Small business threshold exemption';
      case TaxExemptionReasonCode.OTHER:
        return 'Other exemption';
      case TaxExemptionReasonCode.NOT_APPLICABLE:
        return 'Tax not applicable';
      default:
        return this.code || 'Tax exemption applies';
    }
  }

  equals(other: TaxExemptionReason): boolean {
    return (
      this.text === other.text &&
      this.code === other.code
    );
  }

  toString(): string {
    const parts = [];
    if (this.text) parts.push(this.text);
    if (this.code) parts.push(`[${this.code}]`);
    return parts.join(' ');
  }

  toJSON() {
    return {
      text: this.text,
      code: this.code
    };
  }

  static fromCode(code: TaxExemptionReasonCode | string): TaxExemptionReason {
    return new TaxExemptionReason('', code);
  }

  static fromText(text: string): TaxExemptionReason {
    return new TaxExemptionReason(text);
  }
}