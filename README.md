# NVIDIA GPU Cloud Compute Marketplace & Control Plane

[![Build & E2E Acceptance](https://img.shields.io/badge/Build-Passing-emerald)](file:///d:/GPU_Project/walkthrough.md)
[![License-MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Framework-Next.js16](https://img.shields.io/badge/Framework-Next.js%2016-black)](https://nextjs.org)

Production-quality **NVIDIA GPU Cloud Compute Marketplace & Control Plane** designed to abstract external GPU infrastructure providers (e.g. Nebius, CoreWeave) behind a unified `ComputeProvider` engine with dynamic database-driven pricing, prepaid double-entry financial ledger, stateful durable provisioning workflows, customer dashboard, and admin market intelligence analytics.

---

## 🚀 Quick Deployment Options

### ⚡ Option 1: Managed Serverless Hosting (Recommended for Demo & Staging)
Deploy the Next.js App Router API & Frontend directly to **Vercel** paired with a managed **Neon** or **Supabase** PostgreSQL database.

* 📖 **[Managed Serverless Hosting Guide](file:///d:/GPU_Project/docs/deployment/managed_serverless.md)**

```bash
# 1. Initialize PostgreSQL schema on Neon/Supabase
psql "YOUR_NEON_DATABASE_URL" -f db/migrations/0001_initial_schema.sql

# 2. Deploy to Vercel
npx vercel --prod
```

---

### 🐳 Option 2: Docker Compose Single VPS Deployment
Self-contained deployment including PostgreSQL 18, Next.js Web App, Go API, and Temporal worker.

```bash
docker compose up -d --build
```

---

### ☁️ Option 3: Enterprise AWS CDK Stack
Production multi-AZ deployment on AWS (ECS Fargate, RDS PostgreSQL, SQS FIFO, S3, Secrets Manager).

```bash
cd infra/aws-cdk
cdk deploy
```

---

## 🛠️ Local Development & Testing

```bash
# Start Next.js local server
npm run dev

# Run 12-step automated E2E integration test suite
npm test
```

---

## 📄 Documentation & Reference

- **[Architecture & Design System (`PRODUCT.md`)](file:///d:/GPU_Project/PRODUCT.md)**
- **[Engineering & Provider Rules (`AGENTS.md`)](file:///d:/GPU_Project/AGENTS.md)**
- **[PostgreSQL Database Schema](file:///d:/GPU_Project/db/migrations/0001_initial_schema.sql)**
- **[AWS CDK Infrastructure Stack](file:///d:/GPU_Project/infra/aws-cdk/lib/gpu-cloud-stack.ts)**
