/**
 * Invoice aggregate root representing a complete invoice document with all associated business logic.
 * This is the primary aggregate for managing invoice lifecycle from creation to payment and transmission.
 * Enforces business rules, maintains consistency, and publishes domain events for invoice operations.
 */

import { InvoiceId, InvoiceType, InvoiceProfile, InvoiceMetadata, DocumentStatus, TransmissionStatus, PaymentStatus, OutputFormat, UserId, Timestamp, ProjectReference, Period } from '../types';
import { InvoiceNumber } from '@/app/features/core/domain/value-objects/InvoiceNumber';
import { PartySnapshot } from '@/app/features/core/domain/value-objects/PartySnapshot';
import { Currency } from '@/app/features/core/domain/value-objects/Currency';
import { ExchangeRate } from '@/app/features/core/domain/value-objects/ExchangeRate';
import { InvoiceLineItem } from '../entities/InvoiceLineItem';
import { InvoiceTotals } from '@/app/features/core/domain/value-objects/InvoiceTotals';
import { TaxBreakdown } from '@/app/features/core/domain/value-objects/TaxBreakdown';
import { DocumentReference } from '@/app/features/core/domain/value-objects/DocumentReference';
import { ValidationResult, ValidationProfile, ValidationIssue } from '@/app/features/core/domain/value-objects/ValidationResult';
import { InvoiceEvent } from '../events/InvoiceEvent';
import { Payment } from '@/app/features/core/domain/value-objects/Payment';
import { DomainEvent } from '../events/DomainEvent';
import { 
  InvoiceLineItemAddedEvent,
  InvoiceLineItemRemovedEvent,
  InvoiceLineItemUpdatedEvent,
  InvoiceFinalizedEvent,
  InvoiceSentEvent,
  InvoicePaymentAppliedEvent,
  InvoiceValidatedEvent
} from '../events/InvoiceEvents';
import { Money } from '@/app/features/core/domain/value-objects/Money';
import { Decimal } from 'decimal.js';

export class Invoice {
    // Identity
    id!: InvoiceId; // UUID
    invoiceNumber!: InvoiceNumber; // Value Object

    // Metadata
    type!: InvoiceType; // Invoice document type
    profile!: InvoiceProfile; // Format profile
    metadata!: InvoiceMetadata; // Additional metadata

    // Parties (Value Objects - immutable snapshots)
    seller!: PartySnapshot;
    buyer!: PartySnapshot;
    payee?: PartySnapshot;
    taxRepresentative?: PartySnapshot;

    // Dates
    issueDate!: Date;
    dueDate?: Date;
    taxPointDate?: Date;
    deliveryDate?: Date;

    // Status
    documentStatus!: DocumentStatus;
    transmissionStatus!: TransmissionStatus;
    paymentStatus!: PaymentStatus;

    // Financial
    currency!: Currency;
    baseCurrency!: Currency;
    exchangeRate!: ExchangeRate;

    // Line Items - Private collection with controlled access
    private _lineItems: InvoiceLineItem[] = [];

    // Totals (Calculated Value Objects)
    totals!: InvoiceTotals;
    private _taxBreakdown: TaxBreakdown[] = [];

    // References - Private collections with controlled access
    purchaseOrderReference?: DocumentReference;
    contractReference?: DocumentReference;
    projectReference?: ProjectReference;
    private _precedingInvoices: DocumentReference[] = [];

    // Compliance - Private collections with controlled access
    private _validationResults: ValidationResult[] = [];

    // Audit - Private collections with controlled access
    private _history: InvoiceEvent[] = [];
    private _domainEvents: DomainEvent[] = [];
    createdBy!: UserId;
    createdAt!: Timestamp;
    finalizedAt?: Timestamp;

    // Getters for read-only access to collections
    get lineItems(): ReadonlyArray<InvoiceLineItem> {
        return Object.freeze([...this._lineItems]);
    }

    get taxBreakdown(): ReadonlyArray<TaxBreakdown> {
        return Object.freeze([...this._taxBreakdown]);
    }

    get precedingInvoices(): ReadonlyArray<DocumentReference> {
        return Object.freeze([...this._precedingInvoices]);
    }

    get validationResults(): ReadonlyArray<ValidationResult> {
        return Object.freeze([...this._validationResults]);
    }

    get history(): ReadonlyArray<InvoiceEvent> {
        return Object.freeze([...this._history]);
    }

