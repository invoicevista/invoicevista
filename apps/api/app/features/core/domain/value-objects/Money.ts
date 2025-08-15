import { Decimal } from 'decimal.js';
import { Currency } from './Currency';

/**
 * Money Value Object
 * Represents monetary amounts with proper decimal precision
 * Never uses floating-point arithmetic
 */
export class Money {
  public readonly amount: Decimal;
  public readonly currency: Currency;

  constructor(amount: number | string | Decimal, currency: Currency) {
    this.amount = new Decimal(amount);
    this.currency = currency;
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.currency) {
      throw new Error('Currency is required');
    }

    // Ensure amount has correct decimal places for the currency
    const scale = this.amount.decimalPlaces();
    if (scale > this.currency.decimalPlaces) {
      throw new Error(
        `Amount ${this.amount} has too many decimal places for ${this.currency.code} (max: ${this.currency.decimalPlaces})`
      );
    }
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount.add(other.amount), this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount.sub(other.amount), this.currency);
  }

  multiply(factor: number | string | Decimal): Money {
    const result = this.amount.mul(factor);
    // Round to currency decimal places
    const rounded = result.toDecimalPlaces(this.currency.decimalPlaces);
    return new Money(rounded, this.currency);
  }

  divide(divisor: number | string | Decimal): Money {
    if (new Decimal(divisor).isZero()) {
      throw new Error('Cannot divide by zero');
    }
    const result = this.amount.div(divisor);
    // Round to currency decimal places
    const rounded = result.toDecimalPlaces(this.currency.decimalPlaces);
    return new Money(rounded, this.currency);
  }

  negate(): Money {
    return new Money(this.amount.neg(), this.currency);
  }

  isPositive(): boolean {
    return this.amount.isPositive();
  }

  isNegative(): boolean {
    return this.amount.isNegative();
  }

  isZero(): boolean {
    return this.amount.isZero();
  }

  equals(other: Money): boolean {
    return (
      this.currency.equals(other.currency) &&
      this.amount.equals(other.amount)
    );
  }

  greaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount.greaterThan(other.amount);
  }

  lessThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount.lessThan(other.amount);
  }

  round(decimalPlaces?: number): Money {
    const places = decimalPlaces ?? this.currency.decimalPlaces;
    return new Money(
      this.amount.toDecimalPlaces(places),
      this.currency
    );
  }

  private assertSameCurrency(other: Money): void {
    if (!this.currency.equals(other.currency)) {
      throw new Error(
        `Cannot perform operation on different currencies: ${this.currency.code} and ${other.currency.code}`
      );
    }
  }

  toString(): string {
    return `${this.currency.code} ${this.amount.toFixed(this.currency.decimalPlaces)}`;
  }

  toJSON() {
    return {
      amount: this.amount.toString(),
      currency: this.currency.code
    };
  }

  static zero(currency: Currency): Money {
    return new Money(0, currency);
  }

  static fromJSON(data: { amount: string; currency: string }): Money {
    return new Money(data.amount, Currency.fromCode(data.currency));
  }
}