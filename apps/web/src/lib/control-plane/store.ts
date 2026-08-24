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
import seedData from '../../../../../db/seeds/0001_initial_seeds.json';

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
      hashed_secret: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // SHA-256 placeholder
      last_used_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
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

export const marketplaceStore = new MarketplaceStore();
