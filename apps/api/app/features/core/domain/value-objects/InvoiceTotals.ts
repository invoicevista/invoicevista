import { Money } from './Money';

/**
 * InvoiceTotals Value Object
 * Represents calculated invoice totals
 */
export class InvoiceTotals {
  constructor(
    public readonly lineNetAmount: Money, // Sum of line net amounts
    public readonly allowanceTotalAmount: Money, // Sum of discounts/allowances
    public readonly chargeTotalAmount: Money, // Sum of additional charges
    public readonly taxExclusiveAmount: Money, // Total before tax
    public readonly taxTotalAmount: Money, // Total tax amount
    public readonly taxInclusiveAmount: Money, // Total including tax
    public readonly prepaidAmount: Money, // Amount already paid
    public readonly roundingAmount: Money, // Rounding adjustment
    public readonly payableAmount: Money // Amount due for payment
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    // Business rule: Total before tax = Sum of line net amounts - allowances + charges
    const calculatedTaxExclusive = this.calculateTaxExclusiveAmount();
    if (!this.taxExclusiveAmount.equals(calculatedTaxExclusive)) {
      throw new Error('Tax exclusive amount must equal line net amount - allowances + charges');
    }

    // Business rule: Total with tax = Total before tax + tax amount
    const calculatedTaxInclusive = this.calculateTaxInclusiveAmount();
    if (!this.taxInclusiveAmount.equals(calculatedTaxInclusive)) {
      throw new Error('Tax inclusive amount must equal tax exclusive amount + tax total');
    }

    // Business rule: Amount due = Total with tax - prepaid + rounding
    const calculatedPayable = this.calculatePayableAmount();
    if (!this.payableAmount.equals(calculatedPayable)) {
      throw new Error('Payable amount must equal tax inclusive - prepaid + rounding');
    }

    // All amounts must be in the same currency
    const currency = this.lineNetAmount.currency;
    const amounts = [
      this.allowanceTotalAmount,
      this.chargeTotalAmount,
      this.taxExclusiveAmount,
      this.taxTotalAmount,
      this.taxInclusiveAmount,
      this.prepaidAmount,
      this.roundingAmount,
      this.payableAmount
    ];

    for (const amount of amounts) {
      if (!amount.currency.equals(currency)) {
        throw new Error('All total amounts must be in the same currency');
      }
    }
  }

  private calculateTaxExclusiveAmount(): Money {
    return this.lineNetAmount
      .subtract(this.allowanceTotalAmount)
      .add(this.chargeTotalAmount);
  }

  private calculateTaxInclusiveAmount(): Money {
    return this.taxExclusiveAmount.add(this.taxTotalAmount);
  }

  private calculatePayableAmount(): Money {
    return this.taxInclusiveAmount
      .subtract(this.prepaidAmount)
      .add(this.roundingAmount);
  }

  static calculate(
    lineNetAmount: Money,
    allowanceTotalAmount: Money,
    chargeTotalAmount: Money,
    taxTotalAmount: Money,
    prepaidAmount: Money,
    roundingAmount: Money
  ): InvoiceTotals {
    const taxExclusiveAmount = lineNetAmount
      .subtract(allowanceTotalAmount)
      .add(chargeTotalAmount);

    const taxInclusiveAmount = taxExclusiveAmount.add(taxTotalAmount);

    const payableAmount = taxInclusiveAmount
      .subtract(prepaidAmount)
      .add(roundingAmount);

    return new InvoiceTotals(
      lineNetAmount,
      allowanceTotalAmount,
      chargeTotalAmount,
      taxExclusiveAmount,
      taxTotalAmount,
      taxInclusiveAmount,
      prepaidAmount,
      roundingAmount,
      payableAmount
    );
  }

  equals(other: InvoiceTotals): boolean {
    return (
      this.lineNetAmount.equals(other.lineNetAmount) &&
      this.allowanceTotalAmount.equals(other.allowanceTotalAmount) &&
      this.chargeTotalAmount.equals(other.chargeTotalAmount) &&
      this.taxExclusiveAmount.equals(other.taxExclusiveAmount) &&
      this.taxTotalAmount.equals(other.taxTotalAmount) &&
      this.taxInclusiveAmount.equals(other.taxInclusiveAmount) &&
      this.prepaidAmount.equals(other.prepaidAmount) &&
      this.roundingAmount.equals(other.roundingAmount) &&
      this.payableAmount.equals(other.payableAmount)
    );
  }
}