/**
 * UnitCode Value Object
 * Represents unit of measure codes according to UN/ECE Rec 20
 */
export class UnitCode {
  // Common unit codes from UN/ECE Rec 20
  static readonly UNIT = new UnitCode('C62', 'Unit', 'One');
  static readonly PIECE = new UnitCode('H87', 'Piece', 'Piece');
  static readonly KILOGRAM = new UnitCode('KGM', 'Kilogram', 'kg');
  static readonly GRAM = new UnitCode('GRM', 'Gram', 'g');
  static readonly LITRE = new UnitCode('LTR', 'Litre', 'l');
  static readonly MILLILITRE = new UnitCode('MLT', 'Millilitre', 'ml');
  static readonly METRE = new UnitCode('MTR', 'Metre', 'm');
  static readonly SQUARE_METRE = new UnitCode('MTK', 'Square metre', 'm²');
  static readonly CUBIC_METRE = new UnitCode('MTQ', 'Cubic metre', 'm³');
  static readonly HOUR = new UnitCode('HUR', 'Hour', 'h');
  static readonly DAY = new UnitCode('DAY', 'Day', 'd');
  static readonly WEEK = new UnitCode('WEE', 'Week', 'week');
  static readonly MONTH = new UnitCode('MON', 'Month', 'month');
  static readonly YEAR = new UnitCode('ANN', 'Year', 'year');
  static readonly KILOWATT_HOUR = new UnitCode('KWH', 'Kilowatt hour', 'kWh');
  static readonly KILOMETRE = new UnitCode('KMT', 'Kilometre', 'km');
  static readonly TON = new UnitCode('TNE', 'Metric ton', 't');
  static readonly PACKAGE = new UnitCode('PK', 'Package', 'pkg');
  static readonly BOX = new UnitCode('BX', 'Box', 'box');
  static readonly PALLET = new UnitCode('PF', 'Pallet', 'pallet');
  static readonly CONTAINER = new UnitCode('CO', 'Container', 'container');
  static readonly SET = new UnitCode('SET', 'Set', 'set');
  static readonly PAIR = new UnitCode('PR', 'Pair', 'pair');

  private static readonly VALID_CODES = new Map<string, UnitCode>([
    ['C62', UnitCode.UNIT],
    ['H87', UnitCode.PIECE],
    ['KGM', UnitCode.KILOGRAM],
    ['GRM', UnitCode.GRAM],
    ['LTR', UnitCode.LITRE],
    ['MLT', UnitCode.MILLILITRE],
    ['MTR', UnitCode.METRE],
    ['MTK', UnitCode.SQUARE_METRE],
    ['MTQ', UnitCode.CUBIC_METRE],
    ['HUR', UnitCode.HOUR],
    ['DAY', UnitCode.DAY],
    ['WEE', UnitCode.WEEK],
    ['MON', UnitCode.MONTH],
    ['ANN', UnitCode.YEAR],
    ['KWH', UnitCode.KILOWATT_HOUR],
    ['KMT', UnitCode.KILOMETRE],
    ['TNE', UnitCode.TON],
    ['PK', UnitCode.PACKAGE],
    ['BX', UnitCode.BOX],
    ['PF', UnitCode.PALLET],
    ['CO', UnitCode.CONTAINER],
    ['SET', UnitCode.SET],
    ['PR', UnitCode.PAIR]
  ]);

  constructor(
    public readonly code: string, // UN/ECE Rec 20 code
    public readonly name: string,
    public readonly symbol?: string
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.code || this.code.trim().length === 0) {
      throw new Error('Unit code is required');
    }

    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Unit name is required');
    }

    // UN/ECE Rec 20 codes are typically 2-3 uppercase alphanumeric characters
    if (!/^[A-Z0-9]{2,3}$/.test(this.code)) {
      console.warn(`Non-standard unit code format: ${this.code}`);
    }
  }

  equals(other: UnitCode): boolean {
    return this.code === other.code;
  }

  toString(): string {
    return this.symbol || this.code;
  }

  getDisplayName(): string {
    return `${this.name} (${this.code})`;
  }

  static fromCode(code: string): UnitCode {
    const unit = UnitCode.VALID_CODES.get(code);
    if (unit) {
      return unit;
    }
    
    // For unknown codes, create a basic unit code
    console.warn(`Unknown UN/ECE Rec 20 code: ${code}. Creating custom unit.`);
    return new UnitCode(code, code);
  }

  static isValidCode(code: string): boolean {
    return UnitCode.VALID_CODES.has(code) || /^[A-Z0-9]{2,3}$/.test(code);
  }

  toJSON() {
    return {
      code: this.code,
      name: this.name,
      symbol: this.symbol
    };
  }
}