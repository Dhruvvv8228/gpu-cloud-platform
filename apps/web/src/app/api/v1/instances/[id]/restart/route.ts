import { NextResponse } from 'next/server';
import { provisioningEngine } from '../../../../../../lib/control-plane/provisioning-workflow';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const inst = await provisioningEngine.restartInstanceWorkflow(id);
    return NextResponse.json({
      success: true,
      message: `Instance ${id} restarting`,
      data: inst,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
