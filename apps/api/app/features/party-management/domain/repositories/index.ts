/**
 * Central export module for all repository interfaces and shared data access types in the core domain.
 * Provides common pagination, sorting, and filtering interfaces used across all repository implementations.
 * This module serves as the main entry point for importing repository contracts and shared query utilities.
 */
export type { PartyRepository, PartySearchCriteria } from './PartyRepository';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SortOptions<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface Repository<T, ID> {
  save(entity: T): Promise<void>;
  findById(id: ID): Promise<T | null>;
  delete(id: ID): Promise<void>;
  exists(id: ID): Promise<boolean>;
}