import { NextResponse } from 'next/server';
import { marketplaceStore } from '../../../../../lib/control-plane/store';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = marketplaceStore.apiKeys.findIndex((k) => k.id === id);

  if (index === -1) {
    return NextResponse.json(
      { success: false, error: 'API key not found' },
      { status: 404 }
    );
  }

  const deleted = marketplaceStore.apiKeys.splice(index, 1)[0];
  return NextResponse.json({
    success: true,
    message: `API Key ${deleted.name} revoked successfully`,
  });
}
