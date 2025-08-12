# EU E-Invoicing Research: Target Market Analysis

## Key EU E-Invoicing Terms & Standards

### Core Standards
- **EN 16931**: Defines what must be included in an EU e-invoice
- **PEPPOL**: Specification for profiling, validating, and transferring invoices between parties - a delivery network with its own spec called PEPPOL BIS Billing 3.0
- **UBL**: The XML syntax (ISO/IEC 19845) that carries an EN 16931 invoice

### ViDA (VAT in the Digital Age)
ViDA is the EU legislative package to modernise VAT, adopted on March 11, 2025. It rolls out in stages through 2035 and includes three major components:

1. **Real-time digital reporting** for cross-border B2B transactions, based on e-invoicing
2. **Updated VAT rules** for the platform economy
3. **Single VAT registration** expansions

**Key Implementation Dates:**
- **January 1, 2027**: Some clarifications take effect
- **July 1, 2028**: Platform and SVR measures begin
- **July 1, 2030**: Cross-border B2B digital reporting starts
- **January 1, 2035**: Alignment of domestic regimes required

### CIUS (Core Invoice Usage Specification)
A CIUS is a profile of EN 16931 that narrows or constrains the core data model to meet specific legal or business needs (e.g., country, sector, or network requirements). 

**Key characteristics:**
- Must remain a subset of EN 16931 core
- Cannot break existing EN 16931 rules
- Primarily adds stricter rules, clarifications, and documentation

## Country-Specific Implementations

### Germany
- **XRechnung**: National CIUS of EN 16931 (close to PEPPOL-ready but not fully compliant)
- **ZUGFeRD**: EN 16931 compliant format
- **PEPPOL BIS Billing 3.0**: CIUS of EN 16931 (PEPPOL-ready)

### Spain
- **Facturae**: National XML e-invoice format
  - Used for B2G transactions via FACe
  - Used for B2B flows (e.g., FACeB2B for public contract subcontractors)
  - Can be EN 16931 compliant but not PEPPOL-ready
- **VeriFactu**: Not an exchange format - Spain's billing software regulation requiring invoicing systems (SIF) to meet AEAT's integrity/traceability rules with optional invoice record transmission to tax agency
- **Crea y Crece**: Draft regulation requiring EN 16931 semantics with multiple syntax options:
  - UBL, CII, EDIFACT, Facturae supported
  - Only UBL can be sent via PEPPOL
  - Facturae syntax still required for public government repository copies

### Italy
- **FatturaPA**: National XML e-invoice format
- **CIUS-IT ("FatturaEU")**: Italian CIUS of EN 16931 (not PEPPOL-ready - requires conversion to PEPPOL BIS UBL)

## Key Insights

### EN 16931 vs PEPPOL Compliance
**Important**: "EN 16931-compliant" ≠ "PEPPOL-ready"

PEPPOL adds additional requirements:
- Own CIUS rules
- Specific code lists
- Required identifiers (ISO 6523 scheme IDs)
- Network onboarding requirements (SMP/SML, Access Point)

Many EN 16931-compliant files will fail PEPPOL validation until they meet BIS rules and metadata/transport requirements.

### Italy's Unique Approach
1. **Domestic e-invoicing** operates through SDI using FatturaPA format - PEPPOL is not the primary domestic channel
2. **PEPPOL Integration for B2G**: When a Public Administration receives a PEPPOL BIS 3 (UBL) invoice:
   - SDI validates the invoice
   - Converts it to FatturaPA format
   - Delivers the converted invoice
   - Attaches the original PEPPOL file
   - This creates a bridge for PA traffic between PEPPOL and domestic systems