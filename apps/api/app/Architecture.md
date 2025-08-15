# DDD Architecture Layers Reference Guide

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Controllers, Views, API Endpoints)    │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│   (Use Cases, Orchestration, DTOs)     │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│           Domain Layer                  │
│    (Entities, Business Logic, Rules)   │
└─────────────────────────────────────────┘
                 ↑
┌─────────────────────────────────────────┐
│        Infrastructure Layer             │
│   (Database, External APIs, Email)     │
└─────────────────────────────────────────┘
```

**Key Principle**: Domain layer has NO dependencies. Other layers depend on it.

---

## Domain Layer
*The heart of the business logic - pure and framework-agnostic*

### Entities
Objects with unique identity that persist over time.
```typescript
export class Order {
    private readonly id: OrderId;
    private readonly createdAt: Date;
    private status: OrderStatus;
    
    constructor(id: OrderId, customerId: CustomerId) {
        this.id = id;
        this.createdAt = new Date();
        this.status = OrderStatus.Pending;
    }
}
```

### Value Objects
Immutable objects without identity, compared by value.
```typescript
export class Money {
    constructor(
        public readonly amount: number,
        public readonly currency: string
    ) {
        if (amount < 0) throw new Error('Amount cannot be negative');
    }
    
    equals(other: Money): boolean {
        return this.amount === other.amount && 
               this.currency === other.currency;
    }
}
```

### Aggregates & Aggregate Roots
Consistency boundaries with a single entry point.
```typescript
export class ShoppingCart { // Aggregate Root
    private items: CartItem[] = [];
    
    addItem(product: Product, quantity: number): void {
        // Enforces business rules
        if (quantity <= 0) throw new Error('Quantity must be positive');
        this.items.push(new CartItem(product, quantity));
    }
}
```

### Domain Services
Stateless operations that don't belong to entities.
```typescript
export class PricingService {
    calculateDiscount(order: Order, policy: DiscountPolicy): Money {
        const basePrice = order.getTotalPrice();
        return policy.apply(basePrice);
    }
}
```

### Domain Events
Captures something important that happened.
```typescript
// Interface: IDomainEvent is defined in Domain layer
export class OrderPlacedEvent implements IDomainEvent {
    constructor(
        public readonly orderId: OrderId,
        public readonly occurredOn: Date = new Date()
    ) {}
}
```

### Repository Interfaces
**Defined here, implemented in Infrastructure layer**.
```typescript
export interface IOrderRepository {
    getById(id: OrderId): Promise<Order | null>;
    save(order: Order): Promise<void>;
    findByCustomer(customerId: CustomerId): Promise<Order[]>;
}
```

### Specifications
Encapsulated business rules for queries/validation.
```typescript
// Interface: ISpecification<T> is defined in Domain layer
export class PremiumCustomerSpecification implements ISpecification<Customer> {
    isSatisfiedBy(customer: Customer): boolean {
        return customer.totalPurchases > 10000;
    }
}
```

### Domain Exceptions
Business rule violations.
```typescript
export class InsufficientInventoryException extends DomainException {
    constructor(productId: ProductId, requested: number, available: number) {
        super(`Insufficient inventory for product ${productId}`);
    }
}
```

---

## Application Layer
*Orchestrates domain objects and coordinates workflows*

### Application Services
Coordinates use cases using domain objects.
```typescript
export class OrderService {
    constructor(
        private orderRepo: IOrderRepository,
        private eventBus: IEventBus
    ) {}
    
    async placeOrder(command: PlaceOrderCommand): Promise<void> {
        const order = new Order(command.customerId, command.items);
        await this.orderRepo.save(order);
        await this.eventBus.publish(new OrderPlacedEvent(order.id));
    }
}
```

### Commands & Command Handlers
Intentions to change state.
```typescript
export class PlaceOrderCommand {
    constructor(
        public readonly customerId: CustomerId,
        public readonly items: OrderItemDto[]
    ) {}
}