    get domainEvents(): ReadonlyArray<DomainEvent> {
        return Object.freeze([...this._domainEvents]);
    }

    // Methods with proper validation and event handling
    addLineItem(item: InvoiceLineItem): void {
        this.validateLineItem(item);
        this.ensureNotFinalized();
        
        // Assign line number if not set
        if (!item.lineNumber) {
            item.lineNumber = this._lineItems.length + 1;
        }
        
        this._lineItems.push(item);
        this.recalculateTotals();
        
        // Add domain event
        this.addDomainEvent(new InvoiceLineItemAddedEvent(
            this.id,
            item.id,
            item.name,
            item.quantity.value.toNumber(),
            item.unitPrice,
            this.createdBy
        ));
        
        // Add to history
        this.addHistoryEvent('LINE_ITEM_ADDED', { lineItemId: item.id, name: item.name });
    }

    removeLineItem(lineItemId: string): void {
        this.ensureNotFinalized();
        
        const index = this._lineItems.findIndex(item => item.id === lineItemId);
        if (index === -1) {
            throw new Error(`Line item with ID ${lineItemId} not found`);
        }
        
        const removedItem = this._lineItems.splice(index, 1)[0];
        if (!removedItem) {
            throw new Error(`Failed to remove line item with ID ${lineItemId}`);
        }
        
        // Recalculate line numbers
        this._lineItems.forEach((item, idx) => {
            item.lineNumber = idx + 1;
        });
        
        this.recalculateTotals();
        
        // Add domain event
        this.addDomainEvent(new InvoiceLineItemRemovedEvent(
            this.id,
            lineItemId,
            removedItem!.name,
            this.createdBy
        ));
        
        // Add to history
        this.addHistoryEvent('LINE_ITEM_REMOVED', { lineItemId, name: removedItem.name });
    }

    updateLineItem(lineItemId: string, updates: Partial<InvoiceLineItem>): void {
        this.ensureNotFinalized();
        
        const item = this._lineItems.find(item => item.id === lineItemId);
        if (!item) {
            throw new Error(`Line item with ID ${lineItemId} not found`);
        }
        
        // Apply updates
        Object.assign(item, updates);
        
        // Revalidate
        this.validateLineItem(item);
        this.recalculateTotals();
        
        // Add domain event
        this.addDomainEvent(new InvoiceLineItemUpdatedEvent(
            this.id,
            lineItemId,
            updates,
            this.createdBy
        ));
        
        // Add to history
        this.addHistoryEvent('LINE_ITEM_UPDATED', { lineItemId, updates });
    }

    addPrecedingInvoice(reference: DocumentReference): void {
        this.ensureNotFinalized();
        this.validateDocumentReference(reference);
        this._precedingInvoices.push(reference);
        this.addHistoryEvent('PRECEDING_INVOICE_ADDED', { reference });
    }

    finalize(): void {
        this.ensureNotFinalized();
        this.validateForFinalization();
        
        this.documentStatus = 'FINALIZED' as DocumentStatus;
        this.finalizedAt = new Date() as Timestamp;
        
        // Add domain event
        this.addDomainEvent(new InvoiceFinalizedEvent(
            this.id,
            this.invoiceNumber.toString(),
            this.totals.taxInclusiveAmount,  // Total including tax
            new Date(),
            this.createdBy
        ));
        
        // Add to history
        this.addHistoryEvent('INVOICE_FINALIZED', { finalizedAt: this.finalizedAt });
    }

    send(): void {
        this.ensureFinalized();
        
        this.transmissionStatus = 'SENT' as TransmissionStatus;
        
        // Add domain event
        this.addDomainEvent(new InvoiceSentEvent(
            this.id,
            this.invoiceNumber.toString(),
            this.buyer.electronicAddress?.identifier || '',  // Using identifier instead of address
            'PEPPOL',
            new Date(),
            this.createdBy
        ));
        
        // Add to history
        this.addHistoryEvent('INVOICE_SENT', { sentAt: new Date() });
    }

