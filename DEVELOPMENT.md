# Development Guide

## Local Setup
1. Use `nvm` or equivalent to ensure Node.js v18+.
2. Install dependencies: `npm i`
3. Database: Ensure PostgreSQL is running. We recommend Docker (`docker run --name pg -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`).
4. Set `.env.local` variables (`DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`).

## Prisma Workflow
- `npx prisma format` to format schema.
- `npx prisma db push` to sync schema with local DB.
- `npx prisma generate` to update the client.

## Commands
- `npm run dev`: Start Next.js dev server.
- `npm run lint`: Run ESLint.
- `npm run build`: Build production bundle.
