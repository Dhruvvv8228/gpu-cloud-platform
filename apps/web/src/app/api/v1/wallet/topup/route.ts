import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/server/dbStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const amount = Number(body.amount_inr || 1000);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid top-up amount' }, { status: 400 });
    }

    const tx = dbStore.addTransaction(amount, 'DEPOSIT', `Wallet deposit (Razorpay / Test Credits)`);

    return NextResponse.json({
      success: true,
      data: {
        wallet: dbStore.wallet,
        transaction: tx,
      },
      message: `Successfully added ₹${amount.toLocaleString()} to wallet`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
