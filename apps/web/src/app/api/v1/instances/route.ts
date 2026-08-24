import { NextResponse } from 'next/server';
import { marketplaceStore } from '../../../../lib/control-plane/store';
import { provisioningEngine } from '../../../../lib/control-plane/provisioning-workflow';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');

  const allInternalInstances = Array.from(marketplaceStore.instances.values());
  let customerList = allInternalInstances
    .filter((inst) => inst.organization_id === marketplaceStore.defaultOrgId)
    .map((inst) => provisioningEngine.toCustomerDTO(inst));

  if (statusFilter) {
    customerList = customerList.filter(
      (inst) => inst.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  return NextResponse.json({
    success: true,
    count: customerList.length,
    data: customerList,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { gpu_code, region_code, gpu_count = 1, name, image, ssh_public_key, workload_category } = body;

    if (!gpu_code || !region_code) {
      return NextResponse.json(
        { success: false, error: 'gpu_code and region_code are required' },
        { status: 400 }
      );
    }

    const instance = await provisioningEngine.createInstanceWorkflow({
      gpuCode: gpu_code,
      regionCode: region_code,
      gpuCount: Number(gpu_count),
      instanceName: name,
      image,
      sshPublicKey: ssh_public_key,
      workloadCategory: workload_category,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Provisioning workflow initiated successfully',
        data: instance,
      },
      { status: 202 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to deploy instance' },
      { status: 400 }
    );
  }
}
