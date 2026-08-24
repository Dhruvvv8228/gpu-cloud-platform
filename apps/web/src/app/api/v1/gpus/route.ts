import { NextResponse } from 'next/server';
import { marketplaceStore } from '../../../../lib/control-plane/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minVram = searchParams.get('min_vram');
  const architecture = searchParams.get('architecture');

  let list = marketplaceStore.gpuTypes;

  if (minVram) {
    list = list.filter((g) => g.vram_gb >= parseInt(minVram, 10));
  }
  if (architecture) {
    list = list.filter((g) => g.architecture.toLowerCase().includes(architecture.toLowerCase()));
  }

  return NextResponse.json({
    success: true,
    count: list.length,
    data: list,
  });
}
