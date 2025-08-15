/**
 * Address Value Object
 * Represents an immutable postal or legal address
 */
export class Address {
  constructor(
    public readonly streetName: string,
    public readonly additionalStreetName?: string,
    public readonly cityName?: string,
    public readonly postalCode?: string,
    public readonly countrySubdivision?: string, // State/Province/Region
    public readonly countryCode?: string, // Country identifier
    public readonly addressLine?: string // Alternative single line format
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.streetName && !this.addressLine) {
      throw new Error('Address must have either streetName or addressLine');
    }
    
    if (this.countryCode && !this.isValidCountryCode(this.countryCode)) {
      throw new Error(`Invalid ISO 3166-1 alpha-2 country code: ${this.countryCode}`);
    }
  }

  private isValidCountryCode(code: string): boolean {
    return /^[A-Z]{2}$/.test(code);
  }

  equals(other: Address): boolean {
    return (
      this.streetName === other.streetName &&
      this.additionalStreetName === other.additionalStreetName &&
      this.cityName === other.cityName &&
      this.postalCode === other.postalCode &&
      this.countrySubdivision === other.countrySubdivision &&
      this.countryCode === other.countryCode &&
      this.addressLine === other.addressLine
    );
  }

  toString(): string {
    const parts = [
      this.streetName,
      this.additionalStreetName,
      this.cityName,
      this.postalCode,
      this.countrySubdivision,
      this.countryCode
    ].filter(Boolean);
    
    return this.addressLine || parts.join(', ');
  }

  toJSON() {
    return {
      streetName: this.streetName,
      additionalStreetName: this.additionalStreetName,
      cityName: this.cityName,
      postalCode: this.postalCode,
      countrySubdivision: this.countrySubdivision,
      countryCode: this.countryCode,
      addressLine: this.addressLine
    };
  }
}