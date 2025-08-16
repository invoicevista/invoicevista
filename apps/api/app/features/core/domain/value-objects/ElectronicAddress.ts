import { AddressScheme } from '../../../invoice-management/domain/value-objects';

/**
 * ElectronicAddress Value Object
 * Represents electronic addressing for digital communication
 */
export class ElectronicAddress {
  constructor(
    public readonly scheme: string, // Address scheme type
    public readonly identifier: string // The actual identifier
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.scheme || this.scheme.trim().length === 0) {
      throw new Error('Electronic address scheme is required');
    }

    if (!this.identifier || this.identifier.trim().length === 0) {
      throw new Error('Electronic address identifier is required');
    }

    // Basic validation based on scheme type
    switch (this.scheme) {
      case AddressScheme.EMAIL:
        this.validateEmail();
        break;
      case AddressScheme.URL:
        this.validateURL();
        break;
      case AddressScheme.GLOBAL_ID:
        this.validateGlobalId();
        break;
      default:
        // Allow custom schemes without specific validation
        break;
    }
  }

  private validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.identifier)) {
      throw new Error(`Invalid email format: ${this.identifier}`);
    }
  }

  private validateURL(): void {
    try {
      new URL(this.identifier);
    } catch {
      throw new Error(`Invalid URL format: ${this.identifier}`);
    }
  }

  private validateGlobalId(): void {
    // Basic validation for global identifiers
    if (!/^[A-Z0-9]{5,30}$/.test(this.identifier)) {
      throw new Error(`Invalid global identifier format: ${this.identifier}`);
    }
  }

  getFullAddress(): string {
    return `${this.scheme}:${this.identifier}`;
  }

  isNetworkAddress(): boolean {
    // Check if this is a network participant address
    return this.scheme === AddressScheme.NETWORK_ID ||
           this.scheme === AddressScheme.GLOBAL_ID;
  }

  equals(other: ElectronicAddress): boolean {
    return (
      this.scheme === other.scheme &&
      this.identifier === other.identifier
    );
  }

  toString(): string {
    return this.getFullAddress();
  }

  toJSON() {
    return {
      scheme: this.scheme,
      identifier: this.identifier,
      fullAddress: this.getFullAddress()
    };
  }

  static fromFullAddress(fullAddress: string): ElectronicAddress {
    const parts = fullAddress.split(':');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error(`Invalid electronic address format: ${fullAddress}. Expected format: scheme:identifier`);
    }
    
    return new ElectronicAddress(parts[0], parts[1]);
  }
}