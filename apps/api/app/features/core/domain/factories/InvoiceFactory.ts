/**
 * InvoiceFactory responsible for creating and reconstituting Invoice aggregates with proper validation and business rules.
 * Handles various invoice types (standard, credit note, corrective) and applies profile-specific configurations.
 * Manages invoice number generation, totals calculation, and ensures all required data is properly initialized.
 */

import { BaseFactory } from './IFactory';
import { Invoice } from '../aggregates/Invoice';
import { ValidationService } from '../services/ValidationService';
import { InvoiceNumber } from '@/app/features/core/domain/value-objects/InvoiceNumber';
import { PartySnapshot } from '@/app/features/core/domain/value-objects/PartySnapshot';
import { Currency } from '@/app/features/core/domain/value-objects/Currency';
import { ExchangeRate } from '@/app/features/core/domain/value-objects/ExchangeRate';
import { InvoiceTotals } from '@/app/features/core/domain/value-objects/InvoiceTotals';
import { Money } from '@/app/features/core/domain/value-objects/Money';
import { 
  InvoiceType, 
  InvoiceProfile, 
  InvoiceMetadata, 
  UserId, 
  InvoiceId, 
  DocumentStatus, 
  TransmissionStatus, 
  PaymentStatus, 
  Timestamp 
} from '../types';
import { Decimal } from 'decimal.js';


/**
 * Parameters for creating a new invoice
 */
export interface CreateInvoiceParams {
    type: InvoiceType;
    profile: InvoiceProfile;
    seller: PartySnapshot;
    buyer: PartySnapshot;
    currency: Currency;
    issueDate: Date;
    dueDate?: Date;
    payee?: PartySnapshot;
    taxRepresentative?: PartySnapshot;
    metadata?: InvoiceMetadata;
    createdBy: UserId;
}

/**
 * Invoice number generation strategy
 */
export interface InvoiceNumberGenerator {
    generate(seller: PartySnapshot, prefix?: string): InvoiceNumber;
    validate(invoiceNumber: InvoiceNumber): boolean;
}

/**
 * Default invoice number generator implementation
 */
export class SequentialInvoiceNumberGenerator implements InvoiceNumberGenerator {
    private counter: number = 1;
    private prefix: string;
    
    constructor(prefix: string = 'INV', startFrom: number = 1) {
        this.prefix = prefix;
        this.counter = startFrom;
    }
    
    generate(seller: PartySnapshot, customPrefix?: string): InvoiceNumber {
        const prefix = customPrefix || this.prefix;
        const year = new Date().getFullYear();
        const paddedCounter = this.counter.toString().padStart(6, '0');
        const number = `${prefix}-${year}-${paddedCounter}`;
        this.counter++;
        
        return new InvoiceNumber(number, prefix);
    }
    
    validate(invoiceNumber: InvoiceNumber): boolean {
        // InvoiceNumber validates itself in constructor
        return true;
    }
}

/**
 * Factory for creating Invoice aggregates
 */
export class InvoiceFactory extends BaseFactory<Invoice, CreateInvoiceParams> {
    constructor(
        private numberGenerator: InvoiceNumberGenerator,
        private validationService?: ValidationService
    ) {
        super();
    }
    
    /**
     * Creates a standard invoice with default values
     */
    createStandardInvoice(params: CreateInvoiceParams): Invoice {
        const standardParams = {
            ...params,
            type: InvoiceType.STANDARD
        };
        return this.create(standardParams);
    }
    
    /**
     * Creates a credit note
     */
    createCreditNote(params: CreateInvoiceParams, originalInvoiceId: InvoiceId): Invoice {
        const creditNoteParams = {
            ...params,
            type: InvoiceType.CREDIT_NOTE,
            metadata: {
                ...params.metadata,
                originalInvoiceId
            } as InvoiceMetadata
        };
        return this.create(creditNoteParams);
    }
    
    /**
     * Creates a corrective invoice
     */
    createCorrectiveInvoice(params: CreateInvoiceParams, originalInvoiceId: InvoiceId): Invoice {
        const correctiveParams = {
            ...params,
            type: InvoiceType.CORRECTIVE,
            metadata: {
                ...params.metadata,
                originalInvoiceId
            } as InvoiceMetadata
        };
        return this.create(correctiveParams);
    }
    
