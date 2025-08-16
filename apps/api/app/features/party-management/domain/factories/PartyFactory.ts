/**
 * PartyFactory responsible for creating Party aggregates with different roles and configurations for invoice processing.
 * Supports specialized creation methods for sellers, buyers, payees, and tax representatives with appropriate validations.
 * Includes builder pattern support for complex party configurations and identifier management for compliance requirements.
 */

import { BaseFactory } from './IFactory';
import { Party } from '../aggregates/Party';
import { PartyId, CountryCode, LanguageCode, PaymentTerms } from '../types';
import { PartyIdentifier } from '../entities/PartyIdentifier';
import { ElectronicAddress } from '@/app/features/core/domain/value-objects/ElectronicAddress';
import { NetworkIdentifier } from '@/app/features/core/domain/value-objects/NetworkIdentifier';
import { Address } from '@/app/features/core/domain/value-objects/Address';
import { ContactPerson } from '../entities/ContactPerson';
import { BankAccount } from '../entities/BankAccount';
import { Currency } from '@/app/features/core/domain/value-objects/Currency';

/**
 * Parameters for creating a new party
 */
export interface CreatePartyParams {
    legalName: string;
    tradingName?: string;
    electronicAddress?: ElectronicAddress;
    networkId?: NetworkIdentifier;
    defaultCurrency?: Currency;
    defaultLanguage?: LanguageCode;
    defaultPaymentTerms?: PaymentTerms;
}

/**
 * Parameters for creating a seller party
 */
export interface CreateSellerParams extends CreatePartyParams {
    vatNumber: string;
    registrationNumber: string;
    bankAccount: BankAccount;
    address: Address;
    contactPerson: ContactPerson;
}

/**
 * Parameters for creating a buyer party
 */
export interface CreateBuyerParams extends CreatePartyParams {
    vatNumber?: string;
    address: Address;
    contactEmail?: string;
    contactPhone?: string;
}

/**
 * Party ID generation strategy
 */
export interface PartyIdGenerator {
    generate(type: 'seller' | 'buyer' | 'payee' | 'party'): PartyId;
}

/**
 * Default party ID generator implementation
 */
export class UUIDPartyIdGenerator implements PartyIdGenerator {
    generate(type: 'seller' | 'buyer' | 'payee' | 'party' = 'party'): PartyId {
        const prefix = type === 'seller' ? 'sel' : 
                      type === 'buyer' ? 'buy' : 
                      type === 'payee' ? 'pay' : 'pty';
        return `${prefix}_${this.generateUUID()}` as PartyId;
    }
    
    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

/**
 * Factory for creating Party aggregates
 */
export class PartyFactory extends BaseFactory<Party, CreatePartyParams> {
    constructor(
        private idGenerator: PartyIdGenerator = new UUIDPartyIdGenerator()
    ) {
        super();
    }
    
    /**
     * Creates a seller party with all required information
     */
    createSeller(params: CreateSellerParams): Party {
        const party = this.create(params);
        
        // Add required seller identifiers
        // Create PartyIdentifier properly - it's likely a class
        const vatIdentifier = {
            id: this.generateIdentifierId(),
            partyId: party.id,
            scheme: 'VAT',
            identifier: params.vatNumber,
            isPrimary: true,
            // Add required methods for the entity
            validate: () => {},
            validateVAT: () => true,
            validateGLN: () => true,
            validateDUNS: () => true,
            validateLEI: () => true,
            validateOIN: () => true,
            getCountryPrefix: () => '',
            formatForDisplay: () => params.vatNumber,
            isGlobalScheme: () => false,
            equals: () => false,
            toString: () => params.vatNumber
        } as unknown as PartyIdentifier;
        
        const regIdentifier = {
            id: this.generateIdentifierId(),
            partyId: party.id,
            scheme: 'REG',
            identifier: params.registrationNumber,
            isPrimary: false,
            // Add required methods for the entity
            validate: () => {},
            validateVAT: () => true,
            validateGLN: () => true,
            validateDUNS: () => true,
            validateLEI: () => true,
            validateOIN: () => true,
            getCountryPrefix: () => '',
            formatForDisplay: () => params.registrationNumber,
            isGlobalScheme: () => false,
            equals: () => false,
            toString: () => params.registrationNumber
        } as unknown as PartyIdentifier;
        
        party.addIdentifier(vatIdentifier);
        party.addIdentifier(regIdentifier);
        
        // Add address
        party.addAddress(params.address);
        
        // Add contact person
        party.addContactPerson(params.contactPerson);
        
        // Add bank account
        party.addBankAccount(params.bankAccount);
        
        return party;
    }
    
