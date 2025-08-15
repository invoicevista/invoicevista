# DDD Blueprint Folder Structure

This document explains the purpose and recommended file types for each folder in the Domain-Driven Design (DDD) blueprint architecture.

## Overview

The DDD blueprint follows a layered architecture with clear separation of concerns:
- **Domain Layer**: Core business logic and rules
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External concerns and technical implementations
- **Presentation Layer**: User interface and API endpoints

---

## 📁 Application Layer (`application/`)

The application layer orchestrates domain objects to fulfill use cases.

### `command-handlers/`
**Purpose**: Handle command execution and coordinate domain operations
**Files to place here**:
- `CreateInvoiceCommandHandler.ts`
- `UpdatePartyCommandHandler.ts`
- `ProcessPaymentCommandHandler.ts`

### `commands/`
**Purpose**: Define command objects that represent user intentions
**Files to place here**:
- `CreateInvoiceCommand.ts`
- `UpdatePartyCommand.ts`
- `ProcessPaymentCommand.ts`

### `dtos/`
**Purpose**: Data Transfer Objects for application layer communication
**Files to place here**:
- `InvoiceDto.ts`
- `PartyDto.ts`
- `PaymentDto.ts`

### `events/`
**Purpose**: Application-level events (different from domain events)
**Files to place here**:
- `InvoiceProcessedEvent.ts`
- `PaymentReceivedEvent.ts`

### `queries/`
**Purpose**: Define query objects for data retrieval
**Files to place here**:
- `GetInvoiceQuery.ts`
- `SearchPartiesQuery.ts`
- `GetPaymentHistoryQuery.ts`

### `query-handlers/`
**Purpose**: Handle query execution and data retrieval
**Files to place here**:
- `GetInvoiceQueryHandler.ts`
- `SearchPartiesQueryHandler.ts`
- `GetPaymentHistoryQueryHandler.ts`

### `services/`
**Purpose**: Application services that coordinate multiple domain services
**Files to place here**:
- `InvoiceApplicationService.ts`
- `PartyApplicationService.ts`
- `PaymentApplicationService.ts`

### `transaction-coordinators/`
**Purpose**: Manage complex transactions across multiple aggregates
**Files to place here**:
- `InvoicePaymentCoordinator.ts`
- `PartyUpdateCoordinator.ts`

### `validators/`
**Purpose**: Application-level validation logic
**Files to place here**:
- `CreateInvoiceValidator.ts`
- `UpdatePartyValidator.ts`

### `workflows/`
**Purpose**: Complex business workflows and process managers
**Files to place here**:
- `InvoiceProcessingWorkflow.ts`
- `PaymentProcessingWorkflow.ts`

---

## 📁 Domain Layer (`domain/`)

The domain layer contains the core business logic and rules.

### `aggregates/`
**Purpose**: Root entities that maintain consistency boundaries
**Files to place here**:
- `Invoice.ts`
- `Party.ts`
- `Payment.ts`

### `entities/`
**Purpose**: Domain entities with identity and lifecycle
**Files to place here**:
- `InvoiceLineItem.ts`
- `ContactPerson.ts`
- `BankAccount.ts`

### `events/`
**Purpose**: Domain events that represent business occurrences
**Files to place here**:
- `InvoiceCreatedEvent.ts`
- `PaymentProcessedEvent.ts`
- `PartyUpdatedEvent.ts`

### `exceptions/`
**Purpose**: Domain-specific exceptions and errors
**Files to place here**:
- `InvalidInvoiceException.ts`
- `PartyNotFoundException.ts`
- `PaymentValidationException.ts`

### `factories/`
**Purpose**: Create complex domain objects with proper initialization
**Files to place here**:
- `InvoiceFactory.ts`
- `PartyFactory.ts`
- `PaymentFactory.ts`

### `policies/`
**Purpose**: Business rules and policies that can be applied across entities
**Files to place here**:
- `InvoiceValidationPolicy.ts`
- `PaymentTermsPolicy.ts`
- `TaxCalculationPolicy.ts`

### `repositories/`
**Purpose**: Interface definitions for data persistence (contracts only)
**Files to place here**:
- `IInvoiceRepository.ts`
- `IPartyRepository.ts`
- `IPaymentRepository.ts`

### `services/`
**Purpose**: Domain services for business logic that doesn't fit in entities
**Files to place here**:
- `TaxCalculationService.ts`
- `InvoiceNumberGenerator.ts`
- `PaymentValidator.ts`

### `specifications/`
**Purpose**: Encapsulate business rules for querying and validation
**Files to place here**:
- `OverdueInvoiceSpecification.ts`
- `ValidPartySpecification.ts`
- `CompletedPaymentSpecification.ts`

### `value-objects/`
**Purpose**: Immutable objects that represent domain concepts
**Files to place here**:
- `Money.ts`
- `Address.ts`
- `InvoiceNumber.ts`
- `TaxRate.ts`

---

## 📁 Infrastructure Layer (`infrastructure/`)

The infrastructure layer handles external concerns and technical implementations.

### `caching/`
**Purpose**: Caching implementations and configurations
**Files to place here**:
- `RedisCacheService.ts`
- `InMemoryCacheService.ts`
- `CacheConfiguration.ts`

### `configuration/`
**Purpose**: Application configuration and settings
**Files to place here**:
- `DatabaseConfig.ts`
- `ApiConfig.ts`
- `FeatureFlags.ts`

### `data-mappers/`
**Purpose**: Map between domain objects and persistence models
**Files to place here**:
- `InvoiceDataMapper.ts`
- `PartyDataMapper.ts`
- `PaymentDataMapper.ts`

