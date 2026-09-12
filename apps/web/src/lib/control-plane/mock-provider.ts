import { CreateInstanceRequest, ProviderInstance } from './types';

export interface ComputeProvider {
  providerId: string;
  providerName: string;
  createInstance(req: CreateInstanceRequest): Promise<ProviderInstance>;
  getInstance(providerInstanceId: string): Promise<ProviderInstance>;
  startInstance(providerInstanceId: string): Promise<boolean>;
  stopInstance(providerInstanceId: string): Promise<boolean>;
  restartInstance(providerInstanceId: string): Promise<boolean>;
  deleteInstance(providerInstanceId: string): Promise<boolean>;
}

export class MockProvider implements ComputeProvider {
  public providerId = 'prov-mock-01';
  public providerName = 'Mock Infrastructure Provider';

  private instances: Map<string, ProviderInstance> = new Map();

  async createInstance(req: CreateInstanceRequest): Promise<ProviderInstance> {
    const providerInstanceId = `vm-mock-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomIp = `194.26.${Math.floor(Math.random() * 254 + 1)}.${Math.floor(Math.random() * 254 + 1)}`;

    const providerInstance: ProviderInstance = {
      provider_instance_id: providerInstanceId,
      status: 'PROVISIONING',
      public_ip: randomIp,
      ssh_port: 22,
      ssh_user: 'ubuntu',
      created_at: new Date().toISOString(),
    };

    this.instances.set(providerInstanceId, providerInstance);

    // Auto-transition to RUNNING asynchronously to simulate cloud provisioning latency
    setTimeout(() => {
      const inst = this.instances.get(providerInstanceId);
      if (inst && inst.status === 'PROVISIONING') {
        inst.status = 'RUNNING';
        this.instances.set(providerInstanceId, inst);
      }
    }, 1500);

    return providerInstance;
  }

  async getInstance(providerInstanceId: string): Promise<ProviderInstance> {
    const inst = this.instances.get(providerInstanceId);
    if (!inst) {
      throw new Error(`Provider instance ${providerInstanceId} not found`);
    }
    return inst;
  }

  async startInstance(providerInstanceId: string): Promise<boolean> {
    const inst = this.instances.get(providerInstanceId);
    if (!inst) return false;
    inst.status = 'RUNNING';
    this.instances.set(providerInstanceId, inst);
    return true;
  }

  async stopInstance(providerInstanceId: string): Promise<boolean> {
    const inst = this.instances.get(providerInstanceId);
    if (!inst) return false;
    inst.status = 'STOPPED';
    this.instances.set(providerInstanceId, inst);
    return true;
  }

  async restartInstance(providerInstanceId: string): Promise<boolean> {
    const inst = this.instances.get(providerInstanceId);
    if (!inst) return false;
    inst.status = 'RESTARTING';
    this.instances.set(providerInstanceId, inst);
    setTimeout(() => {
      inst.status = 'RUNNING';
      this.instances.set(providerInstanceId, inst);
    }, 1000);
    return true;
  }

  async deleteInstance(providerInstanceId: string): Promise<boolean> {
    const inst = this.instances.get(providerInstanceId);
    if (!inst) return false;
    inst.status = 'TERMINATED';
    this.instances.set(providerInstanceId, inst);
    return true;
  }
}

const globalForProvider = globalThis as unknown as {
  mockProviderSingleton: MockProvider | undefined;
};

export const mockProviderSingleton =
  globalForProvider.mockProviderSingleton ?? new MockProvider();

globalForProvider.mockProviderSingleton = mockProviderSingleton;
