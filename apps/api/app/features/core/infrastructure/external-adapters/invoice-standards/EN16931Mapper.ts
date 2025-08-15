import { StandardMapper } from '../../../domain/services/StandardMapper';
import { InvoiceType } from '../../../domain/types';

/**
 * EN16931Mapper implements the StandardMapper interface to convert abstract domain types to EN16931/EU specific codes and formats.
 * This mapper handles European invoice standards including PEPPOL and various CIUS (Core Invoice Usage Specifications) implementations.
 * It provides bidirectional mapping for invoice types, tax categories, address schemes, and output formats while maintaining compliance with European e-invoicing regulations.
 */
export class EN16931Mapper implements StandardMapper {
  private readonly invoiceTypeMap: Record<string, string> = {
    [InvoiceType.STANDARD]: '380',        // Commercial invoice
    [InvoiceType.CREDIT_NOTE]: '381',     // Credit note
    [InvoiceType.DEBIT_NOTE]: '383',      // Debit note
    [InvoiceType.CORRECTED]: '384',       // Corrected invoice
    [InvoiceType.PREPAYMENT]: '386',      // Prepayment invoice
    [InvoiceType.SELF_BILLED]: '389',     // Self-billed invoice
    [InvoiceType.PROFORMA]: '325',        // Proforma invoice
    [InvoiceType.RECURRING]: '380'        // Treat as standard invoice
  };

  private readonly taxCategoryMap: Record<string, string> = {
    'STANDARD': 'S',         // Standard rate
    'REDUCED': 'S',          // Also standard (different rate)
    'ZERO': 'Z',            // Zero rated
    'EXEMPT': 'E',          // Exempt from tax
    'REVERSE_CHARGE': 'AE',  // VAT Reverse Charge
    'EXPORT': 'G',          // Export outside EU
    'NOT_APPLICABLE': 'O',   // Outside scope
    'SPECIAL': 'S'          // Map to standard
  };

  private readonly addressSchemeMap: Record<string, string> = {
    'EMAIL': '0201',         // Email address
    'URL': '0202',          // URL
    'NETWORK_ID': '0088',   // Default to GLN
    'TAX_ID': '9902',       // National VAT number
    'COMPANY_ID': '0002',   // National company ID
    'GLOBAL_ID': '0088',    // GLN
    'NATIONAL_ID': '9999',  // National scheme
    'CUSTOM': '9999'        // Custom scheme
  };

  private readonly outputFormatMap: Record<string, string> = {
    'XML': 'UBL',
    'JSON': 'JSON',
    'PDF': 'PDF',
    'HYBRID_PDF': 'PDF/A-3',
    'CSV': 'CSV',
    'EDI': 'EDIFACT',
    'CUSTOM': 'CUSTOM'
  };

  mapInvoiceType(domainType: string): string {
    return this.invoiceTypeMap[domainType] || '380';
  }

  mapTaxCategory(domainCategory: string): string {
    return this.taxCategoryMap[domainCategory] || 'S';
  }

  mapAddressScheme(domainScheme: string): string {
    return this.addressSchemeMap[domainScheme] || '9999';
  }

  mapOutputFormat(domainFormat: string): string {
    return this.outputFormatMap[domainFormat] || 'UBL';
  }

  reverseMapInvoiceType(standardType: string): string {
    const entry = Object.entries(this.invoiceTypeMap).find(([_, value]) => value === standardType);
    return entry ? entry[0] : InvoiceType.STANDARD;
  }

  reverseMapTaxCategory(standardCategory: string): string {
    const entry = Object.entries(this.taxCategoryMap).find(([_, value]) => value === standardCategory);
    return entry ? entry[0] : 'STANDARD';
  }

  // Additional EN16931 specific mappings
  mapBusinessTerm(fieldName: string): string {
    const businessTerms: Record<string, string> = {
      'invoiceNumber': 'BT-1',
      'issueDate': 'BT-2',
      'invoiceType': 'BT-3',
      'currency': 'BT-5',
      'sellerName': 'BT-27',
      'buyerName': 'BT-44',
      // ... more mappings
    };
    return businessTerms[fieldName] || '';
  }

  getRequiredFields(profile: string): string[] {
    // Return required fields for specific CIUS
    const baseRequired = [
      'invoiceNumber', 'issueDate', 'invoiceType',
      'seller', 'buyer', 'lineItems', 'totals'
    ];

    if (profile === 'CIUS_IT') {
      return [...baseRequired, 'codiceFiscale', 'codiceDestinatario'];
    }

    return baseRequired;
  }
}