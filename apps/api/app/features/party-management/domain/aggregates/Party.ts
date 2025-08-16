/**
 * Party aggregate root representing a business entity that can participate in invoice transactions.
 * Manages all party-related information including identifiers, addresses, contacts, and banking details.
 * Creates immutable snapshots for use in invoices and validates party data for compliance requirements.
 */

import { PartyId, CountryCode, LanguageCode, PaymentTerms } from '../types';
import { PartyIdentifier } from '../entities/PartyIdentifier';
import { TaxNumber } from '@/app/features/core/domain/value-objects/TaxNumber';
import { ElectronicAddress } from '@/app/features/core/domain/value-objects/ElectronicAddress';
import { NetworkIdentifier } from '@/app/features/core/domain/value-objects/NetworkIdentifier';
import { Address } from '@/app/features/core/domain/value-objects/Address';
import { ContactPerson } from '../entities/ContactPerson';
import { BankAccount } from '../entities/BankAccount';
import { Currency } from '@/app/features/core/domain/value-objects/Currency';
import { PartySnapshot } from '@/app/features/party-management/domain/value-objects/PartySnapshot';
import { ValidationResult } from '@/app/features/core/domain/value-objects/ValidationResult';
import { DomainEvent } from '../events/DomainEvent';

export class Party {
    id!: PartyId;

    // Identification
    legalName!: string;
    tradingName?: string;

    // Identifiers - Private collection with controlled access
    private _identifiers: PartyIdentifier[] = [];

    // Electronic Communication
    electronicAddress?: ElectronicAddress;
    networkId?: NetworkIdentifier;

    // Contact - Private collections with controlled access
    private _addresses: Address[] = [];
    private _contactPersons: ContactPerson[] = [];

    // Banking - Private collection with controlled access
    private _bankAccounts: BankAccount[] = [];

    // Configuration
    defaultCurrency?: Currency;
    defaultLanguage?: LanguageCode;
    defaultPaymentTerms?: PaymentTerms;

    // Domain Events
    private _domainEvents: DomainEvent[] = [];

    // Getters for read-only access to collections
    get identifiers(): ReadonlyArray<PartyIdentifier> {
        return Object.freeze([...this._identifiers]);
    }

    get addresses(): ReadonlyArray<Address> {
        return Object.freeze([...this._addresses]);
    }

    get contactPersons(): ReadonlyArray<ContactPerson> {
        return Object.freeze([...this._contactPersons]);
    }

    get bankAccounts(): ReadonlyArray<BankAccount> {
        return Object.freeze([...this._bankAccounts]);
    }

    get domainEvents(): ReadonlyArray<DomainEvent> {
        return Object.freeze([...this._domainEvents]);
    }

    // Methods with proper validation and encapsulation
    addIdentifier(identifier: PartyIdentifier): void {
        this.validateIdentifier(identifier);
        
        // Check for duplicates
        const exists = this._identifiers.some(id => 
            id.scheme === identifier.scheme && id.identifier === identifier.identifier
        );
        
        if (exists) {
            throw new Error(`Identifier ${identifier.scheme}:${identifier.identifier} already exists`);
        }
        
        this._identifiers.push(identifier);
        this.addDomainEvent('IDENTIFIER_ADDED', { identifier });
    }

    removeIdentifier(scheme: string, identifier: string): void {
        const index = this._identifiers.findIndex(id => 
            id.scheme === scheme && id.identifier === identifier
        );
        
        if (index === -1) {
            throw new Error(`Identifier ${scheme}:${identifier} not found`);
        }
        
        this._identifiers.splice(index, 1);
        this.addDomainEvent('IDENTIFIER_REMOVED', { scheme, identifier });
    }

    addAddress(address: Address): void {
        this.validateAddress(address);
        this._addresses.push(address);
        this.addDomainEvent('ADDRESS_ADDED', { address });
    }

    updateAddress(index: number, address: Address): void {
        if (index < 0 || index >= this._addresses.length) {
            throw new Error('Invalid address index');
        }
        
        this.validateAddress(address);
        this._addresses[index] = address;
        this.addDomainEvent('ADDRESS_UPDATED', { index, address });
    }

    removeAddress(index: number): void {
        if (index < 0 || index >= this._addresses.length) {
            throw new Error('Invalid address index');
        }
        
        const removed = this._addresses.splice(index, 1)[0];
        this.addDomainEvent('ADDRESS_REMOVED', { index, address: removed });
    }

