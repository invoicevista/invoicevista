/**
 * TaxScheme entity representing a country-specific tax system with rates, rules, and exemption criteria.
 * Defines the tax structure for a jurisdiction including standard rates, reduced rates, and reverse charge rules.
 * Used to calculate taxes, validate exemptions, and ensure compliance with local tax regulations.
 */

import { TaxSchemeId, CountryCode } from '../types';
import { Percentage } from '@/app/features/core/domain/value-objects/Percentage';
import { TaxRate } from './TaxRate';
import { TaxExemptionReason } from '@/app/features/core/domain/value-objects/TaxExemptionReason';
import { Money } from '@/app/features/core/domain/value-objects/Money';
import { TaxCategory } from '@/app/features/core/domain/value-objects/TaxCategory';

export interface ReverseChargeRule {
    description: string;
    applicableCategories: string[];
    conditions: string[];
}

export class TaxScheme {
    id!: TaxSchemeId;
    country!: CountryCode;
    name!: string;

    // Rates
    standardRate!: Percentage;
    reducedRates!: TaxRate[];

    // Rules
    exemptionReasons!: TaxExemptionReason[];
    reverseChargeRules!: ReverseChargeRule[];

    // Methods
    calculateTax(amount: Money, category: TaxCategory): Money {
        // Implementation will be added
        return {} as Money;
    }

    validateExemption(reason: TaxExemptionReason): boolean {
        // Implementation will be added
        return false;
    }
}