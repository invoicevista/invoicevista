/**
 * StandardMapper Interface
 * Maps between abstract domain types and specific invoice standards such as EN16931, CIUS implementations, and regional variations.
 * Provides bidirectional mapping capabilities to translate between domain concepts and standard-specific representations for interoperability.
 */
export interface StandardMapper {
  mapInvoiceType(domainType: string): string;
  mapTaxCategory(domainCategory: string): string;
  mapAddressScheme(domainScheme: string): string;
  mapOutputFormat(domainFormat: string): string;
  reverseMapInvoiceType(standardType: string): string;
  reverseMapTaxCategory(standardCategory: string): string;
}