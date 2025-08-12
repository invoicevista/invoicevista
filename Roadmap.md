Implementation roadmap

1. Kick‑off phase: gather requirements, study regulations and produce a domain glossary. Identify stakeholders in
   Germany, Spain and Italy.

2. Event storming and modelling: model core processes and determine bounded contexts; build the ubiquitous language;
   draft the canonical invoice model.

3. Prototype core domain: implement the Invoice aggregate, value objects, repositories and domain events in one bounded
   context (e.g., Invoicing). Use an in‑memory persistence layer initially.

4. Add country adapters: build the Germany adapter (XRechnung/ZUGFeRD/PEPPOL) first, then Spain (
   Facturae/SII/VeriFactu), then Italy (FatturaPA/SdI). Validate conversions using official test suites.

5. Implement accounting and tax contexts: develop Accounting and Tax Reporting contexts; integrate them via events (
   InvoiceIssued triggers posting to ledger; PaymentReceived triggers VAT calculation).
6. Develop UI and API layer: create user interfaces and REST/gRPC APIs for issuing, receiving and managing invoices.
   Provide endpoints for configuring country preferences, VAT rates and digital certificates.
7. Iterate and extend: refine the domain model based on user feedback. Add reporting dashboards, payment integrations
   and support for additional EU countries by writing new adapters. Begin preparations for ViDA DRR (real‑time intra‑EU
   reporting) well before the 1 Jul 2030 deadline.