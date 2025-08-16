/**
 * Defines comprehensive type definitions and enums for the invoice domain, including invoice types, statuses, profiles, and metadata structures.
 * This file serves as the central type registry for all invoice-related entities, supporting various compliance standards like PEPPOL, EN16931, and regional CIUS implementations.
 * Contains branded types for type safety, validation enums, and interfaces for complex invoice metadata and business logic.
 */
export enum InvoiceType {
  STANDARD = 'STANDARD',
  CREDIT_NOTE = 'CREDIT_NOTE',
  DEBIT_NOTE = 'DEBIT_NOTE',
  CORRECTIVE = 'CORRECTIVE',
  CORRECTED = 'CORRECTED',
  SELF_BILLING = 'SELF_BILLING',
  SELF_BILLED = 'SELF_BILLED',
  PREPAYMENT = 'PREPAYMENT',
  FINAL = 'FINAL',
  PROFORMA = 'PROFORMA',
  RECURRING = 'RECURRING'
}

export type InvoiceProfile = 
  | 'PEPPOL_BIS_3_0'
  | 'EN16931'
  | 'CIUS_IT'
  | 'CIUS_DE'
  | 'CIUS_FR'
  | 'CIUS_ES'
  | 'US_STANDARD'
  | 'CUSTOM';

export interface InvoiceMetadata {
  originalInvoiceId?: InvoiceId;
  correctionReason?: string;
  customFields?: Record<string, unknown>;
  externalReferences?: Record<string, string>;
  processingNotes?: string[];
  complianceFlags?: string[];
}

export type InvoiceId = string & { readonly _brand: 'InvoiceId' };

export type UserId = string & { readonly _brand: 'UserId' };

export type DocumentStatus = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'FINALIZED'
  | 'CANCELLED'
  | 'ARCHIVED';

export enum TransmissionStatus {
  NOT_SENT = 'NOT_SENT',
  QUEUED = 'QUEUED',
  SENDING = 'SENDING',
  TRANSMITTING = 'TRANSMITTING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED'
}

export type PaymentStatus = 
  | 'UNPAID'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'REFUNDED'
  | 'DISPUTED';

export type Timestamp = Date & { readonly _brand: 'Timestamp' };

// Party-related types
export type PartyId = string & { readonly _brand: 'PartyId' };
export type CountryCode = string & { readonly _brand: 'CountryCode' };
export type LanguageCode = string & { readonly _brand: 'LanguageCode' };

// Transmission-related types
export type TransmissionJobId = string & { readonly _brand: 'TransmissionJobId' };

// Format and output types
export type OutputFormat = 
  | 'UBL_2_1'
  | 'PEPPOL_UBL'
  | 'CII_D16B'
  | 'FACTUR_X'
  | 'PDF'
  | 'JSON'
  | 'XML';

// Validation types
export enum ValidationSeverity {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

// Electronic address types
export enum AddressScheme {
  PEPPOL = 'PEPPOL',
  GLN = 'GLN',
  DUNS = 'DUNS',
  ENDPOINT_ID = 'ENDPOINT_ID',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  URL = 'URL',
  GLOBAL_ID = 'GLOBAL_ID',
  NETWORK_ID = 'NETWORK_ID'
}

// Tax-related types
export enum TaxExemptionReasonCode {
  EXPORT = 'EXPORT',
  INTER_JURISDICTION = 'INTER_JURISDICTION', 
  REVERSE_CHARGE = 'REVERSE_CHARGE',
  PUBLIC_BODY = 'PUBLIC_BODY',
  EDUCATIONAL = 'EDUCATIONAL',
  CHARITABLE = 'CHARITABLE',
  MEDICAL = 'MEDICAL',
  FINANCIAL = 'FINANCIAL',
  SMALL_BUSINESS = 'SMALL_BUSINESS',
  OTHER = 'OTHER',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

export type TaxSchemeId = string & { readonly _brand: 'TaxSchemeId' };

// Line item types
export type LineItemId = string & { readonly _brand: 'LineItemId' };
export type ProductCode = string & { readonly _brand: 'ProductCode' };

// Reference types
export type ProjectReference = string & { readonly _brand: 'ProjectReference' };

// Payment terms type
export interface PaymentTerms {
  paymentMeansCode?: string;
  paymentTermsCode?: string;
  note?: string;
  dueDate?: Date;
  settlementDiscountPercent?: number;
  penaltySurchargePercent?: number;
}

// Period type
export interface Period {
  startDate: Date;
  endDate: Date;
  description?: string;
}