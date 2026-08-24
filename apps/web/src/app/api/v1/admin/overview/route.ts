import { NextResponse } from 'next/server';
import { dbStore, GPU_PRODUCTS } from '@/lib/server/dbStore';

export async function GET() {
  const instances = Array.from(dbStore.instances.values());
  const activeInstances = instances.filter(i => i.status === 'RUNNING');

  const totalRevenue = activeInstances.reduce((sum, i) => sum + i.customer_hourly_price_inr, 0);
  const totalProviderCost = activeInstances.reduce((sum, i) => {
    const prod = GPU_PRODUCTS.find(p => p.gpu_code === i.gpu_code);
    return sum + (prod ? prod.provider_hourly_cost_inr : i.customer_hourly_price_inr * 0.8);
  }, 0);

  const grossMargin = totalRevenue - totalProviderCost;

  return NextResponse.json({
    success: true,
    data: {
      total_users: 142,
      active_customers: 28,
      running_instances: activeInstances.length,
      monthly_gpu_hours: 1420.5,
      hourly_revenue_inr: totalRevenue,
      hourly_provider_cost_inr: totalProviderCost,
      hourly_gross_margin_inr: grossMargin,
      gross_margin_percentage: totalRevenue > 0 ? Number(((grossMargin / totalRevenue) * 100).toFixed(1)) : 22.5,
    },
  });
}
