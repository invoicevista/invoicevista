/**
 * TaxNumber Value Object
 * Represents a tax registration number for any jurisdiction
 */
export class TaxNumber {
  constructor(
    public readonly countryCode: string, // ISO 3166-1 alpha-2
    public readonly number: string
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.isValidCountryCode(this.countryCode)) {
      throw new Error(`Invalid country code: ${this.countryCode}`);
    }

    if (!this.number || this.number.trim().length === 0) {
      throw new Error('VAT number cannot be empty');
    }

    // Remove spaces and special characters for validation
    const cleanNumber = this.number.replace(/[\s\-\.]/g, '');
    
    // Basic format validation by country
    if (!this.isValidFormat(this.countryCode, cleanNumber)) {
      throw new Error(`Invalid VAT number format for ${this.countryCode}: ${this.number}`);
    }
  }

  private isValidCountryCode(code: string): boolean {
    return /^[A-Z]{2}$/.test(code);
  }

  private isValidFormat(countryCode: string, number: string): boolean {
    // Basic validation - allow any alphanumeric format
    // Specific validation can be added via configuration
    const patterns: Record<string, RegExp> = {
      // Common patterns - can be extended
      US: /^\d{2}-\d{7}$/,                // US EIN format
      CA: /^\d{9}[A-Z]{2}\d{4}$/,         // Canadian BN
      AU: /^\d{11}$/,                     // Australian ABN
      JP: /^\d{12}$/,                     // Japanese Corporate Number
      // Default pattern for unknown countries
      DEFAULT: /^[A-Z0-9]{5,20}$/
    };

    const pattern = patterns[countryCode] || patterns.DEFAULT;
    if (!pattern) {
      // Allow any format if no pattern defined
      return true;
    }

    return pattern.test(number);
  }

  getFullNumber(): string {
    return `${this.countryCode}${this.number}`;
  }

  getFormattedNumber(): string {
    // Format tax number for display
    return this.getFullNumber();
  }

  equals(other: TaxNumber): boolean {
    return (
      this.countryCode === other.countryCode &&
      this.number === other.number
    );
  }

  toString(): string {
    return this.getFormattedNumber();
  }

  toJSON() {
    return {
      countryCode: this.countryCode,
      number: this.number,
      fullNumber: this.getFullNumber()
    };
  }

  static fromFullNumber(fullNumber: string): TaxNumber {
    if (fullNumber.length < 3) {
      throw new Error('Invalid tax number: too short');
    }
    
    // Try to parse country code (first 2 chars)
    const countryCode = fullNumber.substring(0, 2).toUpperCase();
    const number = fullNumber.substring(2);
    
    return new TaxNumber(countryCode, number);
  }
}