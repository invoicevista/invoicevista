/**
 * PartyIdentifier Entity
 * Represents various identification schemes for parties
 */
export class PartyIdentifier {
  static readonly SCHEME_VAT = 'VAT'; // VAT registration number
  static readonly SCHEME_TAX = 'TAX'; // Tax registration number
  static readonly SCHEME_GLN = 'GLN'; // Global Location Number (0088)
  static readonly SCHEME_DUNS = 'DUNS'; // Dun & Bradstreet number (0060)
  static readonly SCHEME_LEI = 'LEI'; // Legal Entity Identifier (0199)
  static readonly SCHEME_SIRET = 'SIRET'; // French company registration (0002)
  static readonly SCHEME_SIREN = 'SIREN'; // French company number (0009)
  static readonly SCHEME_CIF = 'CIF'; // Spanish tax identification
  static readonly SCHEME_CODICE_FISCALE = 'CF'; // Italian fiscal code
  static readonly SCHEME_PARTITA_IVA = 'PIVA'; // Italian VAT number
  static readonly SCHEME_CHAMBER_OF_COMMERCE = 'COC'; // Chamber of Commerce number
  static readonly SCHEME_NATIONAL = 'NATIONAL'; // National identification number

  private static readonly VALID_SCHEMES = new Set([
    PartyIdentifier.SCHEME_VAT,
    PartyIdentifier.SCHEME_TAX,
    PartyIdentifier.SCHEME_GLN,
    PartyIdentifier.SCHEME_DUNS,
    PartyIdentifier.SCHEME_LEI,
    PartyIdentifier.SCHEME_SIRET,
    PartyIdentifier.SCHEME_SIREN,
    PartyIdentifier.SCHEME_CIF,
    PartyIdentifier.SCHEME_CODICE_FISCALE,
    PartyIdentifier.SCHEME_PARTITA_IVA,
    PartyIdentifier.SCHEME_CHAMBER_OF_COMMERCE,
    PartyIdentifier.SCHEME_NATIONAL
  ]);

  constructor(
    public readonly id: string,
    public readonly scheme: string,
    public readonly identifier: string,
    public readonly schemeAgencyId?: string, // Agency that manages the scheme
    public readonly country?: string, // ISO 3166-1 alpha-2 country code
    public readonly isPrimary: boolean = false
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.scheme || this.scheme.trim().length === 0) {
      throw new Error('Identifier scheme is required');
    }

    if (!this.identifier || this.identifier.trim().length === 0) {
      throw new Error('Identifier value is required');
    }

    // Validate based on scheme
    switch (this.scheme) {
      case PartyIdentifier.SCHEME_VAT:
        this.validateVAT();
        break;
      case PartyIdentifier.SCHEME_GLN:
        this.validateGLN();
        break;
      case PartyIdentifier.SCHEME_DUNS:
        this.validateDUNS();
        break;
      case PartyIdentifier.SCHEME_LEI:
        this.validateLEI();
        break;
      case PartyIdentifier.SCHEME_SIRET:
        this.validateSIRET();
        break;
      case PartyIdentifier.SCHEME_SIREN:
        this.validateSIREN();
        break;
      // Add more specific validations as needed
    }

    if (this.country && !this.isValidCountryCode(this.country)) {
      throw new Error(`Invalid country code: ${this.country}`);
    }
  }

  private validateVAT(): void {
    // Basic VAT format validation
    // Most EU VAT numbers start with 2-letter country code
    if (!/^[A-Z]{2}[A-Z0-9]+$/.test(this.identifier)) {
      throw new Error(`Invalid VAT number format: ${this.identifier}`);
    }
  }

  private validateGLN(): void {
    // GLN is 13 digits
    if (!/^\d{13}$/.test(this.identifier)) {
      throw new Error(`Invalid GLN format: ${this.identifier}. Must be 13 digits`);
    }
  }

  private validateDUNS(): void {
    // DUNS is 9 digits
    if (!/^\d{9}$/.test(this.identifier)) {
      throw new Error(`Invalid DUNS number format: ${this.identifier}. Must be 9 digits`);
    }
  }

  private validateLEI(): void {
    // LEI is 20 alphanumeric characters
    if (!/^[A-Z0-9]{20}$/.test(this.identifier)) {
      throw new Error(`Invalid LEI format: ${this.identifier}. Must be 20 alphanumeric characters`);
    }
  }

  private validateSIRET(): void {
    // SIRET is 14 digits
    if (!/^\d{14}$/.test(this.identifier)) {
      throw new Error(`Invalid SIRET format: ${this.identifier}. Must be 14 digits`);
    }
  }

  private validateSIREN(): void {
    // SIREN is 9 digits
    if (!/^\d{9}$/.test(this.identifier)) {
      throw new Error(`Invalid SIREN format: ${this.identifier}. Must be 9 digits`);
    }
  }

  private isValidCountryCode(code: string): boolean {
    return /^[A-Z]{2}$/.test(code);
  }

  getFormattedIdentifier(): string {
    // Format identifier based on scheme
    switch (this.scheme) {
      case PartyIdentifier.SCHEME_VAT:
        // Add spaces for readability (e.g., "DE 123 456 789")
        if (this.identifier.length > 2) {
          const country = this.identifier.substring(0, 2);
          const number = this.identifier.substring(2);
          return `${country} ${number.replace(/(.{3})/g, '$1 ').trim()}`;
        }
        break;
      case PartyIdentifier.SCHEME_SIRET:
        // Format as "123 456 789 00012"
        return this.identifier.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
      case PartyIdentifier.SCHEME_SIREN:
        // Format as "123 456 789"
        return this.identifier.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    return this.identifier;
  }

  equals(other: PartyIdentifier): boolean {
    return (
      this.id === other.id &&
      this.scheme === other.scheme &&
      this.identifier === other.identifier &&
      this.schemeAgencyId === other.schemeAgencyId &&
      this.country === other.country &&
      this.isPrimary === other.isPrimary
    );
  }

  toString(): string {
    return `${this.scheme}: ${this.getFormattedIdentifier()}`;
  }

  toJSON() {
    return {
      id: this.id,
      scheme: this.scheme,
      identifier: this.identifier,
      schemeAgencyId: this.schemeAgencyId,
      country: this.country,
      isPrimary: this.isPrimary
    };
  }

  static isValidScheme(scheme: string): boolean {
    return PartyIdentifier.VALID_SCHEMES.has(scheme);
  }
}