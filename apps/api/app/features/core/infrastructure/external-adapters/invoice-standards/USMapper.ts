import { StandardMapper } from '../../../domain/services/StandardMapper';
import { InvoiceType } from '../../../domain/types';

/**
 * USMapper implements the StandardMapper interface to convert abstract domain types to US and North American invoice standards and formats.
 * This mapper handles American invoicing conventions including ANSI X12 EDI standards, US tax categorization, and state-specific tax codes.
 * It provides mapping for US-specific invoice types, tax categories, addressing schemes, and output formats while accommodating regional variations across North America.
 */
export class USMapper implements StandardMapper {
  private readonly invoiceTypeMap: Record<string, string> = {
    [InvoiceType.STANDARD]: 'INV',        // Invoice
    [InvoiceType.CREDIT_NOTE]: 'CM',      // Credit Memo
    [InvoiceType.DEBIT_NOTE]: 'DM',       // Debit Memo
    [InvoiceType.CORRECTED]: 'COR',       // Corrected Invoice
    [InvoiceType.PREPAYMENT]: 'PRE',      // Prepayment Invoice
    [InvoiceType.SELF_BILLED]: 'SBI',     // Self-Billed Invoice
    [InvoiceType.PROFORMA]: 'PRO',        // Proforma Invoice
    [InvoiceType.RECURRING]: 'REC'        // Recurring Invoice
  };

  private readonly taxCategoryMap: Record<string, string> = {
    'STANDARD': 'TAX',        // Taxable
    'REDUCED': 'RED',         // Reduced rate
    'ZERO': 'ZER',           // Zero tax
    'EXEMPT': 'EXE',         // Exempt
    'REVERSE_CHARGE': 'N/A',  // Not applicable in US
    'EXPORT': 'EXP',         // Export
    'NOT_APPLICABLE': 'NON',  // Non-taxable
    'SPECIAL': 'SPE'         // Special tax treatment
  };

  private readonly addressSchemeMap: Record<string, string> = {
    'EMAIL': 'EMAIL',
    'URL': 'WEB',
    'NETWORK_ID': 'EDI',
    'TAX_ID': 'EIN',         // Employer Identification Number
    'COMPANY_ID': 'DUNS',    // Dun & Bradstreet
    'GLOBAL_ID': 'GLN',
    'NATIONAL_ID': 'SSN',    // Social Security Number
    'CUSTOM': 'OTHER'
  };

  private readonly outputFormatMap: Record<string, string> = {
    'XML': 'XML',
    'JSON': 'JSON',
    'PDF': 'PDF',
    'HYBRID_PDF': 'PDF',
    'CSV': 'CSV',
    'EDI': 'X12',           // ANSI X12 EDI
    'CUSTOM': 'CUSTOM'
  };

  mapInvoiceType(domainType: string): string {
    return this.invoiceTypeMap[domainType] || 'INV';
  }

  mapTaxCategory(domainCategory: string): string {
    return this.taxCategoryMap[domainCategory] || 'TAX';
  }

  mapAddressScheme(domainScheme: string): string {
    return this.addressSchemeMap[domainScheme] || 'OTHER';
  }

  mapOutputFormat(domainFormat: string): string {
    return this.outputFormatMap[domainFormat] || 'XML';
  }

  reverseMapInvoiceType(standardType: string): string {
    const entry = Object.entries(this.invoiceTypeMap).find(([_, value]) => value === standardType);
    return entry ? entry[0] : InvoiceType.STANDARD;
  }

  reverseMapTaxCategory(standardCategory: string): string {
    const entry = Object.entries(this.taxCategoryMap).find(([_, value]) => value === standardCategory);
    return entry ? entry[0] : 'STANDARD';
  }

  // US specific mappings
  mapStateTaxCode(state: string): string {
    // Map state codes to tax jurisdictions
    const stateTaxCodes: Record<string, string> = {
      'CA': 'CA-TAX',
      'NY': 'NY-TAX',
      'TX': 'TX-NOTAX',  // No state income tax
      // ... more states
    };
    return stateTaxCodes[state] || 'OTHER';
  }

  getRequiredFields(): string[] {
    return [
      'invoiceNumber', 
      'invoiceDate', 
      'vendorName',
      'vendorTaxId',
      'customerName',
      'lineItems',
      'subtotal',
      'taxAmount',
      'totalAmount'
    ];
  }
}