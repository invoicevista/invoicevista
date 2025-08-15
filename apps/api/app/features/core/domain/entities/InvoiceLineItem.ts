/**
 * InvoiceLineItem entity representing a single line item on an invoice with product, pricing, and tax information.
 * Encapsulates all the details for billing a specific product or service including quantities, rates, and classifications.
 * Supports complex invoicing scenarios with allowances, charges, periods, and multiple tax treatments.
 */

import { LineItemId, ProductCode, Period } from '../types';
import { Quantity } from '@/app/features/core/domain/value-objects/Quantity';
import { UnitCode } from '@/app/features/core/domain/value-objects/UnitCode';
import { Money } from '@/app/features/core/domain/value-objects/Money';
import { TaxCategory } from '@/app/features/core/domain/value-objects/TaxCategory';
import { Percentage } from '@/app/features/core/domain/value-objects/Percentage';
import { TaxExemptionReason } from '@/app/features/core/domain/value-objects/TaxExemptionReason';
import { AllowanceCharge } from '@/app/features/core/domain/value-objects/AllowanceCharge';
import { ItemClassification } from '@/app/features/core/domain/value-objects/ItemClassification';

export class InvoiceLineItem {
  id!: LineItemId;
  lineNumber!: number;

  // Product/Service
  name!: string;
  description?: string;
  productCode?: ProductCode;
  buyerProductCode?: string;

  // Quantity & Pricing
  quantity!: Quantity;
  unitOfMeasure!: UnitCode; // UN/ECE Rec 20
  unitPrice!: Money;
  baseQuantity?: Quantity;

  // Amounts
  netAmount!: Money;
  baseNetAmount!: Money;

  // Tax
  taxCategory!: TaxCategory;
  taxRate!: Percentage;
  taxExemptionReason?: TaxExemptionReason;

  // Discounts/Charges
  allowanceCharge?: AllowanceCharge[];

  // Classifications
  classifications!: ItemClassification[];

  // Period
  billingPeriod?: Period;

  // References
  orderLineReference?: string;
  accountingCost?: string;
}