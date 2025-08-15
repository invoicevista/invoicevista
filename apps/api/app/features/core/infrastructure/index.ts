/**
 * Infrastructure layer barrel export providing access to all external system integrations and technical implementations.
 * This module centralizes database repositories, external API adapters, messaging systems, and configuration services.
 * Implements the technical details required by the domain and application layers while maintaining proper architectural boundaries.
 */

// Export infrastructure implementations
export * from './external-adapters/invoice-standards/MapperFactory';
export * from './external-adapters/invoice-standards/EN16931Mapper';
export * from './external-adapters/invoice-standards/USMapper';

// TODO: Add exports for repositories, messaging, caching, etc. when implemented