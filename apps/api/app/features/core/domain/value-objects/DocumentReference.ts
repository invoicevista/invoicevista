/**
 * DocumentReference Value Object
 * Represents references to other documents
 */
export class DocumentReference {
  constructor(
    public readonly documentNumber: string,
    public readonly documentType?: DocumentType,
    public readonly issueDate?: Date,
    public readonly description?: string,
    public readonly uri?: string // URL or URI to the document
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.documentNumber || this.documentNumber.trim().length === 0) {
      throw new Error('Document number is required');
    }

    if (this.uri && !this.isValidURI(this.uri)) {
      throw new Error(`Invalid URI: ${this.uri}`);
    }

    if (this.issueDate && this.issueDate > new Date()) {
      throw new Error('Document issue date cannot be in the future');
    }
  }

  private isValidURI(uri: string): boolean {
    try {
      new URL(uri);
      return true;
    } catch {
      // Not a valid URL, check if it's a valid URN or other URI scheme
      return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(uri);
    }
  }

  equals(other: DocumentReference): boolean {
    return (
      this.documentNumber === other.documentNumber &&
      this.documentType === other.documentType &&
      this.issueDate?.getTime() === other.issueDate?.getTime() &&
      this.description === other.description &&
      this.uri === other.uri
    );
  }

  toString(): string {
    const parts = [this.documentNumber];
    if (this.documentType) {
      parts.push(`(${this.documentType})`);
    }
    if (this.issueDate) {
      const dateStr = this.issueDate.toISOString();
      const datePart = dateStr.split('T')[0];
      if (datePart) {
        parts.push(datePart);
      }
    }
    return parts.join(' ');
  }

  toJSON() {
    return {
      documentNumber: this.documentNumber,
      documentType: this.documentType,
      issueDate: this.issueDate?.toISOString(),
      description: this.description,
      uri: this.uri
    };
  }
}

export enum DocumentType {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
  CREDIT_NOTE = 'CREDIT_NOTE',
  DEBIT_NOTE = 'DEBIT_NOTE',
  DELIVERY_NOTE = 'DELIVERY_NOTE',
  RECEIPT = 'RECEIPT',
  QUOTATION = 'QUOTATION',
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
  PROFORMA_INVOICE = 'PROFORMA_INVOICE'
}