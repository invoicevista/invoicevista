/**
 * Invoice-specific domain events that capture all significant state changes and business operations within the invoice lifecycle.
 * These events enable event sourcing, audit trails, and integration with external systems through event-driven architecture.
 * Each event contains relevant data needed for downstream processing and maintains complete traceability of invoice operations.
 */

import { DomainEvent } from '@/app/features/core/domain/events/DomainEvent';
import { Money } from '@/app/features/core/domain/value-objects/Money';
import { InvoiceLineItem } from '../entities/InvoiceLineItem';

/**
 * Invoice Created Event
 * Fired when a new invoice is created in draft status
 */
export class InvoiceCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly invoiceNumber: string,
    public readonly sellerId: string,
    public readonly buyerId: string,
    public readonly currency: string,
    userId?: string
  ) {
    super(aggregateId, 'Invoice', 'InvoiceCreated', userId);
  }

  getEventData() {
    return {
      invoiceNumber: this.invoiceNumber,
      sellerId: this.sellerId,
      buyerId: this.buyerId,
      currency: this.currency
    };
  }
}

/**
 * Invoice Line Item Added Event
 * Fired when a line item is added to an invoice
 */
export class InvoiceLineItemAddedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly lineItemId: string,
    public readonly productName: string,
    public readonly quantity: number,
    public readonly unitPrice: Money,
    userId?: string
  ) {
    super(aggregateId, 'Invoice', 'InvoiceLineItemAdded', userId);
  }

  getEventData() {
    return {
      lineItemId: this.lineItemId,
      productName: this.productName,
      quantity: this.quantity,
      unitPrice: this.unitPrice.toJSON()
    };
  }
}

/**
 * Invoice Line Item Removed Event
 * Fired when a line item is removed from an invoice
 */
export class InvoiceLineItemRemovedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly lineItemId: string,
    public readonly productName: string,
    userId?: string
  ) {
    super(aggregateId, 'Invoice', 'InvoiceLineItemRemoved', userId);
  }

  getEventData() {
    return {
      lineItemId: this.lineItemId,
      productName: this.productName
    };
  }
}

/**
 * Invoice Line Item Updated Event
 * Fired when a line item is updated in an invoice
 */
export class InvoiceLineItemUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly lineItemId: string,
    public readonly updates: Partial<InvoiceLineItem>,
    userId?: string
  ) {
    super(aggregateId, 'Invoice', 'InvoiceLineItemUpdated', userId);
  }

  getEventData() {
    return {
      lineItemId: this.lineItemId,
      updates: this.updates
    };
  }
}

/**
 * Invoice Finalized Event
 * Fired when an invoice is finalized (locked from editing)
 */
export class InvoiceFinalizedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly invoiceNumber: string,
    public readonly totalAmount: Money,
    public readonly finalizedAt: Date,
    userId?: string
  ) {
    super(aggregateId, 'Invoice', 'InvoiceFinalized', userId);
  }

  getEventData() {
    return {
      invoiceNumber: this.invoiceNumber,
      totalAmount: this.totalAmount.toJSON(),
      finalizedAt: this.finalizedAt.toISOString()
    };
  }
}

/**
 * Invoice Sent Event
 * Fired when an invoice is sent to the recipient
 */
export class InvoiceSentEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly invoiceNumber: string,
    public readonly recipientAddress: string,
    public readonly transmissionMethod: string,
    public readonly sentAt: Date,
    userId?: string
  ) {
    super(aggregateId, 'Invoice', 'InvoiceSent', userId);
  }

  getEventData() {
    return {
      invoiceNumber: this.invoiceNumber,
      recipientAddress: this.recipientAddress,
      transmissionMethod: this.transmissionMethod,
      sentAt: this.sentAt.toISOString()
    };
  }
}

/**
 * Invoice Viewed Event
 * Fired when an invoice is viewed by the recipient
 */