    /**
     * Creates a self-billing invoice
     */
    createSelfBillingInvoice(params: CreateInvoiceParams): Invoice {
        const selfBillingParams = {
            ...params,
            type: InvoiceType.SELF_BILLING
        };
        return this.create(selfBillingParams);
    }
    
    protected doCreate(params: CreateInvoiceParams): Invoice {
        const invoice = new Invoice();
        
        // Set identity
        invoice.id = this.generateInvoiceId();
        invoice.invoiceNumber = this.numberGenerator.generate(params.seller);
        
        // Set metadata
        invoice.type = params.type;
        invoice.profile = params.profile;
        invoice.metadata = params.metadata || {} as InvoiceMetadata;
        
        // Set parties
        invoice.seller = params.seller;
        invoice.buyer = params.buyer;
        invoice.payee = params.payee;
        invoice.taxRepresentative = params.taxRepresentative;
        
        // Set dates
        invoice.issueDate = params.issueDate;
        invoice.dueDate = params.dueDate;
        
        // Initialize status
        invoice.documentStatus = 'DRAFT' as DocumentStatus;
        invoice.transmissionStatus = TransmissionStatus.NOT_SENT;
        invoice.paymentStatus = 'UNPAID' as PaymentStatus;
        
        // Set financial information
        invoice.currency = params.currency;
        invoice.baseCurrency = params.currency; // Default to same currency
        invoice.exchangeRate = new ExchangeRate(
            new Decimal(1), 
            'SYSTEM', 
            new Date(),
            params.currency.code,
            params.currency.code
        );
        
        // Initialize totals
        invoice.totals = this.createEmptyTotals(params.currency);
        
        // Set audit information
        invoice.createdBy = params.createdBy;
        invoice.createdAt = new Date() as Timestamp;
        
        // Apply profile-specific defaults
        this.applyProfileDefaults(invoice, params.profile);
        
        // Validate draft if validation service is provided
        if (this.validationService) {
            const validationResult = this.validationService.validateInvoice(
                invoice, 
                'DRAFT' as any
            );
            if (!validationResult.isValid) {
                console.warn('Draft invoice validation warnings:', validationResult.warnings);
            }
        }
        
        return invoice;
    }
    
    protected doReconstitute(data: any): Invoice {
        const invoice = new Invoice();
        
        // Reconstitute all properties
        invoice.id = data.id;
        invoice.invoiceNumber = new InvoiceNumber(
            data.invoiceNumber.value,
            data.invoiceNumber.prefix
        );
        
        // Reconstitute metadata
        invoice.type = data.type;
        invoice.profile = data.profile;
        invoice.metadata = data.metadata;
        
        // Reconstitute parties (assuming they're already PartySnapshot objects)
        invoice.seller = data.seller;
        invoice.buyer = data.buyer;
        invoice.payee = data.payee;
        invoice.taxRepresentative = data.taxRepresentative;
        
        // Reconstitute dates
        invoice.issueDate = new Date(data.issueDate);
        invoice.dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
        invoice.taxPointDate = data.taxPointDate ? new Date(data.taxPointDate) : undefined;
        invoice.deliveryDate = data.deliveryDate ? new Date(data.deliveryDate) : undefined;
        
        // Reconstitute status
        invoice.documentStatus = data.documentStatus;
        invoice.transmissionStatus = data.transmissionStatus;
        invoice.paymentStatus = data.paymentStatus;
        
        // Reconstitute financial
        invoice.currency = data.currency;
        invoice.baseCurrency = data.baseCurrency;
        invoice.exchangeRate = data.exchangeRate;
        invoice.totals = data.totals;
        
        // Reconstitute references
        invoice.purchaseOrderReference = data.purchaseOrderReference;
        invoice.contractReference = data.contractReference;
        invoice.projectReference = data.projectReference;
        
        // Reconstitute audit
        invoice.createdBy = data.createdBy;
        invoice.createdAt = new Date(data.createdAt) as Timestamp;
        invoice.finalizedAt = data.finalizedAt ? new Date(data.finalizedAt) as Timestamp : undefined;
        
        // Reconstitute collections using reflection to access private fields
        if (data.lineItems) {
            (invoice as any)._lineItems = data.lineItems;
        }
        if (data.taxBreakdown) {
            (invoice as any)._taxBreakdown = data.taxBreakdown;
        }
        if (data.precedingInvoices) {
            (invoice as any)._precedingInvoices = data.precedingInvoices;
        }
        if (data.validationResults) {
            (invoice as any)._validationResults = data.validationResults;
        }
        if (data.history) {
            (invoice as any)._history = data.history;
        }
        
        return invoice;
    }
    
