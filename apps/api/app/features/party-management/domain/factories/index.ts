/**
 * Domain Factory exports
 * 
 * Factories implement the Factory Pattern to handle complex object creation
 * and ensure domain aggregates are created in a valid state.
 */

// Base factory interfaces
export type { IFactory } from '@/app/features/core/domain/factories/IFactory';
export { BaseFactory } from '@/app/features/core/domain/factories/IFactory';

// Party Factory
export { 
    PartyFactory,
    UUIDPartyIdGenerator,
    PartyBuilder
} from './PartyFactory';
export type {
    CreatePartyParams,
    CreateSellerParams,
    CreateBuyerParams,
    PartyIdGenerator
} from './PartyFactory';
