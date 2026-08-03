# Architecture

Capital Voting is built as a **Modular Monolith** for Phase 1. 

## Tech Stack
- **Framework**: Next.js (App Router) with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Payments**: Stripe (Test Mode initially)
- **Fulfillment**: Printful (Simulated/Adapter pattern)
- **Styling**: Tailwind CSS

## Core Domains
1. **Identity**: Users, Roles, Permissions
2. **Campaigns**: Lifecycle, Proposals, Products
3. **Commerce**: Carts, Orders, Payments (Stripe Webhooks)
4. **Voting**: Immutable Vote Ledger, Rules Engine
5. **Transparency**: Financial Allocation, Snapshots, Audit Log

## Key Architectural Principles
- **Payment Webhooks as Source of Truth**: Stripe webhooks drive vote creation and invalidation idempotently.
- **Append-only Vote Ledger**: Votes are never silently deleted. Invalidation requires a new status or entry.
- **Decoupled Fulfillment**: Ensure product/fulfillment systems can be swapped post-Phase 1.
