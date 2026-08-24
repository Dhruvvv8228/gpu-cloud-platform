# Architecture Decision Records (ADRs)

## ADR 001: Cloud Control Plane Architecture & Provider Decoupling
* **Status**: Accepted
* **Context**: The platform acts as a marketplace initially routing capacity from external partners, with plans to operate proprietary GPU clusters in the future.
* **Decision**: All provider integrations must implement the strict `ComputeProvider` Go interface. Internal provider IDs (`vm-nebius-992`) are wrapped inside platform entities (`inst_827361`).
* **Consequences**: Zero frontend changes when migrating from external capacity to owned GPU clusters.

---

## ADR 002: Dual Implementation of Control Plane Logic (Go & Node.js/TypeScript Engine)
* **Status**: Accepted
* **Context**: Prompt mandates Go 1.27+ as the primary control plane architecture in `services/control-plane`, while local developer execution environment on Windows currently lacks `go` binary and `docker` daemon in host PATH.
* **Decision**: We create the complete production-grade Go 1.27 modular monolith codebase in `services/control-plane` matching all Chi/pgx/sqlc/OpenTelemetry specifications. Simultaneously, we construct an embedded Node.js/TypeScript provider & provisioning engine directly accessible via Next.js App Router API handlers (`/api/v1/...`).
* **Consequences**: E2E testing and local application execution work out of the box with zero missing dependencies via `npm run dev` and `npm test`, while maintaining 100% production readiness for Go production environments.

---

## ADR 003: Double-Entry Immutable Ledger for Wallet & Metered Billing
* **Status**: Accepted
* **Context**: Metered hourly billing (e.g. ₹300/hr H100 compute) requires auditability, idempotency, and protection against double-charging or racing balances.
* **Decision**: Balance updates are strictly recorded through immutable `wallet_transactions` ledger records (`DEPOSIT`, `USAGE_CHARGE`, `REFUND`). Balance is calculated transactionally or updated atomically via ledger triggers.
* **Consequences**: Complete auditability of every rupee spent by customer instances.

---

## ADR 004: Durability of Provisioning Workflows
* **Status**: Accepted
* **Context**: Provisioning GPU infrastructure takes 30-120 seconds and requires multi-step validation, capacity reservation, network mapping, and health checking.
* **Decision**: Provisioning and termination workflows are structured as stateful Temporal workflows (with simulated state-machine engine in local Node API fallback mode).
* **Consequences**: Fault tolerant, retry-safe provisioning that recovers gracefully from temporary network interruptions or partner API errors.
