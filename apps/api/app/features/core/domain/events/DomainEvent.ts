/**
 * Base Domain Event abstract class providing common functionality for all domain events in the system.
 * Includes event identification, metadata tracking, and standardized serialization for event sourcing.
 * All specific domain events inherit from this class to ensure consistent event structure and behavior.
 */
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;
  public readonly eventVersion: number = 1;

  constructor(
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly eventType: string,
    public readonly userId?: string,
    public readonly metadata?: Record<string, any>
  ) {
    this.occurredOn = new Date();
    this.eventId = this.generateEventId();
  }

  private generateEventId(): string {
    // Simple UUID v4 generation (in production, use a proper UUID library)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  abstract getEventData(): Record<string, any>;

  toJSON() {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      eventVersion: this.eventVersion,
      aggregateId: this.aggregateId,
      aggregateType: this.aggregateType,
      occurredOn: this.occurredOn.toISOString(),
      userId: this.userId,
      data: this.getEventData(),
      metadata: this.metadata
    };
  }
}