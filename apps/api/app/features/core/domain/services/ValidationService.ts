import { Invoice } from '../aggregates/Invoice';
import { ValidationResult, ValidationProfile, ValidationRule } from '@/app/features/core/domain/value-objects/ValidationResult';

/**
 * ValidationService Interface
 * Handles invoice validation against various international standards and regional profiles
 * 
 * This service is designed to be globally agnostic and supports validation for:
 * - International standards (UBL, CII, EDIFACT)
 * - Regional standards (EN16931, ANSI X12, etc.)
 * - Country-specific requirements (CIUS, local tax rules)
 * - Custom business rules and profiles
 */
export interface ValidationService {
    /**
     * Validates an invoice against a specific validation profile
     * 
     * The validation process includes multiple layers:
     * - Structural validation (schema compliance)
     * - Semantic validation (business logic)
     * - Profile-specific validation (regional/standard requirements)
     * - Custom rule validation (organization-specific rules)
     * 
     * @param invoice The invoice to validate
     * @param profile The validation profile containing rules and configuration
     * @returns ValidationResult with detailed validation outcomes
     */
    validateInvoice(invoice: Invoice, profile: ValidationProfile): ValidationResult;
    
    /**
     * Validates invoice structure against a schema definition
     * 
     * Supports various schema formats:
     * - XML Schema (XSD) for UBL/CII formats
     * - JSON Schema for JSON-based formats
     * - Custom schema definitions
     * 
     * @param invoice The invoice to validate
     * @param schemaPath Path to the schema file or schema identifier
     * @param schemaType Type of schema (xsd, json-schema, custom)
     * @returns ValidationResult with structural validation issues
     */
    validateStructure(invoice: Invoice, schemaPath: string, schemaType?: string): ValidationResult;
    
    /**
     * Validates invoice semantics using rule-based validation
     * 
     * Supports multiple rule engines:
     * - Schematron for XML-based validation
     * - JSONPath for JSON-based validation
     * - Custom expression languages
     * 
     * @param invoice The invoice to validate
     * @param rulesPath Path to the rules file or rules identifier
     * @param ruleEngine Type of rule engine to use
     * @returns ValidationResult with semantic validation issues
     */
    validateSemantics(invoice: Invoice, rulesPath: string, ruleEngine?: string): ValidationResult;
    
    /**
     * Validates invoice against standard business rules
     * 
     * Business rules vary by standard and region:
     * - EN16931 business rules (BR-1 to BR-XX) for European invoices
     * - ANSI X12 business rules for US invoices
     * - Country-specific business rules
     * - International best practices
     * 
     * @param invoice The invoice to validate
     * @param standard The business rules standard to apply
     * @param region Optional region-specific modifications
     * @returns ValidationResult with business rule violations
     */
    validateBusinessRules(invoice: Invoice, standard: string, region?: string): ValidationResult;
    
    /**
     * Validates invoice against profile-specific rules
     * 
     * Profile rules include:
     * - CIUS (Core Invoice Usage Specification) rules for EU
     * - Implementation guidelines for specific networks
     * - Industry-specific requirements
     * - Organization-specific customizations
     * 
     * @param invoice The invoice to validate
     * @param profileId The profile identifier
     * @param customRules Optional additional custom rules
     * @returns ValidationResult with profile-specific issues
     */
    validateProfileRules(invoice: Invoice, profileId: string, customRules?: ValidationRule[]): ValidationResult;
    
    /**
     * Validates invoice against custom business rules
     * 
     * Allows validation against organization-specific or
     * dynamically defined validation rules
     * 
     * @param invoice The invoice to validate
     * @param rules Array of custom validation rules to apply
     * @returns ValidationResult with custom rule violations
     */
    validateCustomRules(invoice: Invoice, rules: ValidationRule[]): ValidationResult;
    
    /**
     * Gets supported validation standards for this service instance
     * 
     * @returns Array of supported standard identifiers
     */
    getSupportedStandards(): string[];
    
    /**
     * Gets supported validation profiles for a given standard
     * 
     * @param standard The standard identifier
     * @returns Array of supported profile identifiers
     */
    getSupportedProfiles(standard: string): string[];
}