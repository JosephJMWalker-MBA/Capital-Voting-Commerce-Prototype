# Security Requirements

- **Server-side Authorization**: Validate all roles and permissions on the backend.
- **Webhook Integrity**: Validate Stripe webhook signatures to prevent forged payment events.
- **Immutability**: Once a campaign receives a qualifying purchase, rules (voting, tie policies) cannot be changed silently.
- **Input/Output Validation**: Strict Zod/Prisma validation on all forms.
- **Idempotency**: Webhook endpoints must safely handle duplicate events.
- **Audit Logging**: All administrative actions (refunds, state changes, snapshotting) must write to an `AuditEvent` table.
- **No PCI Data Storage**: Credit card data is passed directly to Stripe; only tokens and receipt identifiers are stored.