export class InvoiceViewedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly invoiceNumber: string,
    public readonly viewedBy: string,
    public readonly viewedAt: Date,
    public readonly ipAddress?: string
  ) {
    super(aggregateId, 'Invoice', 'InvoiceViewed');
  }

  getEventData() {
    return {
      invoiceNumber: this.invoiceNumber,
      viewedBy: this.viewedBy,
      viewedAt: this.viewedAt.toISOString(),
      ipAddress: this.ipAddress
    };
  }
}

/**
 * Invoice Payment Applied Event
 * Fired when a payment is applied to an invoice
 */
export class InvoicePaymentAppliedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly invoiceNumber: string,
    public readonly paymentAmount: Money,
    public readonly paymentDate: Date,
    public readonly paymentReference: string,
    public readonly remainingAmount: Money,
    userId?: string
  ) {
    super(aggregateId, 'Invoice', 'InvoicePaymentApplied', userId);
  }

  getEventData() {
    return {
      invoiceNumber: this.invoiceNumber,
      paymentAmount: this.paymentAmount.toJSON(),
      paymentDate: this.paymentDate.toISOString(),
      paymentReference: this.paymentReference,
      remainingAmount: this.remainingAmount.toJSON()
    };
  }
}

/**
 * Invoice Paid Event
 * Fired when an invoice is fully paid
 */
export class InvoicePaidEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly invoiceNumber: string,
    public readonly totalPaid: Money,
    public readonly paidAt: Date,
    userId?: string
  ) {
    super(aggregateId, 'Invoice', 'InvoicePaid', userId);
  }

  getEventData() {
    return {
      invoiceNumber: this.invoiceNumber,
      totalPaid: this.totalPaid.toJSON(),
      paidAt: this.paidAt.toISOString()
    };
  }
}

/**
 * Invoice Cancelled Event
 * Fired when an invoice is cancelled
 */
export class InvoiceCancelledEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly invoiceNumber: string,
    public readonly reason: string,
    public readonly cancelledAt: Date,
    userId?: string
  ) {
    super(aggregateId, 'Invoice', 'InvoiceCancelled', userId);
  }

  getEventData() {
    return {
      invoiceNumber: this.invoiceNumber,
      reason: this.reason,
      cancelledAt: this.cancelledAt.toISOString()
    };
  }
}

/**
 * Invoice Validated Event
 * Fired when an invoice passes validation
 */
export class InvoiceValidatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly invoiceNumber: string,
    public readonly validationProfile: string,
    public readonly isValid: boolean,
    public readonly errors: string[],
    public readonly warnings: string[],
    userId?: string
  ) {
    super(aggregateId, 'Invoice', 'InvoiceValidated', userId);
  }

  getEventData() {
    return {
      invoiceNumber: this.invoiceNumber,
      validationProfile: this.validationProfile,
      isValid: this.isValid,
      errors: this.errors,
      warnings: this.warnings
    };
  }
}

/**
 * Invoice Transmission Queued Event
 * Fired when an invoice is queued for transmission
 */
export class InvoiceTransmissionQueuedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly invoiceNumber: string,
    public readonly transmissionJobId: string,
    public readonly recipientId: string,
    public readonly format: string,
    userId?: string
  ) {
    super(aggregateId, 'Invoice', 'InvoiceTransmissionQueued', userId);
  }

  getEventData() {
    return {
      invoiceNumber: this.invoiceNumber,
      transmissionJobId: this.transmissionJobId,
      recipientId: this.recipientId,
      format: this.format
    };
  }
}

/**
 * Invoice Acknowledged Event
 * Fired when an MLR acknowledgment is received
 */
export class InvoiceAcknowledgedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly invoiceNumber: string,
    public readonly acknowledgmentId: string,
    public readonly status: 'ACCEPTED' | 'REJECTED',
    public readonly reason?: string,
    public readonly acknowledgedAt?: Date
  ) {
    super(aggregateId, 'Invoice', 'InvoiceAcknowledged');
  }

  getEventData() {
    return {
      invoiceNumber: this.invoiceNumber,
      acknowledgmentId: this.acknowledgmentId,
      status: this.status,
      reason: this.reason,
      acknowledgedAt: this.acknowledgedAt?.toISOString()
    };
  }
}