    protected doValidate(params: CreateInvoiceParams): void {
        // Validate required fields
        if (!params.type) {
            throw new Error('Invoice type is required');
        }
        
        if (!params.profile) {
            throw new Error('Invoice profile is required');
        }
        
        if (!params.seller) {
            throw new Error('Seller information is required');
        }
        
        if (!params.buyer) {
            throw new Error('Buyer information is required');
        }
        
        if (!params.currency) {
            throw new Error('Currency is required');
        }
        
        if (!params.issueDate) {
            throw new Error('Issue date is required');
        }
        
        if (!params.createdBy) {
            throw new Error('Creator user ID is required');
        }
        
        // Validate business logic
        if (params.dueDate && params.dueDate < params.issueDate) {
            throw new Error('Due date cannot be before issue date');
        }
        
        // Validate type-specific requirements
        this.validateTypeSpecificRequirements(params);
    }
    
    private validateTypeSpecificRequirements(params: CreateInvoiceParams): void {
        if (params.type === InvoiceType.CREDIT_NOTE || params.type === InvoiceType.CORRECTIVE) {
            // These types require original invoice reference
            // We'll check metadata as a whole since it's an opaque type
            if (!params.metadata) {
                throw new Error(`${params.type} requires metadata with original invoice reference`);
            }
        } else if (params.type === InvoiceType.SELF_BILLING) {
            // Self-billing specific validation
            if (!params.buyer.electronicAddress) {
                throw new Error('Self-billing invoice requires buyer electronic address');
            }
        }
    }
    
    private applyProfileDefaults(invoice: Invoice, profile: InvoiceProfile): void {
        // Apply profile-specific defaults
        // Profile is an opaque type, so we can't switch on it directly
        // Instead, check common profiles by converting to string
        const profileStr = profile as unknown as string;
        if (profileStr === 'PEPPOL_BIS_3_0') {
            // PEPPOL specific defaults
            if (!invoice.dueDate) {
                // Default due date to 30 days from issue date
                const dueDate = new Date(invoice.issueDate);
                dueDate.setDate(dueDate.getDate() + 30);
                invoice.dueDate = dueDate;
            }
        } else if (profileStr === 'EN16931') {
            // EN16931 specific defaults
        }
        // Add more profile-specific defaults as needed
    }
    
    private createEmptyTotals(currency: Currency): InvoiceTotals {
        const zero = new Money(new Decimal(0), currency);
        
        // InvoiceTotals is an opaque type, so we need to create it properly
        // For now, we'll create a minimal structure that matches the expected interface
        return {
            lineExtensionAmount: zero,
            taxExclusiveAmount: zero,
            taxInclusiveAmount: zero,
            allowanceTotalAmount: zero,
            chargeTotalAmount: zero,
            prepaidAmount: zero,
            payableRoundingAmount: zero,
            payableAmount: zero,
            // Add any other required properties
            lineNetAmount: zero,
            taxTotalAmount: zero,
            roundingAmount: zero,
            validate: () => true,
            calculateFrom: () => {},
            applyRounding: () => {},
            getTaxBreakdown: () => [],
            equals: () => false
        } as unknown as InvoiceTotals;
    }
    
    private generateInvoiceId(): InvoiceId {
        // Generate UUID v4
        return `inv_${this.generateUUID()}` as InvoiceId;
    }
    
    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}