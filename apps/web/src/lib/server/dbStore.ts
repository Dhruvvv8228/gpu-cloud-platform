import { GPUType, Region, GPUProduct, ComputeInstance, Wallet, WalletTransaction, APIKey, MarketDemandEvent, InstanceStatus } from '../types';

// Seed Catalog Data
export const GPU_TYPES: GPUType[] = [
  {
    id: 'gpu_l4',
    name: 'NVIDIA L4',
    code: 'L4-24GB',
    architecture: 'Ada Lovelace',
    vram_gb: 24,
    cuda_cores: 7424,
    tensor_cores: 232,
    fp64_tflops: 0.47,
    fp32_tflops: 30.3,
    fp16_tflops: 242,
    interconnect: 'PCIe Gen4',
    description: 'Optimal low-latency GPU for AI inference, video processing, and computer vision workloads.',
  },
  {
    id: 'gpu_l40s',
    name: 'NVIDIA L40S',
    code: 'L40S-48GB',
    architecture: 'Ada Lovelace',
    vram_gb: 48,
    cuda_cores: 18176,
    tensor_cores: 568,
    fp64_tflops: 1.43,
    fp32_tflops: 91.6,
    fp16_tflops: 366,
    interconnect: 'PCIe Gen4',
    description: 'Universal data center GPU built for generative AI inference, fine-tuning, and graphics.',
  },
  {
    id: 'gpu_a100',
    name: 'NVIDIA A100 80GB',
    code: 'A100-80GB',
    architecture: 'Ampere',
    vram_gb: 80,
    cuda_cores: 6912,
    tensor_cores: 432,
    fp64_tflops: 9.7,
    fp32_tflops: 19.5,
    fp16_tflops: 312,
    interconnect: 'NVLink 600 GB/s',
    description: 'Workhorse tensor core GPU for deep learning training, massive data analytics, and HPC.',
  },
  {
    id: 'gpu_h100',
    name: 'NVIDIA H100 80GB',
    code: 'H100-80GB',
    architecture: 'Hopper',
    vram_gb: 80,
    cuda_cores: 14592,
    tensor_cores: 456,
    fp64_tflops: 34.0,
    fp32_tflops: 67.0,
    fp16_tflops: 989,
    interconnect: 'NVLink 900 GB/s',
    description: 'Industry standard flagship GPU powering large language model (LLM) training and inference.',
  },
  {
    id: 'gpu_h200',
    name: 'NVIDIA H200',
    code: 'H200-141GB',
    architecture: 'Hopper',
    vram_gb: 141,
    cuda_cores: 14592,
    tensor_cores: 456,
    fp64_tflops: 34.0,
    fp32_tflops: 67.0,
    fp16_tflops: 989,
    interconnect: 'NVLink 900 GB/s',
    description: 'Next-gen Hopper GPU equipped with 141GB HBM3e memory for massive model weights.',
  },
  {
    id: 'gpu_b200',
    name: 'NVIDIA Blackwell B200',
    code: 'B200-180GB',
    architecture: 'Blackwell',
    vram_gb: 180,
    cuda_cores: 20480,
    tensor_cores: 640,
    fp64_tflops: 45.0,
    fp32_tflops: 90.0,
    fp16_tflops: 2250,
    interconnect: 'NVLink 1.8 TB/s',
    description: 'Blackwell architecture delivering up to 30x inference performance for trillion-parameter models.',
  },
];

export const REGIONS: Region[] = [
  { id: 'reg_in_south', code: 'in-south-1', name: 'Asia Pacific (India - Mumbai)', country: 'India', datacenter: 'Yotta NM1', status: 'ONLINE' },
  { id: 'reg_us_east', code: 'us-east-1', name: 'US East (N. Virginia)', country: 'USA', datacenter: 'Equinix VA2', status: 'ONLINE' },
  { id: 'reg_eu_central', code: 'eu-central-1', name: 'Europe (Frankfurt)', country: 'Germany', datacenter: 'Interxion FRA1', status: 'ONLINE' },
];

