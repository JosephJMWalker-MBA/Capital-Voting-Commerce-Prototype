# Capital Voting Commerce Prototype

Capital Voting is a Phase 1 commerce-based participatory-funding prototype built around a simple premise: **people vote with their dollars.**

A campaign presents two or more competing proposals addressing the same problem. Participants support a proposal by purchasing associated merchandise. Qualifying completed payments can create proposal-linked vote records, and campaign totals are derived from vote records that remain valid after payment and refund processing.

This repository is a **functional proof of concept**, not a production-ready voting, fundraising, commerce, or civic-decision platform.

## What Phase 1 explores

The central product question is:

> Can people understand and use a system where merchandise purchases determine which competing proposal receives funding?

The implemented prototype explores that flow with:

- public campaign, proposal, and merchandise views;
- cart and checkout flows;
- PostgreSQL persistence through Prisma;
- Stripe Checkout integration when test credentials are configured;
- Stripe webhook handling for completed checkout sessions and refunds;
- payment-linked vote records;
- refund-driven vote invalidation;
- campaign vote totals and financial projections;
- administrative campaign, finance, and ledger surfaces;
- campaign lifecycle and winner-resolution logic; and
- audit-event records for selected administrative and payment-driven transitions.

## Vote-ledger boundary

The current implementation should **not** be described as an unmanipulatable or cryptographically immutable voting ledger.

A successful configured Stripe payment can create vote records linked to the order, product, proposal, and campaign. Refund processing can later update those vote records to `INVALIDATED`, while audit events preserve selected transition history.

That provides traceable application-level vote accounting for the prototype, but the underlying records are ordinary database rows. The repository does not establish cryptographic immutability, independent tamper evidence, or resistance to a privileged database operator.

## Prototype limitations

Several important production controls are intentionally incomplete:

- **Authentication is mocked.** The Phase 1 admin helper selects a seeded `PLATFORM_ADMIN` rather than validating a real user session.
- **Administrative authorization is incomplete.** Not every administrative route independently enforces role/session authorization.
- **Tie handling does not yet match the documented policy.** The product brief specifies a one-time 72-hour extension, while the current resolver selects the first proposal among tied leaders.
- **Fulfillment is not a production integration.** Printful is represented as a simulated/adapter direction rather than a complete fulfillment workflow.
- **No automated test commands are currently declared in `package.json`.** The older README references to `npm test` and `npm run test:e2e` were aspirational rather than executable repository scripts.
- **Deployment and security hardening are incomplete.** This code should not be exposed as a real-money public decision system without substantial authorization, validation, testing, reconciliation, operational, and compliance work.

## Stripe and mock checkout behavior

With configured Stripe test credentials, the checkout route creates a pending order, creates a Stripe Checkout Session, and relies on Stripe webhook events to mark the order paid and create valid vote records.

When `STRIPE_SECRET_KEY` is absent or set to the repository's mock value, the route instead returns a local mock success URL. That development fallback **does not represent a settled payment and does not execute the real webhook-driven vote-creation path**. Any confirmation language shown by the mock success page should therefore be understood as prototype UI, not evidence of payment or recorded votes.

## Demonstration campaign

Run:

```bash
npm run seed
```

to populate the fictional **Neighborhood Lot Decision**, which compares a Community Garden with a Pocket Park. It is demonstration data and does not represent a real funding decision.

## How to run locally

### Prerequisites

- Node.js 18+
- PostgreSQL
- Stripe test credentials if exercising the configured payment/webhook path

### Setup

```bash
npm install
cp .env.example .env.local
npx prisma db push
npm run seed
npm run dev
```

Provide the required database configuration and Stripe test values in `.env.local` when exercising the payment integration.

## Intentionally excluded from Phase 1

- Native mobile applications
- Public proposal submission
- Ranked-choice voting
- Social-network features and comments
- Multi-vendor marketplace payouts
- Production identity/authentication
- Production fulfillment
- Electoral or ballot-measure use
- Securities or investment offerings
- Lotteries or games of chance
- Tax-deductible contribution claims without separate legal clearance

## Compliance boundary

Capital Voting must not be treated as a general-purpose political or financial voting system in its current state. The Phase 1 repository explicitly excludes electoral candidates, political contributions, ballot measures, securities/investments, lotteries, and unqualified promises of tax deductibility.

The prototype is best understood as a bounded experiment in **commerce-linked participatory funding mechanics**, with the implementation preserving enough structure to study payment-linked support, invalidation, reconciliation, transparency, and campaign resolution without claiming that the system is ready for consequential public use.
