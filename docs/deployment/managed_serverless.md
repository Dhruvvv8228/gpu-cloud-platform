# Managed Serverless Hosting Guide (Vercel + Neon / Supabase)

This guide covers deploying the **NVIDIA GPU Cloud Compute Marketplace & Control Plane** using **Option 1: Managed Serverless Hosting** — the fastest approach for demo, staging, and preview deployments.

---

## Architecture Overview

```text
 ┌─────────────────────────────────────────────────────────┐
 │                   CUSTOMER BROWSERS                     │
 └────────────────────────────┬────────────────────────────┘
                              │
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │                     VERCEL EDGE                         │
 │  Next.js 16+ App Router / React 19 / Serverless API     │
 └────────────────────────────┬────────────────────────────┘
                              │
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │               NEON / SUPABASE POSTGRESQL                │
 │       PostgreSQL 18 Schema + Double-Entry Ledger        │
 └─────────────────────────────────────────────────────────┘
```

---

## 1. Prerequisites
- A [Vercel Account](https://vercel.com)
- A managed PostgreSQL instance on [Neon Tech](https://neon.tech) or [Supabase](https://supabase.com)
- Node.js `v20+` and Git

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Provision Managed PostgreSQL Database
1. Log into **Neon** or **Supabase** and create a new database cluster named `gpu_cloud_platform`.
2. Copy your connection string (`DATABASE_URL`). Example:
   ```text
   postgres://alex:password@ep-cool-lake-123456.us-east-2.aws.neon.tech/gpu_cloud_platform?sslmode=require
   ```
3. Initialize the schema using `psql`:
   ```bash
   psql "YOUR_DATABASE_URL" -f db/migrations/0001_initial_schema.sql
   ```

---

### Step 2: Deploy to Vercel via CLI

Run the following commands from the project root:

```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Deploy to Vercel Staging/Preview
vercel

# 3. Deploy to Production
vercel --prod
```

Alternatively, push the repository to GitHub / GitLab and import the project directly in the **Vercel Web Dashboard**.

---

### Step 3: Configure Environment Variables in Vercel

In the Vercel Dashboard (**Project Settings -> Environment Variables**), set:

| Variable Name | Required Value / Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Managed PostgreSQL connection string | `postgres://user:pass@ep-cool-123.neon.tech/gpu_cloud_db?sslmode=require` |
| `NEXT_PUBLIC_API_URL` | Base API URL | `https://your-app.vercel.app/api/v1` |
| `JWT_SECRET` | Secret key for signing API JWTs | `sk_jwt_super_secret_998877` |
| `NODE_ENV` | Production environment flag | `production` |

---

## 3. Verification & Live Health Checks

Once deployed, verify your serverless deployment by querying the live endpoints:

1. **Verify GPU Catalog**:
   ```bash
   curl https://your-app.vercel.app/api/v1/gpus
   ```
2. **Verify Wallet Deposit**:
   ```bash
   curl -X POST https://your-app.vercel.app/api/v1/wallet \
     -H "Content-Type: application/json" \
     -d '{"amount": 5000}'
   ```
3. **Deploy GPU Instance**:
   ```bash
   curl -X POST https://your-app.vercel.app/api/v1/instances \
     -H "Content-Type: application/json" \
     -d '{"gpu_code":"h100-80gb","region_code":"ap-south-1","gpu_count":1}'
   ```

---

## 4. Troubleshooting & Operational Notes

- **Cold Starts**: Next.js App Router API routes on Vercel boot serverless functions in < 200ms.
- **Database Connection Pooling**: When connecting to Neon or Supabase from serverless environments, append `?sslmode=require` to your connection string to enable connection pooling.
