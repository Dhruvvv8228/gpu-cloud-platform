import {
  GPUType,
  Region,
  GPUProduct,
  CustomerInstance,
  Wallet,
  WalletTransaction,
  UsageRecord,
  ApiKey,
  MarketDemandEvent,
} from './types';
import seedData from '../data/seeds.json';

class MarketplaceStore {
  public gpuTypes: GPUType[] = [];
  public regions: Region[] = [];
  public products: GPUProduct[] = [];
  public instances: Map<string, CustomerInstance & { provider_instance_id: string }> = new Map();
  public wallets: Map<string, Wallet> = new Map();
  public walletTransactions: WalletTransaction[] = [];
  public usageRecords: UsageRecord[] = [];
  public apiKeys: ApiKey[] = [];
  public marketDemandEvents: MarketDemandEvent[] = [];
  public auditLogs: Array<{
    id: string;
    organization_id: string;
    user_id: string;
    action: string;
    resource_type: string;
    resource_id: string;
    details: string;
    created_at: string;
  }> = [];

  // Default demo org & user
  public defaultOrgId = 'org_demo_123';
  public defaultUserId = 'user_demo_123';
  public defaultOrgName = 'Acme AI Labs';

  constructor() {
    this.initFromSeeds();
  }

  private initFromSeeds() {
    this.gpuTypes = seedData.gpu_types as GPUType[];
    this.regions = seedData.regions as Region[];

    let prodIdCounter = 1;
    for (const g of this.gpuTypes) {
      const pricingInfo = seedData.pricing.find((p) => p.gpu_code === g.code);
      if (!pricingInfo) continue;

      for (const r of this.regions) {
        this.products.push({
          id: `prod_${g.code}_${r.code}`,
          gpu_type_id: g.id,
          gpu_code: g.code,
          gpu_name: g.name,
          region_id: r.id,
          region_code: r.code,
          gpu_count: 1,
          vcpu_count: pricingInfo.vcpu_count,
          ram_gb: pricingInfo.ram_gb,
          storage_gb: pricingInfo.storage_gb,
          provider_hourly_cost_inr: pricingInfo.provider_hourly_cost_inr,
          customer_hourly_price_inr: pricingInfo.customer_hourly_price_inr,
          platform_margin_inr: pricingInfo.platform_margin_inr,
          is_available: true,
        });
        prodIdCounter++;
      }
    }

    // Initialize Default Wallet with ₹5,000 demo credit
    const walletId = `wall_${this.defaultOrgId}`;
    this.wallets.set(this.defaultOrgId, {
      id: walletId,
      organization_id: this.defaultOrgId,
      balance_inr: 5000.0,
      currency: 'INR',
      updated_at: new Date().toISOString(),
    });

    this.walletTransactions.push({
      id: `tx_${Date.now()}_init`,
      wallet_id: walletId,
      amount_inr: 5000.0,
      type: 'DEPOSIT',
      description: 'Initial Demo Account Balance Grant',
      balance_after_inr: 5000.0,
      created_at: new Date().toISOString(),
    });

    // Default API Key
    this.apiKeys.push({
      id: 'key_demo_982',
      organization_id: this.defaultOrgId,
      user_id: this.defaultUserId,
      name: 'Default Production Key',
      key_prefix: 'sk_live_demo982',
      hashed_secret: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      last_used_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    // Active Live Demo Instance (NVIDIA H100 80GB in ap-south-1)
    const runningInstance: CustomerInstance & { provider_instance_id: string } = {
      id: 'inst_982104',
      organization_id: this.defaultOrgId,
      user_id: this.defaultUserId,
      product_id: 'prod_h100-80gb_ap-south-1',
      gpu_code: 'h100-80gb',
      gpu_name: 'NVIDIA H100 80GB',
      region_code: 'ap-south-1',
      gpu_count: 1,
      name: 'llama-3.3-70b-inference-node',
      status: 'RUNNING',
      connection_ip: '194.26.112.45',
      connection_port: 22,
      ssh_username: 'ubuntu',
      ssh_public_key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...',
      image: 'Ubuntu 22.04 LTS (PyTorch 2.5 + CUDA 12.4 + vLLM)',
      customer_hourly_price_inr: 300.0,
      provider_id: 'prov-mock-01',
      provider_instance_id: 'vm-mock-982104',
      created_at: new Date(Date.now() - 3600 * 2500).toISOString(),
      started_at: new Date(Date.now() - 3600 * 2500).toISOString(),
      current_spend_inr: 750.0,
      uptime_seconds: 9000,
    };
    this.instances.set('inst_982104', runningInstance);

    // Initial usage record
    this.usageRecords.push({
      id: 'usg_demo_982104',
      instance_id: 'inst_982104',
      organization_id: this.defaultOrgId,
      gpu_code: 'h100-80gb',
      start_time: new Date(Date.now() - 3600 * 2500).toISOString(),
      duration_seconds: 9000,
      rate_per_hour_inr: 300.0,
      total_charge_inr: 750.0,
      billing_status: 'BILLED',
    });

    // Initial demand intelligence signals
    this.marketDemandEvents.push(
      {
        id: 'mde_demo_1',
        organization_id: this.defaultOrgId,
        gpu_type_code: 'h100-80gb',
        region_code: 'ap-south-1',
        action: 'DEPLOY_ATTEMPTED',
        workload_category: 'LLM Fine-Tuning & Distributed Training',
        created_at: new Date(Date.now() - 3600 * 4000).toISOString(),
      },
      {
        id: 'mde_demo_2',
        organization_id: this.defaultOrgId,
        gpu_type_code: 'b200-192gb',
        region_code: 'us-east-1',
        action: 'VIEWED',
        workload_category: 'Trillion-Parameter Reasoning Models',
        created_at: new Date(Date.now() - 3600 * 2000).toISOString(),
      },
      {
        id: 'mde_demo_3',
        organization_id: this.defaultOrgId,
        gpu_type_code: 'l40s-48gb',
        region_code: 'ap-south-1',
        action: 'CONFIGURED',
        workload_category: 'Real-Time Vision & Diffusion Pipelines',
        created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
      }
    );

    // Initial audit log
    this.auditLogs.push({
      id: 'audit_demo_1',
      organization_id: this.defaultOrgId,
      user_id: this.defaultUserId,
      action: 'INSTANCE_CREATED',
      resource_type: 'INSTANCE',
      resource_id: 'inst_982104',
      details: 'Provisioned NVIDIA H100 80GB (ap-south-1 Mumbai)',
      created_at: new Date(Date.now() - 3600 * 2500).toISOString(),
    });
  }

  // Wallet Ledger Logic
  getWallet(orgId: string = this.defaultOrgId): Wallet {
    let w = this.wallets.get(orgId);
    if (!w) {
      w = {
        id: `wall_${orgId}`,
        organization_id: orgId,
        balance_inr: 0.0,
        currency: 'INR',
        updated_at: new Date().toISOString(),
      };
      this.wallets.set(orgId, w);
    }
    return w;
  }

  addWalletFunds(
    orgId: string = this.defaultOrgId,
    amountINR: number,
    description: string = 'Wallet Credit Deposit',
    referenceId?: string
  ): WalletTransaction {
    const w = this.getWallet(orgId);
    w.balance_inr += amountINR;
    w.updated_at = new Date().toISOString();
    this.wallets.set(orgId, w);

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      wallet_id: w.id,
      amount_inr: amountINR,
      type: 'DEPOSIT',
      description,
      reference_id: referenceId,
      balance_after_inr: w.balance_inr,
      created_at: new Date().toISOString(),
    };

    this.walletTransactions.unshift(tx);
    return tx;
  }

  deductWalletFunds(
    orgId: string = this.defaultOrgId,
    amountINR: number,
    description: string,
    idempotencyKey?: string
  ): WalletTransaction {
    if (idempotencyKey) {
      const existing = this.walletTransactions.find((t) => t.idempotency_key === idempotencyKey);
      if (existing) return existing;
    }

    const w = this.getWallet(orgId);
    w.balance_inr -= amountINR;
    w.updated_at = new Date().toISOString();
    this.wallets.set(orgId, w);

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      wallet_id: w.id,
      amount_inr: -amountINR,
      type: 'USAGE_CHARGE',
      description,
      balance_after_inr: w.balance_inr,
      idempotency_key: idempotencyKey,
      created_at: new Date().toISOString(),
    };

    this.walletTransactions.unshift(tx);
    return tx;
  }

  // Market Demand Analytics Tracking
  logMarketDemand(
    gpuTypeCode: string,
    regionCode: string,
    action: 'VIEWED' | 'CONFIGURED' | 'DEPLOY_ATTEMPTED',
    workloadCategory?: string,
    orgId: string = this.defaultOrgId
  ) {
    this.marketDemandEvents.push({
      id: `mde_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organization_id: orgId,
      gpu_type_code: gpuTypeCode,
      region_code: regionCode,
      action,
      workload_category: workloadCategory || 'General AI/ML',
      created_at: new Date().toISOString(),
    });
  }
}

const globalForStore = globalThis as unknown as {
  marketplaceStore: MarketplaceStore | undefined;
};

export const marketplaceStore =
  globalForStore.marketplaceStore ?? new MarketplaceStore();

globalForStore.marketplaceStore = marketplaceStore;
