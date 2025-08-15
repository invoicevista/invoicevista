/**
 * BankAccount Entity
 * Represents bank account details for payment
 */
export class BankAccount {
  constructor(
    public readonly id: string,
    public readonly accountName: string,
    public readonly accountNumber?: string,
    public readonly iban?: string, // International Bank Account Number
    public readonly bic?: string,
    public readonly bankName?: string,
    public readonly bankBranch?: string,
    public readonly sortCode?: string, // UK specific
    public readonly routingNumber?: string, // US specific
    public readonly isDefault: boolean = false
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.accountName || this.accountName.trim().length === 0) {
      throw new Error('Account name is required');
    }

    // At least one account identifier is required
    if (!this.iban && !this.accountNumber) {
      throw new Error('Either IBAN or account number is required');
    }

    if (this.iban && !this.isValidIBAN(this.iban)) {
      throw new Error(`Invalid IBAN: ${this.iban}`);
    }

    if (this.bic && !this.isValidBIC(this.bic)) {
      throw new Error(`Invalid BIC/SWIFT code: ${this.bic}`);
    }
  }

  private isValidIBAN(iban: string): boolean {
    // Remove spaces and convert to uppercase
    const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();
    
    // Basic IBAN format: 2 letters + 2 digits + up to 30 alphanumeric chars
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(cleanIBAN)) {
      return false;
    }

    // More sophisticated IBAN validation would include mod-97 check
    // For now, just validate the format
    return true;
  }

  private isValidBIC(bic: string): boolean {
    // BIC format: 8 or 11 characters
    // 4 letters (bank code) + 2 letters (country) + 2 letters/digits (location) + optional 3 letters/digits (branch)
    const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    return bicRegex.test(bic.toUpperCase());
  }

  getMaskedAccountNumber(): string {
    if (this.iban) {
      // Show first 4 and last 4 characters
      if (this.iban.length > 8) {
        const clean = this.iban.replace(/\s/g, '');
        return `${clean.substring(0, 4)}****${clean.substring(clean.length - 4)}`;
      }
      return '****';
    }
    
    if (this.accountNumber) {
      // Show last 4 digits
      if (this.accountNumber.length > 4) {
        return `****${this.accountNumber.substring(this.accountNumber.length - 4)}`;
      }
      return '****';
    }

    return '****';
  }

  equals(other: BankAccount): boolean {
    return (
      this.id === other.id &&
      this.accountName === other.accountName &&
      this.accountNumber === other.accountNumber &&
      this.iban === other.iban &&
      this.bic === other.bic &&
      this.bankName === other.bankName &&
      this.bankBranch === other.bankBranch &&
      this.sortCode === other.sortCode &&
      this.routingNumber === other.routingNumber &&
      this.isDefault === other.isDefault
    );
  }

  toString(): string {
    const parts = [this.accountName];
    if (this.iban) {
      parts.push(`IBAN: ${this.getMaskedAccountNumber()}`);
    } else if (this.accountNumber) {
      parts.push(`Account: ${this.getMaskedAccountNumber()}`);
    }
    if (this.bankName) {
      parts.push(this.bankName);
    }
    return parts.join(' - ');
  }

  toJSON() {
    return {
      id: this.id,
      accountName: this.accountName,
      accountNumber: this.accountNumber,
      iban: this.iban,
      bic: this.bic,
      bankName: this.bankName,
      bankBranch: this.bankBranch,
      sortCode: this.sortCode,
      routingNumber: this.routingNumber,
      isDefault: this.isDefault
    };
  }
}