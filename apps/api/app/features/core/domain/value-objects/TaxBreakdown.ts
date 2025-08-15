import { Money } from './Money';
import { TaxCategory } from './TaxCategory';
import { Percentage } from './Percentage';

/**
 * TaxBreakdown Value Object
 * Represents tax breakdown by category and rate
 */
export class TaxBreakdown {
  constructor(
    public readonly taxableAmount: Money, // Amount subject to tax
    public readonly taxAmount: Money, // Calculated tax amount
    public readonly taxCategory: TaxCategory, // Tax category
    public readonly taxRate: Percentage, // Tax rate
    public readonly exemptionReason?: string, // Exemption reason text
    public readonly exemptionReasonCode?: string // Exemption reason code
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    // If tax category requires exemption reason, it must be provided
    if (this.taxCategory.requiresExemptionReason()) {
      if (!this.exemptionReason && !this.exemptionReasonCode) {
        throw new Error(
          `Tax category ${this.taxCategory.code} requires exemption reason or code`
        );
      }
    }

    // If tax category requires rate, it must be greater than zero
    if (this.taxCategory.requiresTaxRate()) {
      if (!this.taxRate || this.taxRate.isZero()) {
        throw new Error(
          `Tax category ${this.taxCategory.code} requires tax rate greater than zero`
        );
      }
    }

    // Categories that don't require tax rate must have zero rate
    if (!this.taxCategory.requiresTaxRate() && !this.taxRate.isZero()) {
      throw new Error(`Tax category ${this.taxCategory.code} must have zero tax rate`);
    }

    // Ensure currencies match
    if (!this.taxableAmount.currency.equals(this.taxAmount.currency)) {
      throw new Error('Taxable amount and tax amount must be in the same currency');
    }

    // Validate tax calculation (with tolerance for rounding)
    const calculatedTax = this.calculateTaxAmount();
    const tolerance = new Money('0.01', this.taxAmount.currency);
    
    const difference = this.taxAmount.subtract(calculatedTax);
    if (difference.isNegative()) {
      const absDiff = difference.negate();
      if (absDiff.greaterThan(tolerance)) {
        throw new Error(
          `Tax amount ${this.taxAmount} does not match calculated amount ${calculatedTax}`
        );
      }
    } else if (difference.greaterThan(tolerance)) {
      throw new Error(
        `Tax amount ${this.taxAmount} does not match calculated amount ${calculatedTax}`
      );
    }
  }

  private calculateTaxAmount(): Money {
    if (this.taxRate.isZero()) {
      return Money.zero(this.taxAmount.currency);
    }
    
    // Calculate tax: taxable * (rate / 100)
    const rate = this.taxRate.asDecimal();
    return this.taxableAmount.multiply(rate.div(100));
  }

  equals(other: TaxBreakdown): boolean {
    return (
      this.taxableAmount.equals(other.taxableAmount) &&
      this.taxAmount.equals(other.taxAmount) &&
      this.taxCategory.equals(other.taxCategory) &&
      this.taxRate.equals(other.taxRate) &&
      this.exemptionReason === other.exemptionReason &&
      this.exemptionReasonCode === other.exemptionReasonCode
    );
  }

  static calculate(
    taxableAmount: Money,
    taxCategory: TaxCategory,
    taxRate: Percentage,
    exemptionReason?: string,
    exemptionReasonCode?: string
  ): TaxBreakdown {
    let taxAmount: Money;
    
    if (taxRate.isZero() || !taxCategory.requiresTaxRate()) {
      taxAmount = Money.zero(taxableAmount.currency);
    } else {
      const rate = taxRate.asDecimal();
      taxAmount = taxableAmount.multiply(rate.div(100));
    }

    return new TaxBreakdown(
      taxableAmount,
      taxAmount,
      taxCategory,
      taxRate,
      exemptionReason,
      exemptionReasonCode
    );
  }
}