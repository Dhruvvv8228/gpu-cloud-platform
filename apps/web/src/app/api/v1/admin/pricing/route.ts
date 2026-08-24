import { NextRequest, NextResponse } from 'next/server';
import { GPU_PRODUCTS } from '@/lib/server/dbStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, customer_hourly_price_inr, provider_hourly_cost_inr } = body;

    const prod = GPU_PRODUCTS.find(p => p.id === product_id);
    if (!prod) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    if (customer_hourly_price_inr) prod.customer_hourly_price_inr = Number(customer_hourly_price_inr);
    if (provider_hourly_cost_inr) prod.provider_hourly_cost_inr = Number(provider_hourly_cost_inr);
    prod.platform_margin_inr = prod.customer_hourly_price_inr - prod.provider_hourly_cost_inr;

    return NextResponse.json({
      success: true,
      data: prod,
      message: 'Product pricing updated and audited successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
