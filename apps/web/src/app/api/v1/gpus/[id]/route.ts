import { NextResponse } from 'next/server';
import { marketplaceStore } from '../../../../../lib/control-plane/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const gpu = marketplaceStore.gpuTypes.find(
    (g) => g.id === id || g.code.toLowerCase() === id.toLowerCase()
  );

  if (!gpu) {
    return NextResponse.json(
      { success: false, error: 'GPU type not found' },
      { status: 404 }
    );
  }

  // Find products / offerings for this GPU
  const offerings = marketplaceStore.products.filter((p) => p.gpu_type_id === gpu.id || p.gpu_code === gpu.code);

  return NextResponse.json({
    success: true,
    data: {
      ...gpu,
      offerings,
    },
  });
}