export const GPU_PRODUCTS: GPUProduct[] = [
  { id: 'prd_l4_in', gpu_type_id: 'gpu_l4', gpu_code: 'L4-24GB', gpu_name: 'NVIDIA L4', vram_gb: 24, region_code: 'in-south-1', region_name: 'India (Mumbai)', gpu_count: 1, vcpu_count: 8, ram_gb: 32, storage_gb: 200, provider_hourly_cost_inr: 35.0, customer_hourly_price_inr: 45.0, platform_margin_inr: 10.0, is_available: true },
  { id: 'prd_l40s_in', gpu_type_id: 'gpu_l40s', gpu_code: 'L40S-48GB', gpu_name: 'NVIDIA L40S', vram_gb: 48, region_code: 'in-south-1', region_name: 'India (Mumbai)', gpu_count: 1, vcpu_count: 16, ram_gb: 64, storage_gb: 500, provider_hourly_cost_inr: 90.0, customer_hourly_price_inr: 120.0, platform_margin_inr: 30.0, is_available: true },
  { id: 'prd_a100_in', gpu_type_id: 'gpu_a100', gpu_code: 'A100-80GB', gpu_name: 'NVIDIA A100 80GB', vram_gb: 80, region_code: 'in-south-1', region_name: 'India (Mumbai)', gpu_count: 1, vcpu_count: 30, ram_gb: 120, storage_gb: 1000, provider_hourly_cost_inr: 140.0, customer_hourly_price_inr: 180.0, platform_margin_inr: 40.0, is_available: true },
  { id: 'prd_h100_in', gpu_type_id: 'gpu_h100', gpu_code: 'H100-80GB', gpu_name: 'NVIDIA H100 80GB', vram_gb: 80, region_code: 'in-south-1', region_name: 'India (Mumbai)', gpu_count: 1, vcpu_count: 52, ram_gb: 240, storage_gb: 2000, provider_hourly_cost_inr: 240.0, customer_hourly_price_inr: 300.0, platform_margin_inr: 60.0, is_available: true },
  { id: 'prd_h200_in', gpu_type_id: 'gpu_h200', gpu_code: 'H200-141GB', gpu_name: 'NVIDIA H200', vram_gb: 141, region_code: 'in-south-1', region_name: 'India (Mumbai)', gpu_count: 1, vcpu_count: 64, ram_gb: 320, storage_gb: 2000, provider_hourly_cost_inr: 320.0, customer_hourly_price_inr: 400.0, platform_margin_inr: 80.0, is_available: true },
  { id: 'prd_b200_in', gpu_type_id: 'gpu_b200', gpu_code: 'B200-180GB', gpu_name: 'NVIDIA Blackwell B200', vram_gb: 180, region_code: 'in-south-1', region_name: 'India (Mumbai)', gpu_count: 1, vcpu_count: 96, ram_gb: 512, storage_gb: 4000, provider_hourly_cost_inr: 550.0, customer_hourly_price_inr: 700.0, platform_margin_inr: 150.0, is_available: true },

  { id: 'prd_h100_us', gpu_type_id: 'gpu_h100', gpu_code: 'H100-80GB', gpu_name: 'NVIDIA H100 80GB', vram_gb: 80, region_code: 'us-east-1', region_name: 'US East (N. Virginia)', gpu_count: 1, vcpu_count: 52, ram_gb: 240, storage_gb: 2000, provider_hourly_cost_inr: 240.0, customer_hourly_price_inr: 300.0, platform_margin_inr: 60.0, is_available: true },
  { id: 'prd_h100_eu', gpu_type_id: 'gpu_h100', gpu_code: 'H100-80GB', gpu_name: 'NVIDIA H100 80GB', vram_gb: 80, region_code: 'eu-central-1', region_name: 'Europe (Frankfurt)', gpu_count: 1, vcpu_count: 52, ram_gb: 240, storage_gb: 2000, provider_hourly_cost_inr: 250.0, customer_hourly_price_inr: 310.0, platform_margin_inr: 60.0, is_available: true },
];

// Persistent Global In-Memory Store
class Store {
  wallet: Wallet = {
    id: 'wlt_demo_org',
    organization_id: 'org_demo',
    balance_inr: 5000.0, // Initial ₹5,000 credit
    currency: 'INR',
  };

