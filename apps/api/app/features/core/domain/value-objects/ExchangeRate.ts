import { Decimal } from 'decimal.js';

/**
 * ExchangeRate Value Object
 * Represents currency exchange rate at a specific point in time
 */
export class ExchangeRate {
  private static readonly MAX_DECIMAL_PLACES = 6;

  constructor(
    public readonly rate: Decimal,
    public readonly source: string, // e.g., "ECB", "XE", "MANUAL"
    public readonly timestamp: Date,
    public readonly fromCurrency?: string, // Source currency code
    public readonly toCurrency?: string // Target currency code
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (this.rate.isNegative() || this.rate.isZero()) {
      throw new Error('Exchange rate must be positive');
    }

    if (!this.source || this.source.trim().length === 0) {
      throw new Error('Exchange rate source is required');
    }

    if (this.timestamp > new Date()) {
      throw new Error('Exchange rate timestamp cannot be in the future');
    }

    // Validate decimal places
    const scale = this.rate.decimalPlaces();
    if (scale > ExchangeRate.MAX_DECIMAL_PLACES) {
      throw new Error(
        `Exchange rate has too many decimal places: ${scale} (max: ${ExchangeRate.MAX_DECIMAL_PLACES})`
      );
    }

    if (this.fromCurrency && !/^[A-Z]{3}$/.test(this.fromCurrency)) {
      throw new Error(`Invalid from currency code: ${this.fromCurrency}`);
    }

    if (this.toCurrency && !/^[A-Z]{3}$/.test(this.toCurrency)) {
      throw new Error(`Invalid to currency code: ${this.toCurrency}`);
    }
  }

  convert(amount: Decimal): Decimal {
    return amount.mul(this.rate).toDecimalPlaces(2);
  }

  convertReverse(amount: Decimal): Decimal {
    return amount.div(this.rate).toDecimalPlaces(2);
  }

  getInverseRate(): ExchangeRate {
    const inverseRate = new Decimal(1).div(this.rate);
    return new ExchangeRate(
      inverseRate,
      this.source,
      this.timestamp,
      this.toCurrency,
      this.fromCurrency
    );
  }

  isStale(maxAgeHours: number = 24): boolean {
    const ageInMs = Date.now() - this.timestamp.getTime();
    const ageInHours = ageInMs / (1000 * 60 * 60);
    return ageInHours > maxAgeHours;
  }

  equals(other: ExchangeRate): boolean {
    return (
      this.rate.equals(other.rate) &&
      this.source === other.source &&
      this.timestamp.getTime() === other.timestamp.getTime() &&
      this.fromCurrency === other.fromCurrency &&
      this.toCurrency === other.toCurrency
    );
  }

  toString(): string {
    const parts = [this.rate.toFixed(ExchangeRate.MAX_DECIMAL_PLACES)];
    
    if (this.fromCurrency && this.toCurrency) {
      parts.push(`${this.fromCurrency}/${this.toCurrency}`);
    }
    
    parts.push(`(${this.source})`);
    const dateStr = this.timestamp.toISOString();
    const datePart = dateStr.split('T')[0];
    if (datePart) {
      parts.push(datePart);
    }
    
    return parts.join(' ');
  }

  toJSON() {
    return {
      rate: this.rate.toString(),
      source: this.source,
      timestamp: this.timestamp.toISOString(),
      fromCurrency: this.fromCurrency,
      toCurrency: this.toCurrency
    };
  }

  static fromJSON(data: {
    rate: string;
    source: string;
    timestamp: string;
    fromCurrency?: string;
    toCurrency?: string;
  }): ExchangeRate {
    return new ExchangeRate(
      new Decimal(data.rate),
      data.source,
      new Date(data.timestamp),
      data.fromCurrency,
      data.toCurrency
    );
  }
}