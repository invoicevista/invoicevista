/**
 * Currency Value Object
 * Represents ISO 4217 currency codes
 */
export class Currency {
  static readonly EUR = new Currency('EUR', 'Euro', 2);
  static readonly USD = new Currency('USD', 'US Dollar', 2);
  static readonly GBP = new Currency('GBP', 'British Pound', 2);
  static readonly CHF = new Currency('CHF', 'Swiss Franc', 2);
  static readonly SEK = new Currency('SEK', 'Swedish Krona', 2);
  static readonly NOK = new Currency('NOK', 'Norwegian Krone', 2);
  static readonly DKK = new Currency('DKK', 'Danish Krone', 2);
  static readonly PLN = new Currency('PLN', 'Polish Zloty', 2);
  static readonly CZK = new Currency('CZK', 'Czech Koruna', 2);
  static readonly HUF = new Currency('HUF', 'Hungarian Forint', 2);
  static readonly RON = new Currency('RON', 'Romanian Leu', 2);
  static readonly BGN = new Currency('BGN', 'Bulgarian Lev', 2);
  static readonly HRK = new Currency('HRK', 'Croatian Kuna', 2);

  private static readonly VALID_CODES = new Map<string, Currency>([
    ['EUR', Currency.EUR],
    ['USD', Currency.USD],
    ['GBP', Currency.GBP],
    ['CHF', Currency.CHF],
    ['SEK', Currency.SEK],
    ['NOK', Currency.NOK],
    ['DKK', Currency.DKK],
    ['PLN', Currency.PLN],
    ['CZK', Currency.CZK],
    ['HUF', Currency.HUF],
    ['RON', Currency.RON],
    ['BGN', Currency.BGN],
    ['HRK', Currency.HRK]
  ]);

  constructor(
    public readonly code: string, // ISO 4217 code
    public readonly name: string,
    public readonly decimalPlaces: number
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!/^[A-Z]{3}$/.test(this.code)) {
      throw new Error(`Invalid currency code format: ${this.code}. Must be 3 uppercase letters`);
    }

    if (this.decimalPlaces < 0 || this.decimalPlaces > 4) {
      throw new Error(`Invalid decimal places: ${this.decimalPlaces}. Must be between 0 and 4`);
    }
  }

  equals(other: Currency): boolean {
    return this.code === other.code;
  }

  toString(): string {
    return this.code;
  }

  static fromCode(code: string): Currency {
    const currency = Currency.VALID_CODES.get(code);
    if (!currency) {
      // For unknown currencies, create with default 2 decimal places
      return new Currency(code, code, 2);
    }
    return currency;
  }

  static isValidCode(code: string): boolean {
    return /^[A-Z]{3}$/.test(code);
  }
}