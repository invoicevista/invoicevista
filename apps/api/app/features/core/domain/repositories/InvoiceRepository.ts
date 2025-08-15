/**
 * Defines the repository interface for managing Invoice aggregates in the domain layer.
 * Provides methods for CRUD operations, searching, filtering, and retrieving invoices with support for pagination and sorting.
 * This interface abstracts data access patterns and enables dependency inversion for different storage implementations.
 */
import type { Invoice } from '../aggregates/Invoice';
import type { InvoiceNumber } from '@/app/features/core/domain/value-objects/InvoiceNumber';
import type { DateRange, PaginatedResult, PaginationOptions, SortOptions } from '.';

export interface InvoiceSearchCriteria {
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  supplierId?: string;
  customerId?: string;
  dateRange?: DateRange;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
  searchText?: string;
}

export interface InvoiceRepository {
  save(invoice: Invoice): Promise<void>;
  findById(id: string): Promise<Invoice | null>;
  findByNumber(number: InvoiceNumber): Promise<Invoice | null>;
  search(
    criteria: InvoiceSearchCriteria,
    pagination?: PaginationOptions,
    sort?: SortOptions<Invoice>
  ): Promise<PaginatedResult<Invoice>>;
  findBySupplier(supplierId: string, pagination?: PaginationOptions): Promise<PaginatedResult<Invoice>>;
  findByCustomer(customerId: string, pagination?: PaginationOptions): Promise<PaginatedResult<Invoice>>;
  exists(id: string): Promise<boolean>;
  delete(id: string): Promise<void>;
  countByStatus(supplierId?: string): Promise<Record<string, number>>;
}