# Testing Strategy

No Phase 1 milestone is complete unless its tests pass.

## 1. Unit Tests
Focus on isolated domain logic without database or network dependencies.
- Vote calculation engines.
- Tie handling rules.
- Financial allocation projections.

## 2. Integration Tests
Focus on database interactions and webhook processing.
- Verify that a successful payment event creates the correct `VoteLedgerEntry`.
- Verify duplicate webhooks are ignored (idempotency).
- Verify refunds update vote eligibility correctly.
- Ensure protected campaign fields reject updates if votes exist.

## 3. End-to-End (E2E) Tests
Focus on the critical user paths.
- Visitor browses -> selects product -> checks out -> payment confirmed -> vote recorded.
- Administrator closes campaign -> winner calculated -> snapshot published.
