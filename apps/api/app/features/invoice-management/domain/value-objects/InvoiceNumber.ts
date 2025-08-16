/**
 * InvoiceNumber Value Object
 * Represents a unique invoice number
 */
export class InvoiceNumber {
  constructor(
    public readonly value: string,
    public readonly prefix?: string, // e.g., "INV", "2024"
    public readonly sequence?: number, // Sequential number
    public readonly suffix?: string // e.g., department code
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('Invoice number is required');
    }

    // BR-02: An Invoice shall have an Invoice number
    if (this.value.length > 100) {
      throw new Error('Invoice number cannot exceed 100 characters');
    }

    // Check for invalid characters (basic sanitization)
    if (!/^[A-Za-z0-9\-\/_]+$/.test(this.value)) {
      throw new Error('Invoice number contains invalid characters');
    }

    if (this.sequence !== undefined && this.sequence < 0) {
      throw new Error('Invoice sequence number cannot be negative');
    }
  }

  getFullNumber(): string {
    if (this.prefix || this.suffix) {
      const parts = [];
      if (this.prefix) parts.push(this.prefix);
      if (this.sequence !== undefined) {
        parts.push(this.sequence.toString().padStart(6, '0'));
      } else {
        parts.push(this.value);
      }
      if (this.suffix) parts.push(this.suffix);
      return parts.join('-');
    }
    return this.value;
  }

  equals(other: InvoiceNumber): boolean {
    return (
      this.value === other.value &&
      this.prefix === other.prefix &&
      this.sequence === other.sequence &&
      this.suffix === other.suffix
    );
  }

  toString(): string {
    return this.getFullNumber();
  }

  toJSON() {
    return {
      value: this.value,
      prefix: this.prefix,
      sequence: this.sequence,
      suffix: this.suffix,
      fullNumber: this.getFullNumber()
    };
  }

  static fromFullNumber(fullNumber: string): InvoiceNumber {
    return new InvoiceNumber(fullNumber);
  }

  static generate(prefix: string, sequence: number, suffix?: string): InvoiceNumber {
    const value = `${prefix}-${sequence.toString().padStart(6, '0')}${suffix ? `-${suffix}` : ''}`;
    return new InvoiceNumber(value, prefix, sequence, suffix);
  }
}