// Interface: ICommandHandler<T> is defined in Application layer
export class PlaceOrderCommandHandler implements ICommandHandler<PlaceOrderCommand> {
    async handle(command: PlaceOrderCommand): Promise<void> {
        // Orchestrate the use case
    }
}
```

### Queries & Query Handlers
Read-only data requests.
```typescript
export class GetOrderByIdQuery {
    constructor(public readonly orderId: OrderId) {}
}

// Interface: IQueryHandler<TQuery, TResult> is defined in Application layer
export class GetOrderByIdQueryHandler implements IQueryHandler<GetOrderByIdQuery, OrderDto> {
    async handle(query: GetOrderByIdQuery): Promise<OrderDto> {
        const order = await this.orderRepo.getById(query.orderId);
        return this.mapper.toDto(order);
    }
}
```

### DTOs (Data Transfer Objects)
Simple data containers for layer communication.
```typescript
export interface OrderDto {
    id: string;
    customerName: string;
    total: number;
    items: OrderItemDto[];
}
```

### Application Events
Notify other parts of the system.
```typescript
// Interface: IApplicationEvent is defined in Application layer
export class OrderProcessedEvent implements IApplicationEvent {
    constructor(
        public readonly orderId: string,
        public readonly notificationEmail: string
    ) {}
}
```

---

## Infrastructure Layer
*Technical implementations and external integrations*

### Repository Implementations
**Implements interfaces defined in Domain layer**.
```typescript
// Interface: IOrderRepository is defined in Domain layer
// Implementation: OrderRepository is in Infrastructure layer
export class OrderRepository implements IOrderRepository {
    constructor(private db: Database) {}
    
    async getById(id: OrderId): Promise<Order | null> {
        const data = await this.db.orders.findOne({ id: id.value });
        return data ? OrderMapper.toDomain(data) : null;
    }
    
    async save(order: Order): Promise<void> {
        const data = OrderMapper.toPersistence(order);
        await this.db.orders.upsert(data);
    }
}
```

### Data Mappers
Convert between domain and persistence models.
```typescript
export class OrderMapper {
    static toDomain(data: OrderPersistenceModel): Order {
        return new Order(
            new OrderId(data.id),
            new CustomerId(data.customer_id)
        );
    }
    
    static toPersistence(order: Order): OrderPersistenceModel {
        return {
            id: order.id.value,
            customer_id: order.customerId.value,
            status: order.status
        };
    }
}
```

### External Service Adapters
Integrate with third-party APIs.
```typescript
// Interface: IPaymentService is defined in Domain or Application layer
// Implementation: PaymentGatewayAdapter is in Infrastructure layer
export class PaymentGatewayAdapter implements IPaymentService {
    constructor(private apiKey: string) {}
    
    async processPayment(amount: Money, token: string): Promise<PaymentResult> {
        const response = await fetch('https://payment-api.com/charge', {
            method: 'POST',
            body: JSON.stringify({ amount: amount.amount, token })
        });
        return response.json();
    }
}
```

### Event Publishers
Publish domain/application events.
```typescript
// Interface: IEventBus is defined in Application layer
// Implementation: EventBus is in Infrastructure layer
export class EventBus implements IEventBus {
    constructor(private messageBroker: MessageBroker) {}
    
    async publish<T extends DomainEvent>(event: T): Promise<void> {
        await this.messageBroker.send(event.constructor.name, event);
    }
}
```

### Caching Services
Implement caching strategies.
```typescript
// Interface: ICacheService is defined in Application layer
// Implementation: RedisCacheService is in Infrastructure layer
export class RedisCacheService implements ICacheService {
    constructor(private redis: RedisClient) {}
    
    async get<T>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }
    
    async set<T>(key: string, value: T, ttl: number): Promise<void> {
        await this.redis.setex(key, ttl, JSON.stringify(value));
    }
}
```

---

## Presentation Layer
*User interface and API endpoints*

### Controllers/Endpoints
Handle HTTP requests and route to application services.
```typescript
@Controller('/orders')
export class OrderController {
    constructor(
        private commandBus: ICommandBus,
        private queryBus: IQueryBus
    ) {}
    
