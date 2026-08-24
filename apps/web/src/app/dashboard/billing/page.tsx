'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Wallet, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';

export default function BillingPage() {
  const [billing, setBilling] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('5000');
  const [processing, setProcessing] = useState(false);

  const fetchBilling = async () => {
    try {
      const res = await fetch('/api/v1/billing');
      const data = await res.json();
      if (data.success) setBilling(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const res = await fetch('/api/v1/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_inr: parseFloat(depositAmount),
          payment_method: 'RAZORPAY_CARD_NETBANKING',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        fetchBilling();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Prepaid Wallet & Billing Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">Double-entry immutable transaction log and prepaid credit management.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Prepaid Credits (Razorpay)</span>
        </button>
      </div>

      {/* Wallet Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Available Balance</div>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">
            ₹{billing ? billing.wallet_balance_inr.toFixed(2) : '0.00'}
          </div>
          <div className="text-xs text-slate-500 mt-2">Currency: INR (India First Payment Engine)</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Hourly Burn Rate</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2 font-mono">
            ₹{billing ? billing.current_hourly_burn_rate_inr.toFixed(2) : '0.00'}/hr
          </div>
          <div className="text-xs text-slate-500 mt-2">Accrued automatically while instances are RUNNING</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Est. Monthly Runway</div>
          <div className="text-3xl font-extrabold text-indigo-400 mt-2 font-mono">
            ₹{billing ? billing.estimated_monthly_spend_inr.toFixed(2) : '0.00'}
          </div>
          <div className="text-xs text-slate-500 mt-2">Based on current active GPU instances</div>
        </div>
      </div>

      {/* Double-Entry Ledger Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800">
          <h2 className="font-bold text-white text-base">Immutable Wallet Ledger Transactions</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Type</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Amount (INR)</th>
                <th className="p-4 text-right">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {billing?.ledger_transactions?.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-200">{tx.id}</td>
                  <td className="p-4 text-slate-400">{new Date(tx.created_at).toLocaleString()}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'DEPOSIT' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-sans">{tx.description}</td>
                  <td className={`p-4 text-right font-bold ${tx.amount_inr > 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {tx.amount_inr > 0 ? `+₹${tx.amount_inr.toFixed(2)}` : `-₹${Math.abs(tx.amount_inr).toFixed(2)}`}
                  </td>
                  <td className="p-4 text-right text-slate-400">₹{tx.balance_after_inr.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Add Prepaid Wallet Credits</h3>
            <p className="text-xs text-slate-400 mb-6">Process instant test credit deposit via Razorpay India integration.</p>

            <form onSubmit={handleAddFunds} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Deposit Amount (INR)</label>
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 font-mono">
                Payment Gateway: Razorpay Sandbox (INR ₹)
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20"
                >
                  {processing ? 'Processing...' : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