  transactions: WalletTransaction[] = [
    {
      id: 'tx_init_deposit',
      wallet_id: 'wlt_demo_org',
      amount_inr: 5000.0,
      type: 'DEPOSIT',
      description: 'Initial Wallet Credit Bonus',
      balance_after_inr: 5000.0,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  instances: Map<string, ComputeInstance> = new Map();
  apiKeys: Map<string, APIKey> = new Map();
  marketEvents: MarketDemandEvent[] = [];

  constructor() {
    // Seed initial demo API key
    this.apiKeys.set('key_demo_1', {
      id: 'key_demo_1',
      organization_id: 'org_demo',
      name: 'Production Deploy Key',
      key_prefix: 'sk_live_8273',
      created_at: new Date(Date.now() - 36000000).toISOString(),
      last_used_at: new Date().toISOString(),
    });
  }

  // Wallet Functions (Double-Entry Immutable Ledger)
  addTransaction(amount_inr: number, type: 'DEPOSIT' | 'USAGE_CHARGE' | 'REFUND' | 'CREDIT_ADJUSTMENT', description: string, reference_id?: string): WalletTransaction {
    const newBalance = Number((this.wallet.balance_inr + amount_inr).toFixed(2));
    this.wallet.balance_inr = newBalance;

    const tx: WalletTransaction = {
      id: `tx_${Math.random().toString(36).substring(2, 9)}`,
      wallet_id: this.wallet.id,
      amount_inr,
      type,
      description,
      reference_id,
      balance_after_inr: newBalance,
      created_at: new Date().toISOString(),
    };

    this.transactions.unshift(tx);
    return tx;
  }

  // Instance Provisioning State Machine (MockProvider Integration)
  createInstance(params: {
    name: string;
    gpu_code: string;
    region_code: string;
    gpu_count: number;
    ssh_public_key: string;
  }): ComputeInstance {
    const product = GPU_PRODUCTS.find(p => p.gpu_code === params.gpu_code && p.region_code === params.region_code) || GPU_PRODUCTS[3];
    const instId = `inst_${Math.floor(100000 + Math.random() * 900000)}`;
    const providerVmId = `vm-mock-${Math.floor(1000 + Math.random() * 9000)}`;

    const instance: ComputeInstance = {
      id: instId,
      organization_id: 'org_demo',
      user_id: 'usr_demo',
      name: params.name || `${params.gpu_code}-instance`,
      gpu_code: product.gpu_code,
      gpu_name: product.gpu_name,
      region_code: product.region_code,
      gpu_count: params.gpu_count || 1,
      vcpu_count: product.vcpu_count,
      ram_gb: product.ram_gb,
      storage_gb: product.storage_gb,
      status: 'PENDING',
      ssh_public_key: params.ssh_public_key,
      provider_id: 'prv_mock',
      provider_instance_id: providerVmId,
      customer_hourly_price_inr: product.customer_hourly_price_inr,
      created_at: new Date().toISOString(),
    };

    this.instances.set(instId, instance);

    // Record Market Demand Event
    this.marketEvents.push({
      id: `mkt_${Math.random().toString(36).substring(2, 9)}`,
      gpu_code: params.gpu_code,
      region_code: params.region_code,
      action: 'DEPLOY_ATTEMPTED',
      workload_category: 'AI Training / Inference',
      created_at: new Date().toISOString(),
    });

    // Simulate Durable Workflow State Transitions: PENDING -> PROVISIONING -> RUNNING
    setTimeout(() => {
      const current = this.instances.get(instId);
      if (current && current.status === 'PENDING') {
        current.status = 'PROVISIONING';
        this.instances.set(instId, current);
      }
    }, 1500);

    setTimeout(() => {
      const current = this.instances.get(instId);
      if (current && current.status === 'PROVISIONING') {
        current.status = 'RUNNING';
        current.started_at = new Date().toISOString();
        current.connection_ip = `154.28.${Math.floor(10 + Math.random() * 90)}.${Math.floor(100 + Math.random() * 150)}`;
        current.connection_port = 22;
        current.ssh_username = 'root';
        this.instances.set(instId, current);
      }
    }, 4500);

    return instance;
  }

  updateInstanceStatus(id: string, status: InstanceStatus): ComputeInstance | null {
    const inst = this.instances.get(id);
    if (!inst) return null;

    inst.status = status;
    if (status === 'STOPPED') inst.stopped_at = new Date().toISOString();
    if (status === 'TERMINATED') {
      inst.terminated_at = new Date().toISOString();

      // Deduct usage charge upon termination
      const hourlyRate = inst.customer_hourly_price_inr;
      const charge = Number((hourlyRate * 0.1).toFixed(2)); // Mock usage calculation
      this.addTransaction(-charge, 'USAGE_CHARGE', `Compute runtime charge for instance ${inst.id} (${inst.gpu_name})`, inst.id);
    }

    this.instances.set(id, inst);
    return inst;
  }
}

// Global Singleton Store Instance
export const dbStore = new Store();
