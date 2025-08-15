import { TaxNumber } from './TaxNumber';
import { Address } from './Address';
import { ElectronicAddress } from './ElectronicAddress';
import { NetworkIdentifier } from './NetworkIdentifier';

/**
 * PartySnapshot Value Object
 * Immutable snapshot of party data at the time of invoice creation
 */
export class PartySnapshot {
  constructor(
    // Identification
    public readonly legalName: string,
    public readonly tradingName?: string,
    public readonly companyId?: string,
    public readonly companyIdScheme?: string,
    
    // Tax Information
    public readonly taxNumber?: TaxNumber,
    public readonly taxRegistrationId?: string,
    public readonly additionalTaxScheme?: string,
    
    // Electronic Addressing
    public readonly electronicAddress?: ElectronicAddress,
    public readonly networkId?: NetworkIdentifier,
    
    // Location
    public readonly address?: Address,
    public readonly additionalAddress?: Address, // Delivery address
    
    // Contact
    public readonly contactName?: string,
    public readonly contactTelephone?: string,
    public readonly contactEmail?: string,
    
    // Banking (for payee)
    public readonly bankAccountName?: string,
    public readonly bankAccountNumber?: string,
    public readonly bankBIC?: string,
    
    // Additional legal information
    public readonly registrationName?: string,
    public readonly additionalLegalInfo?: string
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.legalName || this.legalName.trim().length === 0) {
      throw new Error('Legal name is required for party snapshot');
    }

    if (this.contactEmail && !this.isValidEmail(this.contactEmail)) {
      throw new Error(`Invalid contact email: ${this.contactEmail}`);
    }

    if (this.bankAccountNumber && !this.bankBIC) {
      console.warn('Bank account number provided without BIC/SWIFT code');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isSeller(): boolean {
    // Sellers typically have tax numbers
    return this.taxNumber !== undefined;
  }

  isBuyer(): boolean {
    // Buyers may or may not have VAT numbers
    return true;
  }

  isPayee(): boolean {
    // Payees have bank account information
    return this.bankAccountNumber !== undefined;
  }

  getDisplayName(): string {
    return this.tradingName || this.legalName;
  }

  equals(other: PartySnapshot): boolean {
    return (
      this.legalName === other.legalName &&
      this.tradingName === other.tradingName &&
      this.companyId === other.companyId &&
      this.taxNumber?.equals(other.taxNumber!) === (other.taxNumber?.equals(this.taxNumber!) ?? true) &&
      this.electronicAddress?.equals(other.electronicAddress!) === (other.electronicAddress?.equals(this.electronicAddress!) ?? true) &&
      this.address?.equals(other.address!) === (other.address?.equals(this.address!) ?? true)
    );
  }

  toString(): string {
    const parts = [this.getDisplayName()];
    
    if (this.taxNumber) {
      parts.push(this.taxNumber.toString());
    }
    if (this.address) {
      parts.push(this.address.toString());
    }
    
    return parts.join(', ');
  }

  toJSON() {
    return {
      legalName: this.legalName,
      tradingName: this.tradingName,
      companyId: this.companyId,
      companyIdScheme: this.companyIdScheme,
      taxNumber: this.taxNumber?.toJSON(),
      taxRegistrationId: this.taxRegistrationId,
      additionalTaxScheme: this.additionalTaxScheme,
      electronicAddress: this.electronicAddress?.toJSON(),
      networkId: this.networkId?.toJSON(),
      address: this.address?.toJSON(),
      additionalAddress: this.additionalAddress?.toJSON(),
      contactName: this.contactName,
      contactTelephone: this.contactTelephone,
      contactEmail: this.contactEmail,
      bankAccountName: this.bankAccountName,
      bankAccountNumber: this.bankAccountNumber,
      bankBIC: this.bankBIC,
      registrationName: this.registrationName,
      additionalLegalInfo: this.additionalLegalInfo
    };
  }
}