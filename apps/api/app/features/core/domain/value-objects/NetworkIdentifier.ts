/**
 * NetworkIdentifier Value Object
 * Represents a participant identifier in an electronic invoicing network
 */
export class NetworkIdentifier {
  constructor(
    public readonly scheme: string, // Scheme identifier
    public readonly identifier: string // Participant identifier
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.scheme || this.scheme.trim().length === 0) {
      throw new Error('Network scheme is required');
    }

    if (!this.identifier || this.identifier.trim().length === 0) {
      throw new Error('Network identifier is required');
    }
  }

  getParticipantIdentifier(): string {
    return `${this.scheme}:${this.identifier}`;
  }

  getNetworkAddress(): string {
    return this.getParticipantIdentifier();
  }

  equals(other: NetworkIdentifier): boolean {
    return (
      this.scheme === other.scheme &&
      this.identifier === other.identifier
    );
  }

  toString(): string {
    return this.getParticipantIdentifier();
  }

  toJSON() {
    return {
      scheme: this.scheme,
      identifier: this.identifier,
      participantId: this.getParticipantIdentifier()
    };
  }

  static fromParticipantIdentifier(participantId: string): NetworkIdentifier {
    const parts = participantId.split(':');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error(`Invalid network participant identifier: ${participantId}`);
    }
    
    return new NetworkIdentifier(parts[0], parts[1]);
  }
}