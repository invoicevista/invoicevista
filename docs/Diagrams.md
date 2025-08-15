# Diagrams
## Domain Model - Core Aggregates and Entities
```mermaid
erDiagram
    Invoice ||--o{ InvoiceLineItem : contains
    Invoice ||--|| PartySnapshot : "has seller"
    Invoice ||--|| PartySnapshot : "has buyer"
    Invoice ||--o| PartySnapshot : "has payee"
    Invoice ||--o| PartySnapshot : "has tax representative"
    Invoice ||--|| InvoiceTotals : calculates
    Invoice ||--o{ TaxBreakdown : "has tax breakdown"
    Invoice ||--o{ ValidationResult : "has validation"
    Invoice ||--o{ InvoiceEvent : "tracks history"
    Invoice ||--o| TransmissionJob : "queued for transmission"
    
    InvoiceLineItem ||--o{ AllowanceCharge : "has discounts/charges"
    InvoiceLineItem ||--o{ ItemClassification : "classified as"
    InvoiceLineItem ||--|| TaxCategory : "has tax category"
    
    Party ||--o{ PartyIdentifier : "identified by"
    Party ||--o{ Address : "located at"
    Party ||--o{ ContactPerson : "contact through"
    Party ||--o{ BankAccount : "paid via"
    Party ||--|| PartySnapshot : "creates snapshot"
    
    TransmissionJob ||--o{ TransmissionAttempt : "tracks attempts"
    TransmissionJob ||--o| MLRAcknowledgment : "receives acknowledgment"
    
    TaxScheme ||--o{ TaxRate : "defines rates"
    TaxScheme ||--o{ TaxExemptionReason : "allows exemptions"
```

## Invoice Lifecycle Workflow
```mermaid
stateDiagram-v2
    [*] --> Draft: Create Invoice
    
    Draft --> Draft: Edit/Add Items/Validate
    Draft --> Finalized: Finalize (lock data)
    
    Finalized --> Queued: Queue for Transmission
    Finalized --> Cancelled: Cancel Invoice
    
    Queued --> Transmitting: Process Queue
    
    Transmitting --> Sent: Transmission Success
    Transmitting --> Failed: Transmission Error
    
    Failed --> Queued: Retry
    Failed --> Cancelled: Give Up
    
    Sent --> Acknowledged: MLR Received
    Sent --> Rejected: Negative MLR
    
    Rejected --> Draft: Create Correction
    
    Acknowledged --> Viewed: Recipient Opened
    
    Viewed --> PartiallyPaid: Partial Payment
    Viewed --> Paid: Full Payment
    
    PartiallyPaid --> Paid: Remaining Payment
    
    Paid --> [*]: Complete
    Cancelled --> [*]: Complete
```

## Validation Pipeline

```mermaid
flowchart TD
    Start([Invoice to Validate]) --> GetProfile[Determine Validation Profile]
    
    GetProfile --> XSD[XSD Schema Validation]
    
    XSD -->|Pass| Schematron[Schematron Business Rules]
    XSD -->|Fail| Fail1[Return Syntax Errors]
    
    Schematron -->|Pass| BR[EN16931 Business Rules<br/>BR-1 to BR-45]
    Schematron -->|Fail| Fail2[Return Semantic Errors]
    
    BR -->|Pass| CIUS[CIUS Specific Rules]
    BR -->|Fail| Fail3[Return Business Rule Errors]
    
    CIUS -->|Pass| Custom[Custom Validations]
    CIUS -->|Fail| Fail4[Return CIUS Errors]
    
    Custom -->|Pass| Success[Validation Success]
    Custom -->|Fail| Fail5[Return Custom Errors]
    
    Success --> Store[Store Validation Result]
    Fail1 --> Store
    Fail2 --> Store
    Fail3 --> Store
    Fail4 --> Store
    Fail5 --> Store
    
    Store --> End([Return ValidationResult])
```

## E-Invoice Transmission Flow

