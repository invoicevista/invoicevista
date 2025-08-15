import { Decimal } from 'decimal.js';

/**
 * Quantity Value Object
 * Represents quantities with proper decimal precision
 */
export class Quantity {
  private static readonly MAX_DECIMAL_PLACES = 6; // EN16931 allows up to 6 decimal places for quantities
  public readonly value: Decimal;
  public readonly unitCode: string; // UN/ECE Rec 20 code

  constructor(value: number | string | Decimal, unitCode: string) {
    this.value = new Decimal(value);
    this.unitCode = unitCode;
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (this.value.isNegative()) {
      throw new Error('Quantity cannot be negative');
    }

    if (!this.unitCode || this.unitCode.trim().length === 0) {
      throw new Error('Unit code is required');
    }

    // Validate decimal places
    const scale = this.value.decimalPlaces();
    if (scale > Quantity.MAX_DECIMAL_PLACES) {
      throw new Error(
        `Quantity has too many decimal places: ${scale} (max: ${Quantity.MAX_DECIMAL_PLACES})`
      );
    }
  }

  add(other: Quantity): Quantity {
    this.assertSameUnit(other);
    return new Quantity(this.value.add(other.value), this.unitCode);
  }

  subtract(other: Quantity): Quantity {
    this.assertSameUnit(other);
    return new Quantity(this.value.sub(other.value), this.unitCode);
  }

  multiply(factor: number | string | Decimal): Quantity {
    const result = this.value.mul(factor);
    const rounded = result.toDecimalPlaces(Quantity.MAX_DECIMAL_PLACES);
    return new Quantity(rounded, this.unitCode);
  }

  divide(divisor: number | string | Decimal): Quantity {
    if (new Decimal(divisor).isZero()) {
      throw new Error('Cannot divide by zero');
    }
    const result = this.value.div(divisor);
    const rounded = result.toDecimalPlaces(Quantity.MAX_DECIMAL_PLACES);
    return new Quantity(rounded, this.unitCode);
  }

  isZero(): boolean {
    return this.value.isZero();
  }

  equals(other: Quantity): boolean {
    return (
      this.value.equals(other.value) &&
      this.unitCode === other.unitCode
    );
  }

  greaterThan(other: Quantity): boolean {
    this.assertSameUnit(other);
    return this.value.greaterThan(other.value);
  }

  lessThan(other: Quantity): boolean {
    this.assertSameUnit(other);
    return this.value.lessThan(other.value);
  }

  private assertSameUnit(other: Quantity): void {
    if (this.unitCode !== other.unitCode) {
      throw new Error(
        `Cannot perform operation on different units: ${this.unitCode} and ${other.unitCode}`
      );
    }
  }

  toString(): string {
    return `${this.value.toFixed()} ${this.unitCode}`;
  }

  toJSON() {
    return {
      value: this.value.toString(),
      unitCode: this.unitCode
    };
  }

  static zero(unitCode: string): Quantity {
    return new Quantity(0, unitCode);
  }

  static fromJSON(data: { value: string; unitCode: string }): Quantity {
    return new Quantity(data.value, data.unitCode);
  }
}