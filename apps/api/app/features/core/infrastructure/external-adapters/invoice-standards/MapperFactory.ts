import { StandardMapper } from '../../../domain/services/StandardMapper';
import { EN16931Mapper } from './EN16931Mapper';
import { USMapper } from './USMapper';

/**
 * MapperFactory provides a centralized factory pattern for creating and managing standard-specific invoice mappers across different regional standards.
 * It maintains a registry of mapper implementations and provides convenient methods to retrieve mappers by standard name or country code.
 * The factory automatically registers default mappers for EN16931 (EU), US standards, and provides fallback behavior for unknown standards.
 */
export class MapperFactory {
  private static mappers: Map<string, StandardMapper> = new Map();

  static {
    // Register default mappers
    MapperFactory.registerMapper('EN16931', new EN16931Mapper());
    MapperFactory.registerMapper('EU', new EN16931Mapper());
    MapperFactory.registerMapper('PEPPOL', new EN16931Mapper());
    MapperFactory.registerMapper('US', new USMapper());
    MapperFactory.registerMapper('ANSI_X12', new USMapper());
  }

  /**
   * Get a mapper for a specific standard
   */
  static getMapper(standard: string): StandardMapper {
    const mapper = this.mappers.get(standard.toUpperCase());
    if (!mapper) {
      // Return a default mapper if not found
      console.warn(`No mapper found for standard: ${standard}, using default EN16931 mapper`);
      return new EN16931Mapper();
    }
    return mapper;
  }

  /**
   * Register a custom mapper for a standard
   */
  static registerMapper(standard: string, mapper: StandardMapper): void {
    this.mappers.set(standard.toUpperCase(), mapper);
  }

  /**
   * Get mapper based on country code
   */
  static getMapperByCountry(countryCode: string): StandardMapper {
    const countryMappers: Record<string, string> = {
      // EU countries
      'AT': 'EN16931', 'BE': 'EN16931', 'BG': 'EN16931',
      'HR': 'EN16931', 'CY': 'EN16931', 'CZ': 'EN16931',
      'DK': 'EN16931', 'EE': 'EN16931', 'FI': 'EN16931',
      'FR': 'EN16931', 'DE': 'EN16931', 'GR': 'EN16931',
      'HU': 'EN16931', 'IE': 'EN16931', 'IT': 'EN16931',
      'LV': 'EN16931', 'LT': 'EN16931', 'LU': 'EN16931',
      'MT': 'EN16931', 'NL': 'EN16931', 'PL': 'EN16931',
      'PT': 'EN16931', 'RO': 'EN16931', 'SK': 'EN16931',
      'SI': 'EN16931', 'ES': 'EN16931', 'SE': 'EN16931',
      
      // Non-EU countries
      'US': 'US',
      'CA': 'US', // Similar standards
      'MX': 'US',
      'GB': 'EN16931', // Still uses EU standards
      'CH': 'EN16931', // Follows EU standards
      'NO': 'EN16931', // EEA member
      
      // Default
      'DEFAULT': 'EN16931'
    };

    const standard = countryMappers[countryCode] || countryMappers['DEFAULT'] || 'EN16931';
    return this.getMapper(standard);
  }

  /**
   * List all registered standards
   */
  static getAvailableStandards(): string[] {
    return Array.from(this.mappers.keys());
  }
}