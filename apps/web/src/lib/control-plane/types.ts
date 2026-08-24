export interface GPUType {
  id: string;
  code: string;
  name: string;
  architecture: string;
  vram_gb: number;
  cuda_cores: number;
  tensor_cores: number;
  fp64_tflops: number;
  fp32_tflops: number;
  fp16_tflops: number;
  interconnect: string;
  description: string;
}

export interface Region {
  id: string;
  code: string;
  name: string;
  country: string;
  datacenter: string;
  status: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE' | 'OFFLINE';
}

export interface GPUProduct {
  id: string;
  gpu_type_id: string;
  gpu_code: string;
  gpu_name: string;
  region_id: string;
  region_code: string;
  gpu_count: number;
  vcpu_count: number;
  ram_gb: number;
  storage_gb: number;
  provider_hourly_cost_inr: number;
  customer_hourly_price_inr: number;
  platform_margin_inr: number;
  is_available: boolean;
}

export interface CreateInstanceRequest {
  platform_instance_id: string;
  gpu_code: string;
  region_code: string;
  gpu_count: number;
  image: string;
  ssh_public_key?: string;
  metadata?: Record<string, string>;
}

export interface ProviderInstance {
  provider_instance_id: string; // e.g. vm-nebius-88273 or vm-mock-771
  status: 'PENDING' | 'PROVISIONING' | 'RUNNING' | 'STOPPING' | 'STOPPED' | 'RESTARTING' | 'TERMINATING' | 'TERMINATED' | 'FAILED';
  public_ip: string;
  ssh_port: number;
  ssh_user: string;
  created_at: string;
}

export interface CustomerInstance {
  id: string; // inst_827361
  organization_id: string;
  user_id: string;
  product_id: string;
  gpu_code: string;
  gpu_name: string;
  region_code: string;
  gpu_count: number;
  name: string;
  status: 'PENDING' | 'PROVISIONING' | 'RUNNING' | 'STOPPING' | 'STOPPED' | 'RESTARTING' | 'TERMINATING' | 'TERMINATED' | 'FAILED';
  connection_ip?: string;
  connection_port?: number;
  ssh_username?: string;
  ssh_public_key?: string;
  image: string;
  customer_hourly_price_inr: number;
  provider_id: string;
  // NOTE: provider_instance_id is internal and NOT sent to basic customer DTOs
  created_at: string;
  started_at?: string;
  stopped_at?: string;
  terminated_at?: string;
  uptime_seconds?: number;
  current_spend_inr?: number;
}

export interface Wallet {
  id: string;
  organization_id: string;
  balance_inr: number;
  currency: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  amount_inr: number;
  type: 'DEPOSIT' | 'USAGE_CHARGE' | 'REFUND' | 'CREDIT_ADJUSTMENT';
  description: string;
  reference_id?: string;
  balance_after_inr: number;
  idempotency_key?: string;
  created_at: string;
}

export interface UsageRecord {
  id: string;
  instance_id: string;
  organization_id: string;
  gpu_code: string;
  start_time: string;
  end_time?: string;
  duration_seconds: number;
  rate_per_hour_inr: number;
  total_charge_inr: number;
  billing_status: 'UNBILLED' | 'BILLED';
}

export interface ApiKey {
  id: string;
  organization_id: string;
  user_id: string;
  name: string;
  key_prefix: string; // sk_live_827...
  hashed_secret: string;
  last_used_at?: string;
  created_at: string;
}

export interface MarketDemandEvent {
  id: string;
  organization_id?: string;
  gpu_type_code: string;
  region_code: string;
  action: 'VIEWED' | 'CONFIGURED' | 'DEPLOY_ATTEMPTED';
  workload_category?: string;
  created_at: string;
}