```mermaid
sequenceDiagram
    participant UI as User Interface
    participant API as API Layer
    participant Domain as Invoice Domain
    participant Queue as Message Queue
    participant Trans as Transmission Service
    participant AP as Access Point
    participant Peppol as Peppol Network
    participant Recipient as Recipient AP
    
    UI->>API: Send Invoice
    API->>Domain: invoice.send()
    Domain->>Domain: Validate Invoice
    Domain->>Domain: Generate XML Format
    Domain->>Queue: Queue Transmission Job
    API-->>UI: Job Queued
    
    Queue->>Trans: Process Job
    Trans->>AP: Submit Document
    AP->>AP: Validate Document
    AP->>Peppol: Route via SMP/SML
    Peppol->>Recipient: Deliver Document
    Recipient-->>Peppol: MLR Acknowledgment
    Peppol-->>AP: Forward MLR
    AP-->>Trans: Return MLR
    Trans->>Domain: Update Status
    Trans->>Queue: Mark Complete
    Domain-->>UI: Notify Success
```
## Multi-Currency Invoice Calculation
```mermaid
flowchart LR
    subgraph "Line Item Calculation"
        Qty[Quantity] --> Mult1{×}
        Price[Unit Price] --> Mult1
        Mult1 --> LineNet[Line Net Amount]
        
        LineNet --> TaxCalc{Tax Calculation}
        TaxRate[Tax Rate] --> TaxCalc
        TaxCalc --> LineTax[Line Tax]
        
        LineNet --> LineTotal[Line Total]
        LineTax --> LineTotal
    end
    
    subgraph "Currency Conversion"
        LineTotal --> Conv{Exchange Rate}
        ExRate[Exchange Rate] --> Conv
        Conv --> BaseAmount[Base Currency Amount]
    end
    
    subgraph "Invoice Totals"
        LineNet --> Sum1[Sum Net Amounts]
        LineTax --> Sum2[Sum Tax by Category]
        Sum1 --> InvNet[Invoice Net Total]
        Sum2 --> InvTax[Invoice Tax Total]
        InvNet --> InvTotal[Invoice Total]
        InvTax --> InvTotal
        
        BaseAmount --> BaseSum[Sum Base Amounts]
        BaseSum --> BaseTotal[Base Currency Total]
    end
```

## Document Format Transformation
```mermaid
graph TD
    subgraph "Internal Model"
        IM[Invoice Domain Model<br/>EN16931 Canonical]
    end

    subgraph "Output Formats"
        Peppol[Peppol BIS 3.0]
        UBL[UBL 2.1]
        FX[Factur-X]
        ZUG[ZUGFeRD]
        XR[XRechnung]
        CIUSIT[CIUS-IT]
        CIUSRO[CIUS-RO]
        CIUSNL[NLCIUS]
    end

    subgraph "Format Service"
        FS[Format Service<br/>Strategy Pattern]

        P1[Peppol Generator]
        U1[UBL Generator]
        F1[FacturX Generator]
        Z1[ZUGFeRD Generator]
        X1[XRechnung Generator]
        C1[CIUS Generator]
    end

    IM --> FS

    FS --> P1 --> Peppol
    FS --> U1 --> UBL
    FS --> F1 --> FX
    FS --> Z1 --> ZUG
    FS --> X1 --> XR
    FS --> C1 --> CIUSIT
    FS --> C1 --> CIUSRO
    FS --> C1 --> CIUSNL

    Peppol --> Val{Validation}
    UBL --> Val
    FX --> Val
    ZUG --> Val
    XR --> Val
    CIUSIT --> Val
    CIUSRO --> Val
    CIUSNL --> Val

    Val -->|Valid| Trans[Transmission]
    Val -->|Invalid| Err[Error Handling]
```

## Bounded Contexts

```mermaid
graph TB
    subgraph "Invoice Core Context"
        IC[Invoice Aggregate<br/>LineItems<br/>Totals<br/>Status Management]
    end
    
    subgraph "Party Context"
        PC[Party Management<br/>Customer/Vendor<br/>Identifiers<br/>Addresses]
    end
    
    subgraph "Tax Context"
        TC[Tax Schemes<br/>Rates & Categories<br/>Exemptions<br/>Calculations]
    end
    
    subgraph "Format & Validation Context"
        FV[Format Conversion<br/>XML Generation<br/>Validation Rules<br/>CIUS Profiles]
    end
    
    subgraph "Transmission Context"
        TR[Peppol Access Point<br/>Queue Management<br/>Acknowledgments<br/>Retry Logic]
    end
    
    subgraph "Payment Context"
        PAY[Payment Processing<br/>Reconciliation<br/>Status Updates]
    end
    
    IC <--> PC
    IC <--> TC
    IC <--> FV
    IC <--> TR
    IC <--> PAY
    
    FV <--> TR
```

## Event Flow
```mermaid
flowchart TD
    subgraph "Invoice Events"
        Create[InvoiceCreated]
        Final[InvoiceFinalized]
        Send[InvoiceSent]
        View[InvoiceViewed]
        Cancel[InvoiceCancelled]
    end
    
    subgraph "Payment Events"
        PayApp[PaymentApplied]
        Partial[PartialPaymentReceived]
        Paid[InvoicePaid]
    end
    
    subgraph "Transmission Events"
        Queue[TransmissionQueued]
        Success[TransmissionSucceeded]
        Failed[TransmissionFailed]
        Ack[AcknowledgmentReceived]
    end
    
    subgraph "Event Handlers"
        Audit[Audit Logger]
        Email[Email Notifier]
        Status[Status Updater]
        Webhook[Webhook Dispatcher]
        Report[Report Generator]
    end
    
    Create --> Audit
    Create --> Email
    
    Final --> Status
    Final --> Queue
    
    Queue --> Status
    
    Success --> Status
    Success --> Webhook
    Success --> Email
    
    Failed --> Status
    Failed --> Email
    
    Ack --> Status
    Ack --> Webhook
    
    PayApp --> Status
    PayApp --> Report
    
    Paid --> Status
    Paid --> Email
    Paid --> Report
```



