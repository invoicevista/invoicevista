import { DocumentStatus, PaymentStatus, TransmissionStatus } from '../types';

/**
 * InvoiceEvent Entity
 * Represents an event in the invoice lifecycle for audit trail
 */
export class InvoiceEvent {
  constructor(
    public readonly id: string,
    public readonly timestamp: Date,
    public readonly eventType: InvoiceEventType,
    public readonly description: string,
    public readonly userId?: string,
    public readonly userName?: string,
    public readonly previousStatus?: DocumentStatus | PaymentStatus | TransmissionStatus,
    public readonly newStatus?: DocumentStatus | PaymentStatus | TransmissionStatus,
    public readonly metadata?: Record<string, any>,
    public readonly ipAddress?: string,
    public readonly userAgent?: string
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.eventType) {
      throw new Error('Event type is required');
    }

    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Event description is required');
    }

    if (this.timestamp > new Date()) {
      throw new Error('Event timestamp cannot be in the future');
    }
  }

  isUserAction(): boolean {
    return this.userId !== undefined && this.userId !== null;
  }

  isSystemAction(): boolean {
    return !this.isUserAction();
  }

  isStatusChange(): boolean {
    return this.previousStatus !== undefined && this.newStatus !== undefined;
  }

  getStatusChangeDescription(): string | undefined {
    if (!this.isStatusChange()) {
      return undefined;
    }

    return `${this.previousStatus} → ${this.newStatus}`;
  }

  equals(other: InvoiceEvent): boolean {
    return (
      this.id === other.id &&
      this.timestamp.getTime() === other.timestamp.getTime() &&
      this.eventType === other.eventType
    );
  }

  toString(): string {
    const parts = [
      this.timestamp.toISOString(),
      this.eventType,
      this.description
    ];

    if (this.userName) {
      parts.push(`by ${this.userName}`);
    }

    if (this.isStatusChange()) {
      parts.push(this.getStatusChangeDescription()!);
    }

    return parts.join(' - ');
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp.toISOString(),
      eventType: this.eventType,
      description: this.description,
      userId: this.userId,
      userName: this.userName,
      previousStatus: this.previousStatus,
      newStatus: this.newStatus,
      metadata: this.metadata,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent
    };
  }
}

export enum InvoiceEventType {
  // Creation & Modification
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  
  // Line Items
  LINE_ITEM_ADDED = 'LINE_ITEM_ADDED',
  LINE_ITEM_UPDATED = 'LINE_ITEM_UPDATED',
  LINE_ITEM_REMOVED = 'LINE_ITEM_REMOVED',
  
  // Status Changes
  FINALIZED = 'FINALIZED',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
  
  // Payment Events
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PAYMENT_REVERSED = 'PAYMENT_REVERSED',
  MARKED_AS_PAID = 'MARKED_AS_PAID',
  MARKED_AS_UNPAID = 'MARKED_AS_UNPAID',
  
  // Transmission Events
  QUEUED_FOR_TRANSMISSION = 'QUEUED_FOR_TRANSMISSION',
  TRANSMISSION_STARTED = 'TRANSMISSION_STARTED',
  TRANSMISSION_SUCCEEDED = 'TRANSMISSION_SUCCEEDED',
  TRANSMISSION_FAILED = 'TRANSMISSION_FAILED',
  ACKNOWLEDGMENT_RECEIVED = 'ACKNOWLEDGMENT_RECEIVED',
  
  // Validation Events
  VALIDATION_PASSED = 'VALIDATION_PASSED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  
  // Document Events
  DOCUMENT_GENERATED = 'DOCUMENT_GENERATED',
  DOCUMENT_DOWNLOADED = 'DOCUMENT_DOWNLOADED',
  DOCUMENT_EMAILED = 'DOCUMENT_EMAILED',
  
  // Other
  NOTE_ADDED = 'NOTE_ADDED',
  REMINDER_SENT = 'REMINDER_SENT',
  EXPORTED = 'EXPORTED'
}