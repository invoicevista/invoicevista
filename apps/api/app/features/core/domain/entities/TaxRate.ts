import { Percentage } from '@/app/features/core/domain/value-objects/Percentage';
import { TaxCategory } from '@/app/features/core/domain/value-objects/TaxCategory';

/**
 * TaxRate Entity
 * Represents a specific tax rate within a tax scheme
 */
export class TaxRate {
  constructor(
    public readonly id: string,
    public readonly category: TaxCategory,
    public readonly rate: Percentage,
    public readonly name: string,
    public readonly description?: string,
    public readonly effectiveFrom: Date = new Date('2000-01-01'),
    public readonly effectiveTo?: Date,
    public readonly applicableItems?: string[], // Product categories this rate applies to
    public readonly exemptionReason?: string
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Tax rate name is required');
    }

    if (this.effectiveTo && this.effectiveTo <= this.effectiveFrom) {
      throw new Error('Effective to date must be after effective from date');
    }

    // Validate rate matches category requirements
    if (this.category.requiresTaxRate() && this.rate.isZero()) {
      throw new Error(`Tax category ${this.category.code} requires non-zero rate`);
    }

    if (!this.category.requiresTaxRate() && !this.rate.isZero()) {
      throw new Error(`Tax category ${this.category.code} must have zero rate`);
    }

    if (this.category.requiresExemptionReason() && !this.exemptionReason) {
      throw new Error(`Tax category ${this.category.code} requires exemption reason`);
    }
  }

  isEffective(date: Date = new Date()): boolean {
    if (date < this.effectiveFrom) {
      return false;
    }

    if (this.effectiveTo && date > this.effectiveTo) {
      return false;
    }

    return true;
  }

  appliesTo(productCategory?: string): boolean {
    if (!this.applicableItems || this.applicableItems.length === 0) {
      // Applies to all items if no specific categories defined
      return true;
    }

    if (!productCategory) {
      return false;
    }

    return this.applicableItems.includes(productCategory);
  }

  equals(other: TaxRate): boolean {
    return (
      this.id === other.id &&
      this.category.equals(other.category) &&
      this.rate.equals(other.rate) &&
      this.name === other.name &&
      this.effectiveFrom.getTime() === other.effectiveFrom.getTime() &&
      this.effectiveTo?.getTime() === other.effectiveTo?.getTime()
    );
  }

  toString(): string {
    return `${this.name} (${this.category.code}): ${this.rate.toString()}`;
  }

  toJSON() {
    return {
      id: this.id,
      category: this.category.code,
      rate: this.rate.toJSON(),
      name: this.name,
      description: this.description,
      effectiveFrom: this.effectiveFrom.toISOString(),
      effectiveTo: this.effectiveTo?.toISOString(),
      applicableItems: this.applicableItems,
      exemptionReason: this.exemptionReason
    };
  }
}