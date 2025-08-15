/**
 * ItemClassification Value Object
 * Represents product/service classification codes
 */
export class ItemClassification {
    constructor(
        public readonly scheme: string, // "HS", "CPV", "UNSPSC"
        public readonly code: string,
        public readonly description?: string
    ) {
        this.validate();
        Object.freeze(this);
    }

    private validate(): void {
        if (!this.scheme || this.scheme.trim().length === 0) {
            throw new Error('Classification scheme is required');
        }
        if (!this.code || this.code.trim().length === 0) {
            throw new Error('Classification code is required');
        }
    }

    toString(): string {
        return `${this.scheme}:${this.code}${this.description ? ` (${this.description})` : ''}`;
    }

    toJSON() {
        return {
            scheme: this.scheme,
            code: this.code,
            description: this.description
        };
    }
}