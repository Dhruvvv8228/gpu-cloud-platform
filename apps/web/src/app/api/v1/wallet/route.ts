import { NextResponse } from 'next/server';
import { marketplaceStore } from '../../../../lib/control-plane/store';

export async function GET() {
  const wallet = marketplaceStore.getWallet();
  const transactions = marketplaceStore.walletTransactions.filter(
    (tx) => tx.wallet_id === wallet.id
  );

  return NextResponse.json({
    success: true,
    data: {
      wallet,
      transactions,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount_inr, payment_method = 'MOCK_RAZORPAY', reference_id } = body;

    const amount = Number(amount_inr);
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid amount_inr is required (> 0)' },
        { status: 400 }
      );
    }

    const tx = marketplaceStore.addWalletFunds(
      marketplaceStore.defaultOrgId,
      amount,
      `Prepaid Wallet Recharge via ${payment_method}`,
      reference_id || `rzp_${Date.now()}`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully added ₹${amount.toFixed(2)} to wallet`,
      data: {
        transaction: tx,
        wallet: marketplaceStore.getWallet(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to add wallet funds' },
      { status: 500 }
    );
  }
}