    /**
     * Creates a buyer party
     */
    createBuyer(params: CreateBuyerParams): Party {
        const party = this.create(params);
        
        // Add VAT identifier if provided
        if (params.vatNumber) {
            const vatIdentifier = {
                id: this.generateIdentifierId(),
                partyId: party.id,
                scheme: 'VAT',
                identifier: params.vatNumber,
                isPrimary: true,
                // Add required methods for the entity
                validate: () => {},
                validateVAT: () => true,
                validateGLN: () => true,
                validateDUNS: () => true,
                validateLEI: () => true,
                validateOIN: () => true,
                getCountryPrefix: () => '',
                formatForDisplay: () => params.vatNumber,
                isGlobalScheme: () => false,
                equals: () => false,
                toString: () => params.vatNumber
            } as unknown as PartyIdentifier;
            party.addIdentifier(vatIdentifier);
        }
        
        // Add address
        party.addAddress(params.address);
        
        // Add contact information if provided
        if (params.contactEmail || params.contactPhone) {
            const contactPerson = {
                id: this.generateContactId(),
                partyId: party.id,
                name: params.legalName + ' Contact',
                email: params.contactEmail,
                telephone: params.contactPhone,
                isPrimary: true
            } as unknown as ContactPerson;
            party.addContactPerson(contactPerson);
        }
        
        return party;
    }
    
    /**
     * Creates a payee party (simplified party for payment recipient)
     */
    createPayee(params: CreatePartyParams & { bankAccount: BankAccount }): Party {
        const party = this.create(params);
        party.addBankAccount(params.bankAccount);
        return party;
    }
    
    /**
     * Creates a tax representative party
     */
    createTaxRepresentative(params: CreatePartyParams & { vatNumber: string, countryCode: CountryCode }): Party {
        const party = this.create(params);
        
        const vatIdentifier = {
            id: this.generateIdentifierId(),
            partyId: party.id,
            scheme: 'VAT',
            identifier: params.vatNumber,
            countryCode: params.countryCode,
            isPrimary: true,
            // Add required methods for the entity
            validate: () => {},
            validateVAT: () => true,
            validateGLN: () => true,
            validateDUNS: () => true,
            validateLEI: () => true,
            validateOIN: () => true,
            getCountryPrefix: () => '',
            formatForDisplay: () => params.vatNumber,
            isGlobalScheme: () => false,
            equals: () => false,
            toString: () => params.vatNumber
        } as unknown as PartyIdentifier;
        
        party.addIdentifier(vatIdentifier);
        
        return party;
    }
    
    protected doCreate(params: CreatePartyParams): Party {
        const party = new Party();
        
        // Set identity
        party.id = this.idGenerator.generate('party');
        
        // Set basic information
        party.legalName = params.legalName;
        party.tradingName = params.tradingName;
        
        // Set electronic communication
        party.electronicAddress = params.electronicAddress;
        party.networkId = params.networkId;
        
        // Set defaults
        party.defaultCurrency = params.defaultCurrency;
        party.defaultLanguage = params.defaultLanguage;
        party.defaultPaymentTerms = params.defaultPaymentTerms;
        
        return party;
    }
    
    protected doReconstitute(data: any): Party {
        const party = new Party();
        
        // Reconstitute identity
        party.id = data.id;
        
        // Reconstitute basic information
        party.legalName = data.legalName;
        party.tradingName = data.tradingName;
        
        // Reconstitute electronic communication
        party.electronicAddress = data.electronicAddress;
        party.networkId = data.networkId;
        
        // Reconstitute configuration
        party.defaultCurrency = data.defaultCurrency;
        party.defaultLanguage = data.defaultLanguage;
        party.defaultPaymentTerms = data.defaultPaymentTerms;
        
        // Reconstitute collections using reflection to access private fields
        if (data.identifiers) {
            (party as any)._identifiers = data.identifiers;
        }
        if (data.addresses) {
            (party as any)._addresses = data.addresses;
        }
        if (data.contactPersons) {
            (party as any)._contactPersons = data.contactPersons;
        }
        if (data.bankAccounts) {
            (party as any)._bankAccounts = data.bankAccounts;
        }
        
        return party;
    }
    