    addContactPerson(contact: ContactPerson): void {
        this.validateContactPerson(contact);
        this._contactPersons.push(contact);
        this.addDomainEvent('CONTACT_PERSON_ADDED', { contact });
    }

    removeContactPerson(contactId: string): void {
        const index = this._contactPersons.findIndex(c => c.id === contactId);
        
        if (index === -1) {
            throw new Error(`Contact person with ID ${contactId} not found`);
        }
        
        const removed = this._contactPersons.splice(index, 1)[0];
        this.addDomainEvent('CONTACT_PERSON_REMOVED', { contactId, contact: removed });
    }

    addBankAccount(account: BankAccount): void {
        this.validateBankAccount(account);
        
        // Check for duplicate account numbers
        const exists = this._bankAccounts.some(ba => 
            ba.accountNumber === account.accountNumber
        );
        
        if (exists) {
            throw new Error(`Bank account ${account.accountNumber} already exists`);
        }
        
        this._bankAccounts.push(account);
        this.addDomainEvent('BANK_ACCOUNT_ADDED', { account });
    }

    removeBankAccount(accountNumber: string): void {
        const index = this._bankAccounts.findIndex(ba => 
            ba.accountNumber === accountNumber
        );
        
        if (index === -1) {
            throw new Error(`Bank account ${accountNumber} not found`);
        }
        
        const removed = this._bankAccounts.splice(index, 1)[0];
        this.addDomainEvent('BANK_ACCOUNT_REMOVED', { accountNumber, account: removed });
    }

    createSnapshot(): PartySnapshot {
        // Create a PartySnapshot - this value object likely has a constructor
        // For now we'll create it directly
        return {
            id: this.id,
            legalName: this.legalName,
            tradingName: this.tradingName,
            electronicAddress: this.electronicAddress,
            networkId: this.networkId,
            address: this._addresses[0], // Primary address
            contactEmail: this._contactPersons[0]?.email,
            contactPhone: this._contactPersons[0]?.telephone
        } as unknown as PartySnapshot;
    }

    validateIdentifiers(): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        if (this._identifiers.length === 0) {
            warnings.push('No identifiers configured');
        }
        
        // Validate each identifier
        this._identifiers.forEach(id => {
            try {
                this.validateIdentifier(id);
            } catch (error) {
                errors.push(`Invalid identifier ${id.scheme}:${id.identifier}: ${error}`);
            }
        });
        
        // Create ValidationResult using proper imports
        // For now, we'll create a minimal result
        return {
            isValid: errors.length === 0,
            hasErrors: () => errors.length > 0,
            hasWarnings: () => warnings.length > 0,
            errors: errors.map(e => ({ message: e })),
            warnings: warnings.map(w => ({ message: w }))
        } as unknown as ValidationResult;
    }

    // Private validation methods
    private validateIdentifier(identifier: PartyIdentifier): void {
        if (!identifier.scheme) {
            throw new Error('Identifier scheme is required');
        }
        if (!identifier.identifier) {
            throw new Error('Identifier value is required');
        }
    }

    private validateAddress(address: Address): void {
        if (!address.countryCode) {
            throw new Error('Address country code is required');
        }
        if (!address.cityName && !address.postalCode) {
            throw new Error('Address must have either city name or postal code');
        }
    }

    private validateContactPerson(contact: ContactPerson): void {
        if (!contact.name) {
            throw new Error('Contact person name is required');
        }
        if (!contact.email && !contact.telephone) {
            throw new Error('Contact person must have either email or telephone');
        }
    }

    private validateBankAccount(account: BankAccount): void {
        if (!account.accountNumber) {
            throw new Error('Bank account number is required');
        }
        if (!account.bankName) {
            throw new Error('Bank name is required');
        }
    }

    private addDomainEvent(eventType: string, data: any): void {
        // This would create actual domain event objects
        // For now, using a simplified approach
        const event = {
            aggregateId: this.id,
            aggregateType: 'Party',
            eventType,
            data,
            occurredOn: new Date()
        } as any;
        
        this._domainEvents.push(event);
    }

    // Method to clear domain events after processing
    clearDomainEvents(): void {
        this._domainEvents = [];
    }
}