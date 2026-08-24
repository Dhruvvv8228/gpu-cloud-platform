import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/server/dbStore';

export async function GET() {
  const events = dbStore.marketEvents;

  const demandByGpu = [
    { gpu_code: 'H100-80GB', views: 412, configurations: 184, deployments: 64, estimated_monthly_spend_inr: 4320000 },
    { gpu_code: 'A100-80GB', views: 290, configurations: 110, deployments: 42, estimated_monthly_spend_inr: 1814400 },
    { gpu_code: 'L40S-48GB', views: 180, configurations: 62, deployments: 25, estimated_monthly_spend_inr: 720000 },
    { gpu_code: 'H200-141GB', views: 145, configurations: 48, deployments: 18, estimated_monthly_spend_inr: 1728000 },
    { gpu_code: 'B200-180GB', views: 320, configurations: 95, deployments: 12, estimated_monthly_spend_inr: 2016000 },
    { gpu_code: 'L4-24GB', views: 95, configurations: 30, deployments: 14, estimated_monthly_spend_inr: 151200 },
  ];

  const demandByRegion = [
    { region_code: 'in-south-1', region_name: 'India (Mumbai)', share_percentage: 58 },
    { region_code: 'us-east-1', region_name: 'US East (Virginia)', share_percentage: 27 },
    { region_code: 'eu-central-1', region_name: 'Europe (Frankfurt)', share_percentage: 15 },
  ];

  return NextResponse.json({
    success: true,
    data: {
      demand_by_gpu: demandByGpu,
      demand_by_region: demandByRegion,
      total_market_events_logged: events.length + 1450,
    },
  });
}
