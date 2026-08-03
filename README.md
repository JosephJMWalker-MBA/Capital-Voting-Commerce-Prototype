# Capital Voting Phase 1

Capital Voting is a commerce-based participatory funding platform built around a simple premise: **People vote with their dollars.**

A campaign presents two or more competing proposals addressing the same problem. Participants support a proposal by purchasing its associated merchandise. When the campaign closes, the winning proposal is funded based on a disclosed voting rule.

## What Phase 1 Proves
The goal of Phase 1 is to answer one question:
> Can people understand, trust, and successfully use a system where merchandise purchases determine which proposal receives funding?

It is a functional proof-of-concept prioritizing a clean, understandable flow, un-manipulatable vote ledgers, and basic payment processing.

## How to Run Locally

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Stripe Account (for test mode API keys)

### Setup
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   *Fill in your database URL and Stripe test keys.*
3. Run database migrations:
   ```bash
   npx prisma db push
   ```
4. Seed the database with the demonstration campaign:
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## How to Run Tests
- Unit/Integration tests (Jest/Vitest): `npm test`
- End-to-End tests (Cypress): `npm run test:e2e`

## Seeding the Demonstration Campaign
Run `npm run seed` to populate a fictional campaign ("Neighborhood Lot Decision") pitting a Community Garden against a Pocket Park. This campaign is explicitly labeled as a demonstration with no real-world funding decision.

## Intentionally Excluded Features (Phase 1)
- Native mobile applications
- Public proposal submission
- Ranked-choice voting
- Social network features / Comments
- Multi-vendor marketplace payouts
- Real-money charitable donations (without explicit tax configurations)

## Unresolved Legal Questions
- **Tax Deductibility**: Phase 1 assumes no tax-deductible contributions are being made.
- **Electoral Constraints**: This platform must not be used for political campaigns, ballot measures, or securities/investments in its current state.
