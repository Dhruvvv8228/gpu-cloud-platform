import { NextResponse } from 'next/server';
import { marketplaceStore } from '../../../../lib/control-plane/store';
import { ApiKey } from '../../../../lib/control-plane/types';

export async function GET() {
  const keys = marketplaceStore.apiKeys.filter(
    (k) => k.organization_id === marketplaceStore.defaultOrgId
  );

  return NextResponse.json({
    success: true,
    data: keys.map((k) => ({
      id: k.id,
      name: k.name,
      key_prefix: k.key_prefix,
      created_at: k.created_at,
      last_used_at: k.last_used_at,
    })),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Key name is required' },
        { status: 400 }
      );
    }

    const randomSecretSuffix = Math.random().toString(36).substring(2, 18) + Math.random().toString(36).substring(2, 18);
    const rawSecret = `sk_live_${randomSecretSuffix}`;
    const keyPrefix = rawSecret.substring(0, 15) + '...';

    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      organization_id: marketplaceStore.defaultOrgId,
      user_id: marketplaceStore.defaultUserId,
      name,
      key_prefix: keyPrefix,
      hashed_secret: 'hash_' + randomSecretSuffix, // SHA-256 placeholder
      created_at: new Date().toISOString(),
    };

    marketplaceStore.apiKeys.unshift(newKey);

    return NextResponse.json(
      {
        success: true,
        message: 'API Key generated successfully. Save this secret key as it will NOT be displayed again.',
        data: {
          id: newKey.id,
          name: newKey.name,
          secret_key: rawSecret, // Return secret ONCE upon creation
          key_prefix: newKey.key_prefix,
          created_at: newKey.created_at,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create API Key' },
      { status: 500 }
    );
  }
}
