export interface GPUType {
  id: string;
  name: string;
  code: string;
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
  status: 'ONLINE' | 'MAINTENANCE';
}

export interface GPUProduct {
  id: string;
  gpu_type_id: string;
  gpu_code: string;
  gpu_name: string;
  vram_gb: number;
  region_code: string;
  region_name: string;
  gpu_count: number;
  vcpu_count: number;
  ram_gb: number;
  storage_gb: number;
  provider_hourly_cost_inr: number;
  customer_hourly_price_inr: number;
  platform_margin_inr: number;
  is_available: boolean;
}

export type InstanceStatus =
  | 'PENDING'
  | 'PROVISIONING'
  | 'RUNNING'
  | 'STOPPING'
  | 'STOPPED'
  | 'RESTARTING'
  | 'TERMINATING'
  | 'TERMINATED'
  | 'FAILED';

export interface ComputeInstance {
  id: string; // inst_827361
  organization_id: string;
  user_id: string;
  name: string;
  gpu_code: string;
  gpu_name: string;
  region_code: string;
  gpu_count: number;
  vcpu_count: number;
  ram_gb: number;
  storage_gb: number;
  status: InstanceStatus;
  ssh_public_key: string;
  connection_ip?: string;
  connection_port?: number;
  ssh_username?: string;
  provider_id: string; // prv_mock
  provider_instance_id: string; // vm-mock-8827
  customer_hourly_price_inr: number;
  created_at: string;
  started_at?: string;
  stopped_at?: string;
  terminated_at?: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  amount_inr: number;
  type: 'DEPOSIT' | 'USAGE_CHARGE' | 'REFUND' | 'CREDIT_ADJUSTMENT';
  description: string;
  reference_id?: string;
  balance_after_inr: number;
  created_at: string;
}

export interface Wallet {
  id: string;
  organization_id: string;
  balance_inr: number;
  currency: string;
}

export interface APIKey {
  id: string;
  organization_id: string;
  name: string;
  key_prefix: string;
  secret?: string; // Only populated upon creation
  created_at: string;
  last_used_at?: string;
}

export interface MarketDemandEvent {
  id: string;
  gpu_code: string;
  region_code: string;
  action: 'VIEWED' | 'CONFIGURED' | 'DEPLOY_ATTEMPTED';
  workload_category?: string;
  created_at: string;
}
