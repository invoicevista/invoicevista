import { Money } from './Money';

/**
 * Payment Value Object
 * Represents a payment applied to an invoice
 */
export class Payment {
  constructor(
    public readonly amount: Money,
    public readonly paymentDate: Date,
    public readonly paymentMethod: PaymentMethod,
    public readonly reference: string,
    public readonly bankReference?: string,
    public readonly payer?: string,
    public readonly notes?: string
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.amount.isPositive()) {
      throw new Error('Payment amount must be positive');
    }

    if (this.paymentDate > new Date()) {
      throw new Error('Payment date cannot be in the future');
    }

    if (!this.reference || this.reference.trim().length === 0) {
      throw new Error('Payment reference is required');
    }
  }

  equals(other: Payment): boolean {
    return (
      this.amount.equals(other.amount) &&
      this.paymentDate.getTime() === other.paymentDate.getTime() &&
      this.paymentMethod === other.paymentMethod &&
      this.reference === other.reference &&
      this.bankReference === other.bankReference
    );
  }

  toString(): string {
    return `${this.amount.toString()} on ${this.paymentDate.toISOString().split('T')[0]} (${this.reference})`;
  }

  toJSON() {
    return {
      amount: this.amount.toJSON(),
      paymentDate: this.paymentDate.toISOString(),
      paymentMethod: this.paymentMethod,
      reference: this.reference,
      bankReference: this.bankReference,
      payer: this.payer,
      notes: this.notes
    };
  }
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  DIRECT_DEBIT = 'DIRECT_DEBIT',
  CASH = 'CASH',
  CHECK = 'CHECK',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
  OTHER = 'OTHER'
}