import { marketplaceStore } from './store';
import { mockProviderSingleton } from './mock-provider';
import { CustomerInstance, UsageRecord } from './types';

export interface CreateInstanceWorkflowParams {
  orgId?: string;
  userId?: string;
  gpuCode: string;
  regionCode: string;
  gpuCount: number;
  instanceName: string;
  image: string;
  sshPublicKey?: string;
  workloadCategory?: string;
}

export class ProvisioningWorkflowEngine {
  /**
   * Durable CreateInstanceWorkflow
   */
  async createInstanceWorkflow(params: CreateInstanceWorkflowParams): Promise<CustomerInstance> {
    const orgId = params.orgId || marketplaceStore.defaultOrgId;
    const userId = params.userId || marketplaceStore.defaultUserId;

    // 1. Log Market Intelligence Demand Event
    marketplaceStore.logMarketDemand(
      params.gpuCode,
      params.regionCode,
      'DEPLOY_ATTEMPTED',
      params.workloadCategory,
      orgId
    );

    // 2. Validate Wallet Balance
    const wallet = marketplaceStore.getWallet(orgId);
    const product = marketplaceStore.products.find(
      (p) => p.gpu_code === params.gpuCode && p.region_code === params.regionCode
    );

    if (!product) {
      throw new Error(`GPU product ${params.gpuCode} in region ${params.regionCode} is not available.`);
    }

    const estimatedFirstHourCost = product.customer_hourly_price_inr * params.gpuCount;

    if (wallet.balance_inr < estimatedFirstHourCost) {
      throw new Error(
        `Insufficient wallet credits (Balance: ₹${wallet.balance_inr.toFixed(
          2
        )}). Minimum ₹${estimatedFirstHourCost.toFixed(2)} required to deploy.`
      );
    }

    // 3. Generate Customer Instance ID (NEVER provider ID)
    const customerInstanceId = `inst_${Math.floor(100000 + Math.random() * 900000)}`;

    // 4. Invoke Provider Layer (MockProvider)
    const providerInstance = await mockProviderSingleton.createInstance({
      platform_instance_id: customerInstanceId,
      gpu_code: params.gpuCode,
      region_code: params.regionCode,
      gpu_count: params.gpuCount,
      image: params.image,
      ssh_public_key: params.sshPublicKey,
    });

    const now = new Date().toISOString();

    const internalInstanceRecord = {
      id: customerInstanceId,
      organization_id: orgId,
      user_id: userId,
      product_id: product.id,
      gpu_code: params.gpuCode,
      gpu_name: product.gpu_name,
      region_code: params.regionCode,
      gpu_count: params.gpuCount,
      name: params.instanceName || `${product.gpu_name}-${params.regionCode}`,
      status: 'PROVISIONING' as const,
      connection_ip: providerInstance.public_ip,
      connection_port: 22,
      ssh_username: 'ubuntu',
      ssh_public_key: params.sshPublicKey || 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...',
      image: params.image || 'Ubuntu 22.04 LTS (PyTorch 2.5)',
      customer_hourly_price_inr: product.customer_hourly_price_inr * params.gpuCount,
      provider_id: mockProviderSingleton.providerId,
      provider_instance_id: providerInstance.provider_instance_id, // Encapsulated internally!
      created_at: now,
      started_at: now,
      current_spend_inr: 0,
      uptime_seconds: 0,
    };

    // Store in backend memory
    marketplaceStore.instances.set(customerInstanceId, internalInstanceRecord);

    // 5. Track Usage Record
    const usageRecord: UsageRecord = {
      id: `usg_${Date.now()}_${customerInstanceId}`,
      instance_id: customerInstanceId,
      organization_id: orgId,
      gpu_code: params.gpuCode,
      start_time: now,
      duration_seconds: 0,
      rate_per_hour_inr: product.customer_hourly_price_inr * params.gpuCount,
      total_charge_inr: 0,
      billing_status: 'UNBILLED',
    };
    marketplaceStore.usageRecords.push(usageRecord);

    // Audit log
    marketplaceStore.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      organization_id: orgId,
      user_id: userId,
      action: 'INSTANCE_CREATED',
      resource_type: 'INSTANCE',
      resource_id: customerInstanceId,
      details: `Deployed ${product.gpu_name} in ${params.regionCode}`,
      created_at: now,
    });

    // Asynchronously update state to RUNNING after brief simulation delay
    setTimeout(() => {
      const inst = marketplaceStore.instances.get(customerInstanceId);
      if (inst && inst.status === 'PROVISIONING') {
        inst.status = 'RUNNING';
        inst.started_at = new Date().toISOString();
        marketplaceStore.instances.set(customerInstanceId, inst);
      }
    }, 1500);

    return this.toCustomerDTO(internalInstanceRecord);
  }

  /**
   * Stop Instance Workflow
   */
  async stopInstanceWorkflow(instanceId: string, orgId: string = marketplaceStore.defaultOrgId): Promise<CustomerInstance> {
    const inst = marketplaceStore.instances.get(instanceId);
    if (!inst || inst.organization_id !== orgId) {
      throw new Error(`Instance ${instanceId} not found or access denied.`);
    }

    if (inst.status === 'TERMINATED') {
      throw new Error(`Cannot stop terminated instance ${instanceId}.`);
    }

    await mockProviderSingleton.stopInstance(inst.provider_instance_id);

    inst.status = 'STOPPED';
    inst.stopped_at = new Date().toISOString();

    // Calculate usage charge for the period up to stop
    this.calculateAndDeductUsageCharge(inst);

    marketplaceStore.instances.set(instanceId, inst);

    marketplaceStore.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      organization_id: orgId,
      user_id: inst.user_id,
      action: 'INSTANCE_STOPPED',
      resource_type: 'INSTANCE',
      resource_id: instanceId,
      details: `Stopped instance ${instanceId}`,
      created_at: new Date().toISOString(),
    });

    return this.toCustomerDTO(inst);
  }

  /**
   * Start Instance Workflow
   */
  async startInstanceWorkflow(instanceId: string, orgId: string = marketplaceStore.defaultOrgId): Promise<CustomerInstance> {
    const inst = marketplaceStore.instances.get(instanceId);
    if (!inst || inst.organization_id !== orgId) {
      throw new Error(`Instance ${instanceId} not found or access denied.`);
    }

    if (inst.status === 'TERMINATED') {
      throw new Error(`Cannot start terminated instance ${instanceId}.`);
    }

    // Verify wallet has funds before restarting
    const wallet = marketplaceStore.getWallet(orgId);
    if (wallet.balance_inr <= 0) {
      throw new Error(`Cannot start instance. Wallet balance is zero or negative (₹${wallet.balance_inr.toFixed(2)}). Please add funds.`);
    }

    await mockProviderSingleton.startInstance(inst.provider_instance_id);

    inst.status = 'RUNNING';
    inst.started_at = new Date().toISOString();
    inst.stopped_at = undefined;

    marketplaceStore.instances.set(instanceId, inst);

    return this.toCustomerDTO(inst);
  }

  /**
   * Restart Instance Workflow
   */
  async restartInstanceWorkflow(instanceId: string, orgId: string = marketplaceStore.defaultOrgId): Promise<CustomerInstance> {
    const inst = marketplaceStore.instances.get(instanceId);
    if (!inst || inst.organization_id !== orgId) {
      throw new Error(`Instance ${instanceId} not found or access denied.`);
    }

    await mockProviderSingleton.restartInstance(inst.provider_instance_id);
    inst.status = 'RESTARTING';

    setTimeout(() => {
      inst.status = 'RUNNING';
      marketplaceStore.instances.set(instanceId, inst);
    }, 1000);

    marketplaceStore.instances.set(instanceId, inst);
    return this.toCustomerDTO(inst);
  }

  /**
   * Terminate Instance Workflow
   */
  async terminateInstanceWorkflow(instanceId: string, orgId: string = marketplaceStore.defaultOrgId): Promise<CustomerInstance> {
    const inst = marketplaceStore.instances.get(instanceId);
    if (!inst || inst.organization_id !== orgId) {
      throw new Error(`Instance ${instanceId} not found or access denied.`);
    }

    await mockProviderSingleton.deleteInstance(inst.provider_instance_id);

    inst.status = 'TERMINATED';
    inst.terminated_at = new Date().toISOString();

    // Final usage deduction
    this.calculateAndDeductUsageCharge(inst);

    marketplaceStore.instances.set(instanceId, inst);

    marketplaceStore.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      organization_id: orgId,
      user_id: inst.user_id,
      action: 'INSTANCE_TERMINATED',
      resource_type: 'INSTANCE',
      resource_id: instanceId,
      details: `Terminated instance ${instanceId}`,
      created_at: new Date().toISOString(),
    });

    return this.toCustomerDTO(inst);
  }

  /**
   * Computes usage duration and posts an immutable DEPOSIT / USAGE_CHARGE ledger entry to wallet_transactions
   */
  private calculateAndDeductUsageCharge(inst: typeof marketplaceStore.instances extends Map<any, infer T> ? T : never) {
    if (!inst.started_at) return;

    const startTime = new Date(inst.started_at).getTime();
    const endTime = inst.stopped_at ? new Date(inst.stopped_at).getTime() : new Date().getTime();
    const durationSeconds = Math.max(1, Math.floor((endTime - startTime) / 1000));
    const hours = durationSeconds / 3600;

    const chargeINR = parseFloat((hours * inst.customer_hourly_price_inr).toFixed(2));
    const finalCharge = Math.max(0.10, chargeINR); // Minimum micro charge for tracking test

    inst.current_spend_inr = (inst.current_spend_inr || 0) + finalCharge;
    inst.uptime_seconds = (inst.uptime_seconds || 0) + durationSeconds;

    if (finalCharge > 0) {
      marketplaceStore.deductWalletFunds(
        inst.organization_id,
        finalCharge,
        `GPU Compute Usage: ${inst.gpu_name} (${inst.name}) for ${Math.ceil(durationSeconds / 60)} min(s)`,
        `idemp_usg_${inst.id}_${Date.now()}`
      );
    }
  }

  /**
   * Strict Sanitizer: Converts internal instance record to customer-facing DTO (stripping provider_instance_id!)
   */
  toCustomerDTO(internalRecord: any): CustomerInstance {
    const { provider_instance_id, ...dto } = internalRecord;

    // Calculate live uptime & spend if RUNNING
    if (dto.status === 'RUNNING' && dto.started_at) {
      const liveSeconds = Math.floor((new Date().getTime() - new Date(dto.started_at).getTime()) / 1000);
      dto.uptime_seconds = liveSeconds;
      const liveHours = Math.max(0.01, liveSeconds / 3600);
      dto.current_spend_inr = parseFloat((liveHours * dto.customer_hourly_price_inr).toFixed(2));
    }

    return dto;
  }
}

const globalForEngine = globalThis as unknown as {
  provisioningEngine: ProvisioningWorkflowEngine | undefined;
};

export const provisioningEngine =
  globalForEngine.provisioningEngine ?? new ProvisioningWorkflowEngine();

globalForEngine.provisioningEngine = provisioningEngine;