    applyPayment(payment: Payment): void {
        this.validatePayment(payment);
        
        // Calculate remaining amount
        const remainingAmount = this.calculateRemainingAmount(payment);
        
        // Update payment status
        if (remainingAmount.isZero()) {
            this.paymentStatus = 'PAID' as PaymentStatus;
        } else {
            this.paymentStatus = 'PARTIAL' as PaymentStatus;
        }
        
        // Add domain event
        this.addDomainEvent(new InvoicePaymentAppliedEvent(
            this.id,
            this.invoiceNumber.toString(),
            payment.amount,
            payment.paymentDate,
            payment.reference,
            remainingAmount,
            this.createdBy
        ));
        
        // Add to history
        this.addHistoryEvent('PAYMENT_APPLIED', { payment });
    }

    validate(profile: ValidationProfile): ValidationResult {
        const result = this.performValidation(profile);
        
        // Store validation result
        this._validationResults.push(result);
        
        // Add domain event
        this.addDomainEvent(new InvoiceValidatedEvent(
            this.id,
            this.invoiceNumber.toString(),
            profile as unknown as string,  // Cast profile to string for event
            result.isValid,
            result.errors.map(e => e.toString()),  // Convert ValidationIssue to string
            result.warnings.map(w => w.toString()),  // Convert ValidationIssue to string
            this.createdBy
        ));
        
        // Add to history
        this.addHistoryEvent('INVOICE_VALIDATED', { profile, result });
        
        return result;
    }

    generateOutput(format: OutputFormat): Document {
        this.ensureFinalized();
        // Implementation will be added
        return {} as Document;
    }

    // Private helper methods
    private validateLineItem(item: InvoiceLineItem): void {
        if (!item.name) {
            throw new Error('Line item name is required');
        }
        if (!item.quantity || item.quantity.value.lessThanOrEqualTo(0)) {
            throw new Error('Line item quantity must be positive');
        }
        if (!item.unitPrice || item.unitPrice.amount.lessThanOrEqualTo(0)) {
            throw new Error('Line item unit price must be positive');
        }
        if (!item.taxCategory) {
            throw new Error('Line item tax category is required');
        }
    }

    private validateDocumentReference(reference: DocumentReference): void {
        if (!reference) {
            throw new Error('Document reference is required');
        }
        // DocumentReference validation would be done in its own value object
    }

    private validatePayment(payment: Payment): void {
        if (!payment.amount || payment.amount.amount.lessThanOrEqualTo(0)) {
            throw new Error('Payment amount must be positive');
        }
        if (!payment.paymentDate) {
            throw new Error('Payment date is required');
        }
    }

    private ensureNotFinalized(): void {
        if (this.documentStatus === 'FINALIZED') {
            throw new Error('Cannot modify finalized invoice');
        }
    }

    private ensureFinalized(): void {
        if (this.documentStatus !== 'FINALIZED') {
            throw new Error('Invoice must be finalized before this operation');
        }
    }

    private validateForFinalization(): void {
        if (this._lineItems.length === 0) {
            throw new Error('Invoice must have at least one line item');
        }
        if (!this.seller) {
            throw new Error('Seller information is required');
        }
        if (!this.buyer) {
            throw new Error('Buyer information is required');
        }
        if (!this.issueDate) {
            throw new Error('Issue date is required');
        }
    }

    private recalculateTotals(): void {
        // This would be implemented with proper business logic
        // For now, just a placeholder
        // The totals would be recalculated based on line items, tax rates, etc.
    }

    private calculateRemainingAmount(payment: Payment): Money {
        // This would be implemented with proper business logic
        // For now, return a placeholder
        return new Money(new Decimal(0), this.currency);
    }

    private performValidation(profile: ValidationProfile): ValidationResult {
        // This would be implemented with proper validation logic
        // For now, create a proper ValidationResult using static method
        return ValidationResult.success(profile as unknown as string, [], []);
    }

    private addDomainEvent(event: DomainEvent): void {
        this._domainEvents.push(event);
    }

    private addHistoryEvent(eventType: string, data: any): void {
        // InvoiceEvent needs to be properly instantiated
        // For now, we'll use a simplified approach
        const event = {
            id: this.generateEventId(),
            invoiceId: this.id,
            eventType: eventType,
            data: data,
            timestamp: new Date() as Timestamp,
            userId: this.createdBy
        };
        
        // Cast to InvoiceEvent - this should be replaced with proper constructor
        this._history.push(event as unknown as InvoiceEvent);
    }

    private generateEventId(): string {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Method to clear domain events after processing
    clearDomainEvents(): void {
        this._domainEvents = [];
    }
}