import { Decimal } from 'decimal.js';

/**
 * Percentage Value Object
 * Represents percentage values with 4 decimal places precision
 */
export class Percentage {
  private static readonly MAX_DECIMAL_PLACES = 4;
  public readonly value: Decimal;

  constructor(value: number | string | Decimal) {
    this.value = new Decimal(value);
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (this.value.isNegative()) {
      throw new Error('Percentage cannot be negative');
    }

    if (this.value.greaterThan(100)) {
      throw new Error('Percentage cannot be greater than 100');
    }

    // Ensure maximum 4 decimal places
    const scale = this.value.decimalPlaces();
    if (scale > Percentage.MAX_DECIMAL_PLACES) {
      throw new Error(
        `Percentage has too many decimal places: ${scale} (max: ${Percentage.MAX_DECIMAL_PLACES})`
      );
    }
  }

  add(other: Percentage): Percentage {
    return new Percentage(this.value.add(other.value));
  }

  subtract(other: Percentage): Percentage {
    return new Percentage(this.value.sub(other.value));
  }

  multiply(factor: number | string | Decimal): Percentage {
    const result = this.value.mul(factor);
    const rounded = result.toDecimalPlaces(Percentage.MAX_DECIMAL_PLACES);
    return new Percentage(rounded);
  }

  divide(divisor: number | string | Decimal): Percentage {
    if (new Decimal(divisor).isZero()) {
      throw new Error('Cannot divide by zero');
    }
    const result = this.value.div(divisor);
    const rounded = result.toDecimalPlaces(Percentage.MAX_DECIMAL_PLACES);
    return new Percentage(rounded);
  }

  isZero(): boolean {
    return this.value.isZero();
  }

  equals(other: Percentage): boolean {
    return this.value.equals(other.value);
  }

  greaterThan(other: Percentage): boolean {
    return this.value.greaterThan(other.value);
  }

  lessThan(other: Percentage): boolean {
    return this.value.lessThan(other.value);
  }

  asDecimal(): Decimal {
    return this.value;
  }

  toString(): string {
    return `${this.value.toFixed(Percentage.MAX_DECIMAL_PLACES)}%`;
  }

  toJSON() {
    return this.value.toString();
  }

  static zero(): Percentage {
    return new Percentage(0);
  }

  static fromJSON(value: string): Percentage {
    return new Percentage(value);
  }
}