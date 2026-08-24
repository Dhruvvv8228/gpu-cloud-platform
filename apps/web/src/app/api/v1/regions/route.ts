import { NextResponse } from 'next/server';
import { marketplaceStore } from '../../../../lib/control-plane/store';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: marketplaceStore.regions.length,
    data: marketplaceStore.regions,
  });
}