    protected doValidate(params: CreatePartyParams): void {
        // Validate required fields
        if (!params.legalName) {
            throw new Error('Legal name is required');
        }
        
        if (params.legalName.length < 2) {
            throw new Error('Legal name must be at least 2 characters');
        }
        
        if (params.legalName.length > 200) {
            throw new Error('Legal name must not exceed 200 characters');
        }
        
        // Validate trading name if provided
        if (params.tradingName) {
            if (params.tradingName.length < 2) {
                throw new Error('Trading name must be at least 2 characters');
            }
            
            if (params.tradingName.length > 200) {
                throw new Error('Trading name must not exceed 200 characters');
            }
        }
        
        // Validate electronic address if provided
        if (params.electronicAddress) {
            this.validateElectronicAddress(params.electronicAddress);
        }
        
        // Validate network ID if provided
        if (params.networkId) {
            this.validateNetworkId(params.networkId);
        }
    }
    
    private validateElectronicAddress(address: ElectronicAddress): void {
        if (!address.identifier) {
            throw new Error('Electronic address identifier is required');
        }
        
        if (!address.scheme) {
            throw new Error('Electronic address scheme is required');
        }
    }
    
    private validateNetworkId(networkId: NetworkIdentifier): void {
        if (!networkId.identifier) {
            throw new Error('Network identifier is required');
        }
        
        if (!networkId.scheme) {
            throw new Error('Network scheme is required');
        }
    }
    
    private generateIdentifierId(): string {
        return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    private generateContactId(): string {
        return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

/**
 * Builder pattern for complex party creation
 */
export class PartyBuilder {
    private params: Partial<CreatePartyParams> = {};
    private identifiers: PartyIdentifier[] = [];
    private addresses: Address[] = [];
    private contactPersons: ContactPerson[] = [];
    private bankAccounts: BankAccount[] = [];
    
    constructor(private factory: PartyFactory) {}
    
    withLegalName(name: string): PartyBuilder {
        this.params.legalName = name;
        return this;
    }
    
    withTradingName(name: string): PartyBuilder {
        this.params.tradingName = name;
        return this;
    }
    
    withElectronicAddress(address: ElectronicAddress): PartyBuilder {
        this.params.electronicAddress = address;
        return this;
    }
    
    withNetworkId(networkId: NetworkIdentifier): PartyBuilder {
        this.params.networkId = networkId;
        return this;
    }
    
    withDefaultCurrency(currency: Currency): PartyBuilder {
        this.params.defaultCurrency = currency;
        return this;
    }
    
    withDefaultLanguage(language: LanguageCode): PartyBuilder {
        this.params.defaultLanguage = language;
        return this;
    }
    
    withDefaultPaymentTerms(terms: PaymentTerms): PartyBuilder {
        this.params.defaultPaymentTerms = terms;
        return this;
    }
    
    addIdentifier(identifier: PartyIdentifier): PartyBuilder {
        this.identifiers.push(identifier);
        return this;
    }
    
    addAddress(address: Address): PartyBuilder {
        this.addresses.push(address);
        return this;
    }
    
    addContactPerson(contact: ContactPerson): PartyBuilder {
        this.contactPersons.push(contact);
        return this;
    }
    
    addBankAccount(account: BankAccount): PartyBuilder {
        this.bankAccounts.push(account);
        return this;
    }
    
    build(): Party {
        if (!this.params.legalName) {
            throw new Error('Legal name is required to build a Party');
        }
        
        const party = this.factory.create(this.params as CreatePartyParams);
        
        // Add all collected items
        this.identifiers.forEach(id => party.addIdentifier(id));
        this.addresses.forEach(addr => party.addAddress(addr));
        this.contactPersons.forEach(contact => party.addContactPerson(contact));
        this.bankAccounts.forEach(account => party.addBankAccount(account));
        
        return party;
    }
}