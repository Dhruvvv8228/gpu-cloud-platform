import { NextResponse } from 'next/server';
import { marketplaceStore } from '../../../../lib/control-plane/store';

export async function GET() {
  const wallet = marketplaceStore.getWallet();
  const ledger = marketplaceStore.walletTransactions.filter(
    (tx) => tx.wallet_id === wallet.id
  );

  const runningInstances = Array.from(marketplaceStore.instances.values())
    .filter((i) => i.organization_id === marketplaceStore.defaultOrgId && i.status === 'RUNNING');

  const currentHourlyBurnRateINR = runningInstances.reduce(
    (sum, inst) => sum + inst.customer_hourly_price_inr,
    0
  );

  return NextResponse.json({
    success: true,
    data: {
      wallet_balance_inr: wallet.balance_inr,
      currency: wallet.currency,
      current_hourly_burn_rate_inr: currentHourlyBurnRateINR,
      estimated_monthly_spend_inr: currentHourlyBurnRateINR * 730,
      ledger_transactions: ledger,
    },
  });
}
