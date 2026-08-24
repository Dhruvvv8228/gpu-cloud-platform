# AGENTS.md - Persistent Engineering Guidelines & Architecture Handbook

## 1. Project Architecture Overview
This repository contains the **NVIDIA GPU Cloud Compute Marketplace & Control Plane**.
It is designed as a cloud control plane that abstracts external GPU infrastructure providers (e.g. Nebius, CoreWeave) and future internal NVIDIA GPU clusters behind a unified provider interface (`ComputeProvider`).

### Directory Structure
```text
/
├── apps/
│   └── web/                # Next.js 16.3+ / React 19.2+ / Tailwind CSS frontend & API routes
├── services/
│   └── control-plane/      # Go 1.27+ Modular Monolith (Chi, pgx, sqlc, OpenTelemetry)
├── workers/
│   └── provisioning/       # Go Temporal Workers for durable provisioning workflows
├── db/
│   ├── migrations/         # PostgreSQL schema migrations
│   ├── queries/            # SQL queries for sqlc
│   └── seeds/              # Seed data for GPU catalog and regions
├── docs/                   # Architecture, API, Database & Deployment docs
│   └── deployment/
│       └── managed_serverless.md  # Option 1: Vercel + Neon/Supabase Deployment Guide
├── infra/
│   └── aws-cdk/            # AWS CDK TypeScript infrastructure (ECS, RDS, S3, SQS)
├── docker-compose.yml      # Local dev stack (PostgreSQL, Temporal, Web, API)
└── AGENTS.md
```

---

## 2. Coding Conventions & Language Rules

### Go Rules (`services/control-plane`)
* Use standard library, `chi` router, `pgx` driver, and `sqlc` generated queries.
* Maintain strict domain isolation under `internal/<domain>`.
* Pass `context.Context` through all calls; enforce structured logging (slog).
* Idiomatic Go error handling: wrap errors with context (`fmt.Errorf("creating instance: %w", err)`).
* Never swallow errors or use global mutable state.

### Frontend Rules (`apps/web`)
* Next.js App Router, React 19, TypeScript, Tailwind CSS, Lucide React, Recharts.
* Use Server Components where appropriate; wrap dynamic client state in Client Components.
* Form validation using React Hook Form + Zod.
* API data fetching with TanStack Query (React Query).
* Dark-first, premium, technical UI layout without generic AI gradients or cartoon graphics.

---

## 3. Mandatory Provider Abstraction Rules
1. **Never expose provider IDs directly to customers**.
   Customer instance ID: `inst_827361`. Provider internal ID: `vm-nebius-8827`.
2. **Never place provider API credentials in frontend or browser bundle**.
   All provider interaction happens server-side through `ComputeProvider` interface adapter implementations.
3. **Routing Engine Isolation**:
   The provider selection engine (`routing`) determines capacity, price, and provider target.

---

## 4. Financial & Wallet Rules
1. **Prepaid Double-Entry Transaction Ledger**:
   All balance modifications must produce an immutable record in `wallet_transactions` (`DEPOSIT`, `USAGE_CHARGE`, `REFUND`).
2. **Idempotency Safeguards**:
   All charge events must provide an `idempotency_key` to avoid double billing during retries or network reconnections.

---

## 5. Build, Testing & Commands

### Development
```bash
# Start local Next.js frontend & control plane engine
npm run dev

# Run automated end-to-end integration test suite
npm test
```

### Managed Serverless Deployment (Option 1)
```bash
# 1. Seed Neon/Supabase PostgreSQL
psql "YOUR_NEON_DATABASE_URL" -f db/migrations/0001_initial_schema.sql

# 2. Deploy to Vercel
npx vercel --prod
```

---

## 6. Security & Authorization Rules
* Server-side authorization check on every instance operation (`user_id` & `organization_id` ownership verification).
* API Keys hashed securely in storage using SHA-256 (`sk_live_...`).
* Sanitize all inputs with Zod schemas.

---

## 7. DO NOT DO LIST
* DO NOT expose internal provider IDs (`vm-nebius-123`) to frontend or API responses.
* DO NOT calculate billing based on frontend client-side timers.
* DO NOT commit provider secrets, DB credentials, or JWT secrets to Git.
* DO NOT hardcode GPU prices into React components; all pricing is database-driven.
* DO NOT swallow errors or ignore command failure exit codes.
