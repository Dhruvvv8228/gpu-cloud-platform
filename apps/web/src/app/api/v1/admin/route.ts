import { NextResponse } from 'next/server';
import { marketplaceStore } from '../../../../lib/control-plane/store';

export async function GET() {
  const instances = Array.from(marketplaceStore.instances.values());
  const runningInstances = instances.filter((i) => i.status === 'RUNNING');

  let totalRevenueINR = 0;
  let totalProviderCostINR = 0;
  let totalGpuHours = 0;

  for (const inst of instances) {
    const hours = (inst.uptime_seconds || 0) / 3600;
    totalGpuHours += hours;

    const prod = marketplaceStore.products.find((p) => p.id === inst.product_id);
    const hourlyCost = prod ? prod.provider_hourly_cost_inr * inst.gpu_count : 0;
    const hourlyPrice = inst.customer_hourly_price_inr;

    totalRevenueINR += hours * hourlyPrice;
    totalProviderCostINR += hours * hourlyCost;
  }

  const grossMarginINR = totalRevenueINR - totalProviderCostINR;
  const marginPercentage = totalRevenueINR > 0 ? (grossMarginINR / totalRevenueINR) * 100 : 0;

  // Market Demand Analytics (Requirement 38)
  const demandByGpu: Record<string, { viewed: number; configured: number; deployed: number }> = {};
  const demandByRegion: Record<string, number> = {};
  const demandByWorkload: Record<string, number> = {};

  for (const event of marketplaceStore.marketDemandEvents) {
    if (!demandByGpu[event.gpu_type_code]) {
      demandByGpu[event.gpu_type_code] = { viewed: 0, configured: 0, deployed: 0 };
    }
    if (event.action === 'VIEWED') demandByGpu[event.gpu_type_code].viewed++;
    if (event.action === 'CONFIGURED') demandByGpu[event.gpu_type_code].configured++;
    if (event.action === 'DEPLOY_ATTEMPTED') demandByGpu[event.gpu_type_code].deployed++;

    demandByRegion[event.region_code] = (demandByRegion[event.region_code] || 0) + 1;
    if (event.workload_category) {
      demandByWorkload[event.workload_category] = (demandByWorkload[event.workload_category] || 0) + 1;
    }
  }

  // Inventory Table with margin details
  const inventory = marketplaceStore.products.map((p) => ({
    id: p.id,
    gpu_code: p.gpu_code,
    gpu_name: p.gpu_name,
    region_code: p.region_code,
    provider_cost_inr: p.provider_hourly_cost_inr,
    customer_price_inr: p.customer_hourly_price_inr,
    platform_margin_inr: p.platform_margin_inr,
    margin_percentage: ((p.platform_margin_inr / p.customer_hourly_price_inr) * 100).toFixed(1) + '%',
    is_available: p.is_available,
  }));

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        total_customers: 1,
        active_instances: runningInstances.length,
        total_instances_created: instances.length,
        total_gpu_hours: parseFloat(totalGpuHours.toFixed(2)),
        total_revenue_inr: parseFloat(totalRevenueINR.toFixed(2)),
        total_provider_cost_inr: parseFloat(totalProviderCostINR.toFixed(2)),
        gross_margin_inr: parseFloat(grossMarginINR.toFixed(2)),
        margin_percentage: parseFloat(marginPercentage.toFixed(1)),
      },
      market_intelligence: {
        demand_by_gpu: demandByGpu,
        demand_by_region: demandByRegion,
        demand_by_workload: demandByWorkload,
        total_demand_signals: marketplaceStore.marketDemandEvents.length,
      },
      inventory,
      audit_logs: marketplaceStore.auditLogs,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, customer_price_inr, provider_cost_inr } = body;

    const prod = marketplaceStore.products.find((p) => p.id === product_id);
    if (!prod) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    if (customer_price_inr !== undefined) prod.customer_hourly_price_inr = Number(customer_price_inr);
    if (provider_cost_inr !== undefined) prod.provider_hourly_cost_inr = Number(provider_cost_inr);

    prod.platform_margin_inr = prod.customer_hourly_price_inr - prod.provider_hourly_cost_inr;

    marketplaceStore.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      organization_id: marketplaceStore.defaultOrgId,
      user_id: marketplaceStore.defaultUserId,
      action: 'PRICING_UPDATED',
      resource_type: 'PRODUCT',
      resource_id: product_id,
      details: `Updated ${prod.gpu_name} (${prod.region_code}) pricing: Cost=₹${prod.provider_hourly_cost_inr}, Price=₹${prod.customer_hourly_price_inr}`,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Product pricing updated successfully',
      data: prod,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
