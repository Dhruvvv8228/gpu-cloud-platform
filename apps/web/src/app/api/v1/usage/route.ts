import { NextResponse } from 'next/server';
import { marketplaceStore } from '../../../../lib/control-plane/store';

export async function GET() {
  const instances = Array.from(marketplaceStore.instances.values())
    .filter((i) => i.organization_id === marketplaceStore.defaultOrgId);

  const usageByGpu: Record<string, { total_hours: number; total_spend_inr: number; active_instances: number }> = {};

  let totalGpuHours = 0;
  let totalSpendINR = 0;

  for (const inst of instances) {
    const hours = (inst.uptime_seconds || 0) / 3600;
    const spend = inst.current_spend_inr || 0;

    totalGpuHours += hours;
    totalSpendINR += spend;

    if (!usageByGpu[inst.gpu_code]) {
      usageByGpu[inst.gpu_code] = { total_hours: 0, total_spend_inr: 0, active_instances: 0 };
    }

    usageByGpu[inst.gpu_code].total_hours += hours;
    usageByGpu[inst.gpu_code].total_spend_inr += spend;
    if (inst.status === 'RUNNING' || inst.status === 'PROVISIONING') {
      usageByGpu[inst.gpu_code].active_instances += 1;
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        total_gpu_hours: parseFloat(totalGpuHours.toFixed(2)),
        total_spend_inr: parseFloat(totalSpendINR.toFixed(2)),
        active_instances_count: instances.filter((i) => i.status === 'RUNNING').length,
      },
      usage_by_gpu: usageByGpu,
      records: marketplaceStore.usageRecords,
    },
  });
}
