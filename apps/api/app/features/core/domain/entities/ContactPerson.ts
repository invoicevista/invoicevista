/**
 * ContactPerson Entity
 * Represents a contact person within a Party
 */
export class ContactPerson {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly department?: string,
    public readonly telephone?: string,
    public readonly email?: string,
    public readonly role?: string
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Contact person name is required');
    }

    if (this.email && !this.isValidEmail(this.email)) {
      throw new Error(`Invalid email address: ${this.email}`);
    }

    if (this.telephone && !this.isValidTelephone(this.telephone)) {
      throw new Error(`Invalid telephone number: ${this.telephone}`);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidTelephone(telephone: string): boolean {
    // Allow various international phone formats
    const phoneRegex = /^[\+\-\(\)\s\d]+$/;
    return phoneRegex.test(telephone) && telephone.replace(/\D/g, '').length >= 7;
  }

  equals(other: ContactPerson): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.department === other.department &&
      this.telephone === other.telephone &&
      this.email === other.email &&
      this.role === other.role
    );
  }

  toString(): string {
    const parts = [this.name];
    if (this.department) parts.push(`(${this.department})`);
    if (this.email) parts.push(this.email);
    if (this.telephone) parts.push(this.telephone);
    return parts.join(' - ');
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      department: this.department,
      telephone: this.telephone,
      email: this.email,
      role: this.role
    };
  }
}