    @Post('/')
    async createOrder(@Body() request: CreateOrderRequest): Promise<Response> {
        const command = new PlaceOrderCommand(
            request.customerId,
            request.items
        );
        await this.commandBus.execute(command);
        return { status: 'success' };
    }
    
    @Get('/:id')
    async getOrder(@Param('id') id: string): Promise<OrderViewModel> {
        const query = new GetOrderByIdQuery(new OrderId(id));
        const order = await this.queryBus.execute(query);
        return OrderViewModelMapper.fromDto(order);
    }
}
```

### View Models
Data optimized for UI presentation.
```typescript
export interface OrderViewModel {
    id: string;
    customerName: string;
    displayTotal: string; // Formatted for display
    statusBadge: string;
    items: OrderItemViewModel[];
}
```

### API Request/Response Models
Contracts for API communication.
```typescript
export interface CreateOrderRequest {
    customerId: string;
    items: Array<{
        productId: string;
        quantity: number;
    }>;
}

export interface OrderResponse {
    id: string;
    status: 'pending' | 'confirmed' | 'shipped';
    total: number;
    createdAt: string;
}
```

### Validators
Input validation at API boundaries.
```typescript
// Interface: IValidator<T> is defined in Presentation layer
export class CreateOrderValidator implements IValidator<CreateOrderRequest> {
    validate(request: CreateOrderRequest): ValidationResult {
        const errors: string[] = [];
        
        if (!request.customerId) {
            errors.push('Customer ID is required');
        }
        
        if (!request.items || request.items.length === 0) {
            errors.push('Order must contain at least one item');
        }
        
        return { isValid: errors.length === 0, errors };
    }
}
```

### Exception Handlers
Convert domain exceptions to HTTP responses.
```typescript
@ExceptionHandler()
export class GlobalExceptionHandler {
    handle(error: Error): HttpResponse {
        if (error instanceof InsufficientInventoryException) {
            return {
                status: 400,
                body: { error: 'INSUFFICIENT_INVENTORY', message: error.message }
            };
        }
        
        if (error instanceof OrderNotFoundException) {
            return {
                status: 404,
                body: { error: 'ORDER_NOT_FOUND' }
            };
        }
        
        // Default error response
        return {
            status: 500,
            body: { error: 'INTERNAL_SERVER_ERROR' }
        };
    }
}
```

---

## Layer Communication & Dependencies

### Key Relationships

1. **Repository Pattern Bridge**
    - Interface defined in Domain layer: `IOrderRepository`
    - Implementation in Infrastructure layer: `OrderRepository`
    - Used by Application layer: `OrderService`

2. **Event Flow**
    - Domain Events raised in Domain layer
    - Published by Application layer
    - Infrastructure handles the actual publishing mechanism

3. **Data Transformation Pipeline**
   ```
   API Request → Validation → Command → Domain Model → Persistence Model
                                           ↓
   API Response ← View Model ← DTO ← Domain Model
   ```

4. **Dependency Rules**
    - ✅ Presentation → Application (Controllers use Services)
    - ✅ Application → Domain (Services use Entities)
    - ✅ Infrastructure → Domain (Implements interfaces)
    - ❌ Domain → Any other layer (Domain is pure)
    - ❌ Application → Infrastructure (Only through interfaces)

### Example: Complete Order Flow

```typescript
// 1. Presentation Layer receives request
const request: CreateOrderRequest = { customerId: "123", items: [...] };

// 2. Controller creates Command
const command = new PlaceOrderCommand(customerId, items);

// 3. Application Service orchestrates
class OrderService {
    async placeOrder(command: PlaceOrderCommand) {
        // Create domain entity
        const order = Order.create(command.customerId, command.items);
        
        // Use repository (interface from Domain, implementation from Infrastructure)
        await this.orderRepository.save(order);
        
        // Publish event
        await this.eventBus.publish(new OrderPlacedEvent(order.id));
    }
}

// 4. Infrastructure persists data
class OrderRepository {
    async save(order: Order) {
        const persistenceModel = OrderMapper.toPersistence(order);
        await this.db.save(persistenceModel);
    }
}
```

This architecture ensures clear separation of concerns, testability, and maintainability while keeping the business logic pure and framework-agnostic.