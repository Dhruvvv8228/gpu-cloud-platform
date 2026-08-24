import { NextResponse } from 'next/server';
import { marketplaceStore } from '../../../../../lib/control-plane/store';
import { provisioningEngine } from '../../../../../lib/control-plane/provisioning-workflow';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const internalInst = marketplaceStore.instances.get(id);

  if (!internalInst || internalInst.organization_id !== marketplaceStore.defaultOrgId) {
    return NextResponse.json(
      { success: false, error: `Instance ${id} not found` },
      { status: 404 }
    );
  }

  const dto = provisioningEngine.toCustomerDTO(internalInst);
  return NextResponse.json({
    success: true,
    data: dto,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const terminatedInst = await provisioningEngine.terminateInstanceWorkflow(id);
    return NextResponse.json({
      success: true,
      message: `Instance ${id} terminated successfully`,
      data: terminatedInst,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to terminate instance' },
      { status: 400 }
    );
  }
}
