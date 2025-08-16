/**
 * Domain Factory exports
 * 
 * Factories implement the Factory Pattern to handle complex object creation
 * and ensure domain aggregates are created in a valid state.
 */

// Base factory interfaces
export type { IFactory } from '@/app/features/core/domain/factories/IFactory';
export { BaseFactory } from '@/app/features/core/domain/factories/IFactory';

// Invoice Factory
export { 
    InvoiceFactory,
    SequentialInvoiceNumberGenerator
} from './InvoiceFactory';
export type {
    CreateInvoiceParams,
    InvoiceNumberGenerator
} from './InvoiceFactory';