### `database-contexts/`
**Purpose**: Database contexts and connection management
**Files to place here**:
- `InvoiceDbContext.ts`
- `PartyDbContext.ts`
- `ApplicationDbContext.ts`

### `email-notification/`
**Purpose**: Email service implementations
**Files to place here**:
- `EmailService.ts`
- `InvoiceEmailTemplate.ts`
- `PaymentNotificationEmail.ts`

### `event-publishers/`
**Purpose**: Event publishing and messaging implementations
**Files to place here**:
- `DomainEventPublisher.ts`
- `RabbitMQEventPublisher.ts`
- `EventStorePublisher.ts`

### `external-adapters/`
**Purpose**: Adapters for external services and APIs
**Files to place here**:
- `PaymentGatewayAdapter.ts`
- `TaxServiceAdapter.ts`
- `BankingApiAdapter.ts`

### `file-system/`
**Purpose**: File storage and management implementations
**Files to place here**:
- `FileStorageService.ts`
- `S3StorageAdapter.ts`
- `LocalFileService.ts`

### `logging/`
**Purpose**: Logging implementations and configurations
**Files to place here**:
- `ApplicationLogger.ts`
- `StructuredLogger.ts`
- `LoggingConfiguration.ts`

### `message-queues/`
**Purpose**: Message queue implementations and handlers
**Files to place here**:
- `RabbitMQService.ts`
- `InvoiceMessageHandler.ts`
- `PaymentMessageHandler.ts`

### `persistence-models/`
**Purpose**: Database/ORM models and schemas
**Files to place here**:
- `InvoicePersistenceModel.ts`
- `PartyPersistenceModel.ts`
- `PaymentPersistenceModel.ts`

### `repositories/`
**Purpose**: Concrete implementations of domain repository interfaces
**Files to place here**:
- `SqlInvoiceRepository.ts`
- `MongoPartyRepository.ts`
- `InMemoryPaymentRepository.ts`

---

## 📁 Presentation Layer (`presentation/`)

The presentation layer handles user interface and external communication.

### `api-docs/`
**Purpose**: API documentation and OpenAPI specifications
**Files to place here**:
- `InvoiceApiDocs.ts`
- `PartyApiDocs.ts`
- `OpenApiSpec.ts`

### `api-models/`
**Purpose**: API request/response models and schemas
**Files to place here**:
- `CreateInvoiceRequest.ts`
- `InvoiceResponse.ts`
- `PartyRequest.ts`

### `controllers/`
**Purpose**: HTTP controllers and route handlers
**Files to place here**:
- `InvoiceController.ts`
- `PartyController.ts`
- `PaymentController.ts`

### `exception-handlers/`
**Purpose**: Handle and format exceptions for API responses
**Files to place here**:
- `GlobalExceptionHandler.ts`
- `ValidationExceptionHandler.ts`
- `DomainExceptionHandler.ts`

### `formatters/`
**Purpose**: Format data for presentation layer consumption
**Files to place here**:
- `InvoiceFormatter.ts`
- `DateTimeFormatter.ts`
- `CurrencyFormatter.ts`

### `middlewares/`
**Purpose**: HTTP middleware for cross-cutting concerns
**Files to place here**:
- `AuthenticationMiddleware.ts`
- `RateLimitMiddleware.ts`
- `LoggingMiddleware.ts`

### `request-mappings/`
**Purpose**: Map HTTP requests to application commands/queries
**Files to place here**:
- `CreateInvoiceRequestMapping.ts`
- `UpdatePartyRequestMapping.ts`

### `response-mappings/`
**Purpose**: Map application results to HTTP responses
**Files to place here**:
- `InvoiceResponseMapping.ts`
- `PartyResponseMapping.ts`
- `ErrorResponseMapping.ts`

### `serializers/`
**Purpose**: Serialize/deserialize data for API communication
**Files to place here**:
- `JsonSerializer.ts`
- `XmlSerializer.ts`
- `InvoiceSerializer.ts`

### `ui-components/`
**Purpose**: UI components for web interfaces (if applicable)
**Files to place here**:
- `InvoiceFormComponent.ts`
- `PartyListComponent.ts`
- `PaymentStatusComponent.ts`

### `validators/`
**Purpose**: Request validation and input sanitization
**Files to place here**:
- `CreateInvoiceRequestValidator.ts`
- `UpdatePartyRequestValidator.ts`
- `ApiKeyValidator.ts`

### `view-models/`
**Purpose**: Models optimized for presentation layer consumption
**Files to place here**:
- `InvoiceViewModel.ts`
- `PartyListViewModel.ts`
- `DashboardViewModel.ts`

---

## 🔗 Index Files

Each layer contains an `index.ts` file that should export the main interfaces and classes from that layer:

- `application/index.ts`: Export application services, command handlers, and DTOs
- `domain/index.ts`: Export aggregates, entities, value objects, and repository interfaces
- `infrastructure/index.ts`: Export repository implementations and external adapters
- `presentation/index.ts`: Export controllers, API models, and presentation services

---

## 📋 Best Practices

1. **Keep layers isolated**: Don't import from layers above (domain shouldn't import from application)
2. **Use dependency injection**: Infrastructure implementations should be injected into domain services
3. **Follow naming conventions**: Use descriptive names that clearly indicate the file's purpose
4. **Maintain consistency**: Follow the same patterns across all features
5. **Document complex logic**: Add comments for complex business rules and domain logic