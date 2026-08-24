-- PostgreSQL 18 Migration 0001: Initial Schema for NVIDIA GPU Cloud Compute Marketplace

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users & Auth
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    owner_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Organization Members
CREATE TABLE IF NOT EXISTS organization_members (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL DEFAULT 'member', -- owner, admin, member, viewer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, user_id)
);

-- API Keys
CREATE TABLE IF NOT EXISTS api_keys (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(16) NOT NULL,
    hashed_secret VARCHAR(255) NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GPU Types Catalog
CREATE TABLE IF NOT EXISTS gpu_types (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64) UNIQUE NOT NULL,
    architecture VARCHAR(64) NOT NULL,
    vram_gb INT NOT NULL,
    cuda_cores INT NOT NULL,
    tensor_cores INT NOT NULL,
    fp64_tflops NUMERIC(10, 2) NOT NULL,
    fp32_tflops NUMERIC(10, 2) NOT NULL,
    fp16_tflops NUMERIC(10, 2) NOT NULL,
    interconnect VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Regions
CREATE TABLE IF NOT EXISTS regions (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(64) NOT NULL,
    datacenter VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ONLINE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Compute Providers
CREATE TABLE IF NOT EXISTS providers (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Provider Regions
CREATE TABLE IF NOT EXISTS provider_regions (
    id VARCHAR(64) PRIMARY KEY,
    provider_id VARCHAR(64) NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    region_id VARCHAR(64) NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    provider_region_code VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE',
    UNIQUE(provider_id, region_id)
);

-- Products (GPU Offering Configurations)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    gpu_type_id VARCHAR(64) NOT NULL REFERENCES gpu_types(id) ON DELETE CASCADE,
    provider_region_id VARCHAR(64) NOT NULL REFERENCES provider_regions(id) ON DELETE CASCADE,
    gpu_count INT NOT NULL DEFAULT 1,
    vcpu_count INT NOT NULL,
    ram_gb INT NOT NULL,
    storage_gb INT NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pricing
CREATE TABLE IF NOT EXISTS pricing (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    provider_hourly_cost_inr NUMERIC(12, 2) NOT NULL,
    customer_hourly_price_inr NUMERIC(12, 2) NOT NULL,
    platform_margin_inr NUMERIC(12, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    effective_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wallets
CREATE TABLE IF NOT EXISTS wallets (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    balance_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wallet Transactions (Double-Entry Ledger)
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id VARCHAR(64) PRIMARY KEY,
    wallet_id VARCHAR(64) NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    amount_inr NUMERIC(14, 2) NOT NULL,
    type VARCHAR(32) NOT NULL, -- DEPOSIT, USAGE_CHARGE, REFUND, CREDIT_ADJUSTMENT
    description TEXT NOT NULL,
    reference_id VARCHAR(128),
    balance_after_inr NUMERIC(14, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Instances
CREATE TABLE IF NOT EXISTS instances (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, PROVISIONING, RUNNING, STOPPING, STOPPED, RESTARTING, TERMINATING, TERMINATED, FAILED
    ssh_public_key TEXT,
    connection_ip VARCHAR(64),
    connection_port INT DEFAULT 22,
    ssh_username VARCHAR(64) DEFAULT 'root',
    provider_id VARCHAR(64) NOT NULL REFERENCES providers(id),
    provider_instance_id VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    stopped_at TIMESTAMP WITH TIME ZONE,
    terminated_at TIMESTAMP WITH TIME ZONE
);

-- Instance Events Audit Trail
CREATE TABLE IF NOT EXISTS instance_events (
    id VARCHAR(64) PRIMARY KEY,
    instance_id VARCHAR(64) NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    message TEXT NOT NULL,
    metadata_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Provisioning Requests
CREATE TABLE IF NOT EXISTS provisioning_requests (
    id VARCHAR(64) PRIMARY KEY,
    instance_id VARCHAR(64) NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
    workflow_id VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'RUNNING',
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usage Records
CREATE TABLE IF NOT EXISTS usage_records (
    id VARCHAR(64) PRIMARY KEY,
    instance_id VARCHAR(64) NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INT DEFAULT 0,
    rate_per_hour_inr NUMERIC(12, 2) NOT NULL,
    total_charge_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    billing_status VARCHAR(32) NOT NULL DEFAULT 'UNBILLED', -- UNBILLED, BILLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    wallet_id VARCHAR(64) NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    provider VARCHAR(32) NOT NULL DEFAULT 'MOCK', -- MOCK, RAZORPAY
    payment_id VARCHAR(128),
    order_id VARCHAR(128),
    amount_inr NUMERIC(14, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Market Intelligence & Demand Events
CREATE TABLE IF NOT EXISTS market_demand_events (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64),
    gpu_type_code VARCHAR(64) NOT NULL,
    region_code VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL, -- VIEWED, CONFIGURED, DEPLOY_ATTEMPTED
    workload_category VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64),
    user_id VARCHAR(64),
    action VARCHAR(128) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64) NOT NULL,
    details_json JSONB,
    ip_address VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
