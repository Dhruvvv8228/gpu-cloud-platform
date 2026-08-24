import { NextResponse } from 'next/server';
import { marketplaceStore } from '../../../../lib/control-plane/store';

export async function GET() {
  const pricingMatrix = marketplaceStore.products.map((p) => ({
    gpu_code: p.gpu_code,
    gpu_name: p.gpu_name,
    region_code: p.region_code,
    customer_hourly_price_inr: p.customer_hourly_price_inr,
    provider_hourly_cost_inr: p.provider_hourly_cost_inr,
    platform_margin_inr: p.platform_margin_inr,
    vcpu_count: p.vcpu_count,
    ram_gb: p.ram_gb,
    storage_gb: p.storage_gb,
    is_available: p.is_available,
  }));

  return NextResponse.json({
    success: true,
    count: pricingMatrix.length,
    data: pricingMatrix,
  });
}
