/**
 * Domain Factory exports
 * 
 * Factories implement the Factory Pattern to handle complex object creation
 * and ensure domain aggregates are created in a valid state.
 */

// Base factory interfaces
export type { IFactory } from './IFactory';
export { BaseFactory } from './IFactory';

// Invoice Factory
export { 
    InvoiceFactory,
    SequentialInvoiceNumberGenerator
} from './InvoiceFactory';
export type {
    CreateInvoiceParams,
    InvoiceNumberGenerator
} from './InvoiceFactory';

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
