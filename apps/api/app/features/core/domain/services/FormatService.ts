import { Invoice } from '../aggregates/Invoice';
import { OutputFormat } from '../../../invoice-management/domain/value-objects';

/**
 * FormatService Interface
 * Handles document format generation and conversion for invoices across different standards and formats.
 * Provides capabilities to generate documents from invoice data, convert between formats, and extract invoice data from documents.
 */
export interface FormatService {
    generateDocument(invoice: Invoice, format: OutputFormat): Document;
    convertDocument(document: Document, targetFormat: OutputFormat): Document;
    extractInvoice(document: Document): Invoice;
}