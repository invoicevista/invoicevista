/**
 * Defines the repository interface for managing Party aggregates (suppliers and customers) in the domain layer.
 * Provides methods for CRUD operations, searching by various criteria, and managing party relationships with support for pagination.
 * This interface enables flexible querying of parties by identifiers, network IDs, and business attributes while maintaining domain boundaries.
 */
import type { Party } from '../aggregates/Party';
import type { PartyIdentifier } from '../entities/PartyIdentifier';
import type { NetworkIdentifier } from '@/app/features/core/domain/value-objects/NetworkIdentifier';
import type { PaginatedResult, PaginationOptions, SortOptions } from '.';

export interface PartySearchCriteria {
  type?: 'supplier' | 'customer' | 'both';
  name?: string;
  country?: string;
  networkId?: NetworkIdentifier;
  isActive?: boolean;
  searchText?: string;
}

export interface PartyRepository {
  save(party: Party): Promise<void>;
  findById(id: string): Promise<Party | null>;
  findByIdentifier(identifier: PartyIdentifier): Promise<Party | null>;
  findByNetworkIdentifier(networkId: NetworkIdentifier): Promise<Party | null>;
  search(
    criteria: PartySearchCriteria,
    pagination?: PaginationOptions,
    sort?: SortOptions<Party>
  ): Promise<PaginatedResult<Party>>;
  findSuppliers(pagination?: PaginationOptions): Promise<PaginatedResult<Party>>;
  findCustomers(pagination?: PaginationOptions): Promise<PaginatedResult<Party>>;
  exists(id: string): Promise<boolean>;
  delete(id: string): Promise<void>;
  updateLastActivity(id: string, timestamp: Date): Promise<void>;
}