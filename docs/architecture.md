# System Architecture & Technical Design

## 1. Executive Summary

This document describes the high-level architecture of the **NVIDIA GPU Cloud Compute Marketplace & Control Plane**. The platform is designed as an infrastructure-agnostic, multi-tenant cloud control plane. It abstracts underlying GPU capacity providers (external partners initially, and internal bare-metal/Kubernetes GPU clusters in the future) behind a unified, robust domain model and API interface.

---

## 2. Platform Architecture Diagram

```mermaid
flowchart TD
    subgraph Clients["Clients & Edge Layer"]
        Browser["Next.js Web Frontend\n(React 19 / App Router)"]
        API_Consumer["External API Clients / CLI / SDK"]
        Cloudflare["Cloudflare WAF / Edge CDN / DDoS Guard"]
    end

    subgraph Edge_Routing["Routing & API Gateway"]
        ALB["AWS Application Load Balancer"]
        Gateway["API Gateway / Router (/api/v1)"]
    end

    subgraph Control_Plane["Modular Monolith Control Plane (Go 1.27 / TS engine)"]
        AuthService["Auth & Identity Domain"]
        CatalogService["GPU Catalog & Pricing Engine"]
        InstanceService["Instance Lifecycle Engine"]
        WalletService["Wallet Ledger & Billing Engine"]
        ProviderRouter["Provider Selection Engine"]
        APIKeyService["Developer API Key Manager"]
        AdminAnalytics["Market Intelligence & Analytics"]
    end

    subgraph Orchestration["Durable Workflow Orchestration"]
        Temporal["Temporal Orchestration Engine"]
        ProvisioningWF["Provisioning Workflow State Machine"]
        BillingWF["Usage & Metering Billing Workflow"]
    end

    subgraph Persistence["Storage & Messaging Layer"]
        PostgreSQL[("PostgreSQL 18 Primary DB\n(RDS Acid Transactions & Ledger)")]
        Valkey[("ElastiCache Valkey\n(State Cache & Throttling)")]
        SQS["AWS SQS Queue\n(Async Event Bus)"]
        S3["AWS S3\n(Artifacts & Audit Logs)"]
    end

    subgraph Infrastructure_Layer["GPU Provider Integration Layer"]
        ProviderInterface["ComputeProvider Interface"]
        MockProvider["MockProvider (Simulation Engine)"]
        NebiusAdapter["Nebius Provider Adapter"]
        CoreWeaveAdapter["CoreWeave Adapter"]
        OwnClusterAdapter["OwnInfrastructureProvider Adapter\n(K8s / NVIDIA GPU Operator)"]
    end

    Browser --> Cloudflare
    API_Consumer --> Cloudflare
    Cloudflare --> ALB
    ALB --> Gateway

    Gateway --> AuthService
    Gateway --> CatalogService
    Gateway --> InstanceService
    Gateway --> WalletService
    Gateway --> APIKeyService
    Gateway --> AdminAnalytics

    InstanceService --> Temporal
    Temporal --> ProvisioningWF
    Temporal --> BillingWF

    ProvisioningWF --> ProviderRouter
    ProviderRouter --> ProviderInterface
    ProviderInterface --> MockProvider
    ProviderInterface --> NebiusAdapter
    ProviderInterface --> CoreWeaveAdapter
    ProviderInterface --> OwnClusterAdapter

    AuthService --> PostgreSQL
    CatalogService --> PostgreSQL
    InstanceService --> PostgreSQL
    WalletService --> PostgreSQL
    AdminAnalytics --> PostgreSQL

    BillingWF --> SQS
    ProvisioningWF --> Valkey
```

---

## 3. High-Level Data & Request Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Frontend as Next.js Dashboard
    participant API as API Router (/api/v1)
    participant Auth as Auth & Wallet Service
    participant Temporal as Provisioning Workflow
    participant Provider as Provider Router
    participant DB as PostgreSQL DB

    Customer->>Frontend: Select H100 (1 GPU, India region) & click Deploy
    Frontend->>API: POST /api/v1/instances (with idempotency token)
    API->>Auth: Validate auth token & verify prepaid wallet balance
    Auth-->>API: Balance verified (Funds held)
    API->>DB: Record Instance (Status: PENDING)
    API->>Temporal: Execute CreateInstanceWorkflow(instanceID)
    Temporal->>Provider: Route to optimal provider (MockProvider)
    Provider->>Provider: Reserve GPU capacity & launch vm-id
    Provider-->>Temporal: ProviderInstance (vm-827373, IP, credentials)
    Temporal->>DB: Update Instance (Status: PROVISIONING -> RUNNING, external connection info)
    Temporal->>DB: Start hourly usage tracking ledger record
    API-->>Frontend: HTTP 202 Accepted { instance_id: "inst_82723", status: "PROVISIONING" }
    Frontend->>API: Poll GET /api/v1/instances/inst_82723 (or SSE)
    API-->>Frontend: { status: "RUNNING", connection_ssh: "ssh root@..." }
```

---

## 4. Key Architectural Decisions & Principles

1. **Strict Resource Abstraction (Customer ID vs Provider ID)**:
   Customers interact strictly with clean platform IDs (e.g. `inst_948271`). Internal provider details (e.g. `vm-nebius-88371` or `mock-instance-123`) are encapsulated within the provider translation layer and never exposed in customer state or API responses.

2. **Prepaid Double-Entry Transaction Ledger**:
   Financial transactions (deposits, hourly compute charges, refunds) are handled through append-only wallet transaction entries (`wallet_transactions`). No direct floating-point mutations on raw balances.

3. **Durable Workflow Execution**:
   Long-running provisioning steps (validating capacity, requesting VM, waiting for network initialization, health checks, teardown) are managed by Temporal workflows with automatic retries, saga rollbacks, and idempotency guarantees.

4. **Modular Monolith Architecture**:
   All core domains reside within a single cohesive binary/repository structure (`services/control-plane`), structured cleanly into domain packages. This prevents unnecessary microservice distributed overhead during MVP phase while allowing domain separation for future extraction.
