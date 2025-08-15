/**
 * Base factory interface defining the contract for creating and reconstituting domain aggregates from parameters.
 * Provides standardized methods for aggregate creation with validation and reconstitution from persistent storage.
 * All domain aggregate factories implement this interface to ensure consistent creation patterns and validation rules.
 */
export interface IFactory<TAggregate, TParams> {
    /**
     * Creates a new instance of the aggregate with default values
     */
    create(params: TParams): TAggregate;
    
    /**
     * Creates a new instance from existing data (e.g., database)
     */
    reconstitute(data: any): TAggregate;
    
    /**
     * Validates the creation parameters
     */
    validate(params: TParams): void;
}

/**
 * Abstract base factory with common functionality
 */
export abstract class BaseFactory<TAggregate, TParams> implements IFactory<TAggregate, TParams> {
    protected abstract doCreate(params: TParams): TAggregate;
    protected abstract doReconstitute(data: any): TAggregate;
    protected abstract doValidate(params: TParams): void;
    
    create(params: TParams): TAggregate {
        this.validate(params);
        return this.doCreate(params);
    }
    
    reconstitute(data: any): TAggregate {
        if (!data) {
            throw new Error('Data is required for reconstitution');
        }
        return this.doReconstitute(data);
    }
    
    validate(params: TParams): void {
        if (!params) {
            throw new Error('Parameters are required');
        }
        this.doValidate(params);
    }
}