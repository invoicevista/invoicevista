/**
 * TaxCategory Value Object
 * Abstract representation of tax categories
 */
export class TaxCategory {
  static readonly STANDARD = new TaxCategory('STANDARD', 'Standard tax rate', true, false);
  static readonly REDUCED = new TaxCategory('REDUCED', 'Reduced tax rate', true, false);
  static readonly ZERO = new TaxCategory('ZERO', 'Zero tax rate', false, false);
  static readonly EXEMPT = new TaxCategory('EXEMPT', 'Tax exempt', false, true);
  static readonly REVERSE_CHARGE = new TaxCategory('REVERSE_CHARGE', 'Tax liability on buyer', false, true);
  static readonly EXPORT = new TaxCategory('EXPORT', 'Export (no tax)', false, true);
  static readonly NOT_APPLICABLE = new TaxCategory('NOT_APPLICABLE', 'Tax not applicable', false, true);
  static readonly SPECIAL = new TaxCategory('SPECIAL', 'Special tax treatment', true, false);

  constructor(
    public readonly code: string,
    public readonly description: string,
    public readonly requiresRate: boolean = true,
    public readonly requiresExemption: boolean = false
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.code || this.code.trim().length === 0) {
      throw new Error('Tax category code is required');
    }
    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Tax category description is required');
    }
  }

  requiresExemptionReason(): boolean {
    return this.requiresExemption;
  }

  requiresTaxRate(): boolean {
    return this.requiresRate;
  }

  equals(other: TaxCategory): boolean {
    return this.code === other.code;
  }

  toString(): string {
    return `${this.code} - ${this.description}`;
  }

  static fromCode(code: string): TaxCategory {
    const categories = [
      TaxCategory.STANDARD,
      TaxCategory.REDUCED,
      TaxCategory.ZERO,
      TaxCategory.EXEMPT,
      TaxCategory.REVERSE_CHARGE,
      TaxCategory.EXPORT,
      TaxCategory.NOT_APPLICABLE,
      TaxCategory.SPECIAL
    ];

    const category = categories.find(c => c.code === code);
    if (!category) {
      // Allow custom categories
      return new TaxCategory(code, code);
    }
    return category;
  }
}