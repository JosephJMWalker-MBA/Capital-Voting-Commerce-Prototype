# Capital Voting - Phase 1 Technical Product Brief

## 1. Project Summary
Capital Voting is a commerce-based participatory funding platform built around a simple premise: **People vote with their dollars.**
A campaign presents two or more competing proposals addressing the same problem. Each proposal has associated merchandise. Participants support a proposal by purchasing its merchandise.

## 2. Product Principle
Capital Voting is not a polling platform. A preference without commitment is not counted as a vote. Every recorded vote must be connected to a completed financial transaction.

## 3. Phase 1 Scope
Build a working proof of concept that supports:
1. Public campaign browsing & details.
2. Competing proposals & associated merchandise.
3. Product purchases.
4. Recorded votes derived from completed purchases.
5. Public campaign totals.
6. Automatic campaign closing & winner calculation.
7. Administrative campaign management.
8. Transparent allocation reporting.
9. Basic order and fulfillment management.
10. Permanent campaign results page.

## 4. Voting Model
**Default Voting Rule**: Each qualifying merchandise unit purchased equals one vote for the proposal associated with that product.
**Immutable Vote Ledger**: Every vote-generating transaction produces an append-only ledger entry.

## 5. Financial Transparency Model
Every campaign must disclose how purchase revenue is allocated (e.g., manufacturing, fees, platform, reserved for winner).

## 6. Campaign Lifecycle
States: Draft -> Internal Review -> Scheduled -> Live -> Paused -> Closed -> Reconciliation -> Winner Confirmed -> Funding Pending -> Funded -> Implementation -> Completed.

## 7. Tie Handling
Default Phase 1 policy: Extend the campaign once for 72 hours.

## 8. Minimum Funding Conditions
Campaigns may optionally establish a minimum net funding threshold.

## 9. Security & Privacy
- No storage of raw payment-card data.
- Do not publicly identify participants.
- Provide initial Privacy Policy, Terms of Use, Refund Policy, Campaign Rules, Financial Transparency Policy.

## 10. Compliance Boundary
Capital Voting must not initially launch campaigns involving electoral candidates, political contributions, ballot measures, securities, lotteries, or promises of tax-deductible contributions.
