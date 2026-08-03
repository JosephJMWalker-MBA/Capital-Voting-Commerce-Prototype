# Data Model

The primary data entities for Capital Voting Phase 1:

- **User / Role**: Represents platform administrators and managers.
- **Customer**: Represents public users making purchases (optional account).
- **Campaign**: The primary entity containing start/end dates, voting rules, and statuses.
- **Proposal**: Competing options within a campaign.
- **Product**: Merchandise tied to a specific proposal.
- **Order / Payment**: Commerce transaction records.
- **VoteLedgerEntry**: The immutable record of votes generated from completed orders.
- **AuditEvent**: For tracking critical state changes.

*See Prisma schema for exact field mappings.*
