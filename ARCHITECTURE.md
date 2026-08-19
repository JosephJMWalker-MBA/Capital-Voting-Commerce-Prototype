# Architecture

Capital Voting is implemented as a **modular monolith** for the Phase 1 commerce prototype.

## Tech stack

- **Framework**: Next.js App Router with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Payments**: Stripe Checkout and webhooks when test credentials are configured
- **Fulfillment**: simulated / adapter-oriented direction; no production fulfillment integration is established
- **Styling**: Tailwind CSS

## Core domains

1. **Identity**: users and role data; Phase 1 authentication is mocked rather than session-backed
2. **Campaigns**: lifecycle, proposals, products, voting rules, and tie-policy metadata
3. **Commerce**: carts, orders, payments, refunds, and Stripe webhook processing
4. **Voting**: payment-linked vote records, validity state, totals, and campaign resolution
5. **Transparency**: financial-allocation data, result snapshots, and audit events

## Implemented architectural behavior

### Payment-driven vote creation

When configured Stripe checkout succeeds, the webhook path is the application-level source of truth for converting a completed payment into vote records. Those records retain campaign, proposal, order, product, quantity, vote-value, and voting-rule references.

The no-key development checkout fallback does not execute this settlement path and should not be treated as evidence of a completed payment or valid votes.

### Payment-linked vote ledger

The current vote ledger is **not cryptographically immutable**.

The application creates vote rows after successful payment processing and does not silently delete them in the implemented refund path. A full refund updates associated vote rows from `VALID` to `INVALIDATED` and records an invalidation reason. Selected transitions also create `AuditEvent` records.

This is an application-level traceability model. It does not prevent a privileged database operator or unrelated code path from modifying stored rows, and the repository does not implement cryptographic chaining, signed ledger entries, independent tamper evidence, or external consensus.

### Refund handling

Refund events create refund records and, for full refunds, mark the order `REFUNDED` and invalidate its proposal-linked votes. Current campaign totals query only vote rows whose status remains `VALID`.

### Administrative identity and authorization

The data model includes users and roles, but Phase 1 authentication is mocked: `getCurrentAdmin()` selects a seeded `PLATFORM_ADMIN` rather than verifying a real authenticated session. Administrative authorization is therefore not production-ready, and not every administrative route independently verifies authorization.

### Campaign resolution

The resolver totals current `VALID` votes and can transition a campaign through reconciliation to `WINNER_CONFIRMED`.

A known Phase 1 mismatch remains: the product brief and default model specify a one-time 72-hour tie extension, while the current resolver selects the first proposal in the tied candidate list. That behavior should not be treated as implementation of the documented tie policy.

### Audit logging

`AuditEvent` provides application-level provenance for selected events such as campaign creation, payment-driven vote creation, refunds/invalidation, and campaign resolution. It improves inspectability but does not itself make the underlying operational tables immutable.

### Decoupled fulfillment

Fulfillment is intentionally kept separate from the voting and payment domain so a provider integration can be added or replaced later. The current repository should not be described as having complete Printful or production fulfillment support.

## Phase 1 boundary

This architecture is appropriate for studying the product mechanics and preserving the domain model, but it is **not a production security or governance architecture**. Real-money or consequential deployment would require, at minimum, real authentication and authorization, stricter input validation, comprehensive automated testing, hardened webhook/reconciliation behavior, corrected tie-policy enforcement, operational monitoring, fulfillment controls, and jurisdiction-specific compliance review.
