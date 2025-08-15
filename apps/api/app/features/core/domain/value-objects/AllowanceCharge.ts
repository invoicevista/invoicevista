import { Money } from './Money';
import { Percentage } from './Percentage';
import { TaxCategory } from './TaxCategory';

/**
 * AllowanceCharge Value Object
 * Represents discounts (allowances) or additional charges
 */
export class AllowanceCharge {
  constructor(
    public readonly isCharge: boolean, // false = allowance/discount, true = charge
    public readonly amount: Money,
    public readonly baseAmount?: Money,
    public readonly percentage?: Percentage,
    public readonly reason?: string,
    public readonly reasonCode?: string,
    public readonly taxCategory?: TaxCategory,
    public readonly taxRate?: Percentage
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    // Amount must be positive
    if (!this.amount.isPositive() && !this.amount.isZero()) {
      throw new Error('Allowance/charge amount must be positive or zero');
    }

    // If percentage is provided, base amount should also be provided
    if (this.percentage && !this.baseAmount) {
      throw new Error('Base amount is required when percentage is specified');
    }

    // If both percentage and base amount are provided, validate calculation
    if (this.percentage && this.baseAmount) {
      const calculated = this.calculateAmount();
      const tolerance = new Money('0.01', this.amount.currency);
      
      const difference = this.amount.subtract(calculated);
      const absDiff = difference.isNegative() ? difference.negate() : difference;
      
      if (absDiff.greaterThan(tolerance)) {
        throw new Error(
          `Allowance/charge amount ${this.amount} does not match calculated amount ${calculated}`
        );
      }
    }

    // If tax category is provided, tax rate should match
    if (this.taxCategory && this.taxCategory.requiresTaxRate() && !this.taxRate) {
      throw new Error(`Tax rate is required for tax category ${this.taxCategory.code}`);
    }

    // Validate reason code if provided
    if (this.reasonCode && !this.isValidReasonCode(this.reasonCode)) {
      console.warn(`Non-standard reason code: ${this.reasonCode}`);
    }
  }

  private calculateAmount(): Money {
    if (!this.percentage || !this.baseAmount) {
      return this.amount;
    }
    
    const rate = this.percentage.asDecimal();
    return this.baseAmount.multiply(rate.div(100));
  }

  private isValidReasonCode(code: string): boolean {
    // UNCL5189 for allowances, UNCL7161 for charges
    // These are extensive code lists - for now just check format
    return /^[A-Z0-9]{1,3}$/.test(code);
  }

  getType(): string {
    return this.isCharge ? 'Charge' : 'Allowance';
  }

  getEffectiveAmount(): Money {
    // For calculations, charges are positive, allowances are negative
    return this.isCharge ? this.amount : this.amount.negate();
  }

  equals(other: AllowanceCharge): boolean {
    return (
      this.isCharge === other.isCharge &&
      this.amount.equals(other.amount) &&
      (this.baseAmount?.equals(other.baseAmount!) ?? other.baseAmount === undefined) &&
      (this.percentage?.equals(other.percentage!) ?? other.percentage === undefined) &&
      this.reason === other.reason &&
      this.reasonCode === other.reasonCode &&
      (this.taxCategory?.equals(other.taxCategory!) ?? other.taxCategory === undefined) &&
      (this.taxRate?.equals(other.taxRate!) ?? other.taxRate === undefined)
    );
  }

  toString(): string {
    const type = this.getType();
    const parts = [type];
    
    if (this.percentage) {
      parts.push(`${this.percentage.toString()}`);
    } else {
      parts.push(this.amount.toString());
    }
    
    if (this.reason) {
      parts.push(`(${this.reason})`);
    }
    
    return parts.join(' ');
  }

  toJSON() {
    return {
      isCharge: this.isCharge,
      amount: this.amount.toJSON(),
      baseAmount: this.baseAmount?.toJSON(),
      percentage: this.percentage?.toJSON(),
      reason: this.reason,
      reasonCode: this.reasonCode,
      taxCategory: this.taxCategory?.code,
      taxRate: this.taxRate?.toJSON()
    };
  }

  static createDiscount(
    amount: Money,
    reason?: string,
    percentage?: Percentage,
    baseAmount?: Money
  ): AllowanceCharge {
    return new AllowanceCharge(
      false,
      amount,
      baseAmount,
      percentage,
      reason
    );
  }

  static createCharge(
    amount: Money,
    reason?: string,
    percentage?: Percentage,
    baseAmount?: Money
  ): AllowanceCharge {
    return new AllowanceCharge(
      true,
      amount,
      baseAmount,
      percentage,
      reason
    );
  }
}