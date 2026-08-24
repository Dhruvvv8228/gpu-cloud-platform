'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  Server,
  Activity,
  Zap,
  PlusCircle,
  ArrowRight,
  RefreshCcw,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { CustomerInstance } from '../../lib/control-plane/types';

export default function DashboardOverviewPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [instances, setInstances] = useState<CustomerInstance[]>([]);
  const [usage, setUsage] = useState<any>(null);
  const [billing, setBilling] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [wRes, iRes, uRes, bRes] = await Promise.all([
        fetch('/api/v1/wallet'),
        fetch('/api/v1/instances'),
        fetch('/api/v1/usage'),
        fetch('/api/v1/billing'),
      ]);

      const wData = await wRes.json();
      const iData = await iRes.json();
      const uData = await uRes.json();
      const bData = await bRes.json();

      if (wData.success) setWallet(wData.data.wallet);
      if (iData.success) setInstances(iData.data);
      if (uData.success) setUsage(uData.data);
      if (bData.success) setBilling(bData.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const runningInstances = instances.filter((i) => i.status === 'RUNNING' || i.status === 'PROVISIONING');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Compute Control Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time GPU cluster health, wallet balance, and running compute spend.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <Link
            href="/dashboard/compute/deploy"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Deploy Instance</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Wallet */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Wallet Balance</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            {wallet ? `₹${wallet.balance_inr.toFixed(2)}` : '...'}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Prepaid Credits</span>
            <Link href="/dashboard/billing" className="text-blue-400 hover:underline font-semibold">Top Up</Link>
          </div>
        </div>

        {/* Card 2: Running Instances */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Instances</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            {runningInstances.length} <span className="text-xs font-normal text-slate-400">/ {instances.length} total</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{runningInstances.length} compute nodes running</span>
          </div>
        </div>

        {/* Card 3: Monthly GPU Hours */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">GPU Hours</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            {usage ? `${usage.summary.total_gpu_hours} hrs` : '0.00 hrs'}
          </div>
          <div className="mt-2 text-xs text-slate-500">Accumulated compute time</div>
        </div>

        {/* Card 4: Current Hourly Spend */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Burn Rate</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            {billing ? `₹${billing.current_hourly_burn_rate_inr.toFixed(2)}` : '₹0.00'}
            <span className="text-xs font-normal text-slate-400"> / hr</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Active compute rate</div>
        </div>
      </div>

      {/* Main Grid: Active Instances & Recent Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Instances Table (Col Span 2) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-base">Active Compute Instances</h2>
            <Link href="/dashboard/instances" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              <span>View All ({instances.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {instances.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-lg">
              <Server className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm font-medium">No GPU instances currently deployed.</p>
              <Link
                href="/dashboard/compute/deploy"
                className="mt-4 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Deploy First GPU</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {instances.slice(0, 5).map((inst) => (
                <div key={inst.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/instances/${inst.id}`} className="font-bold text-white hover:text-blue-400 font-mono">
                        {inst.id}
                      </Link>
                      <span className="text-slate-400">({inst.name})</span>
                    </div>
                    <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                      {inst.gpu_name} • {inst.region_code} • ₹{inst.customer_hourly_price_inr}/hr
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-2.5 py-1 rounded font-mono text-[10px] font-semibold uppercase ${
                        inst.status === 'RUNNING'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : inst.status === 'PROVISIONING'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {inst.status}
                    </span>

                    <Link
                      href={`/dashboard/instances/${inst.id}`}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Ledger Transactions (Col Span 1) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-base">Wallet Ledger Activity</h2>
            <Link href="/dashboard/billing" className="text-xs text-blue-400 hover:underline">Ledger</Link>
          </div>

          <div className="space-y-3">
            {wallet && billing?.ledger_transactions?.slice(0, 5).map((tx: any) => (
              <div key={tx.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs">
                <div className="flex items-center justify-between font-mono font-semibold">
                  <span className={tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-slate-300'}>
                    {tx.type === 'DEPOSIT' ? `+₹${tx.amount_inr.toFixed(2)}` : `-₹${Math.abs(tx.amount_inr).toFixed(2)}`}
                  </span>
                  <span className="text-slate-500 text-[10px]">{new Date(tx.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-1 line-clamp-1">{tx.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
