'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldAlert, DollarSign, Activity, TrendingUp, Cpu, Globe2, Layers, RefreshCcw } from 'lucide-react';

export default function AdminPage() {
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/v1/admin');
      const data = await res.json();
      if (data.success) {
        setAdminData(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePriceUpdate = async (productId: string, price: number, cost: number) => {
    try {
      await fetch('/api/v1/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          customer_price_inr: price,
          provider_cost_inr: cost,
        }),
      });
      fetchAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const m = adminData?.metrics;
  const mi = adminData?.market_intelligence;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-red-400 text-xs font-mono mb-1 font-bold">
              <ShieldAlert className="w-4 h-4" />
              ADMIN CONTROL PANEL & MARKET INTELLIGENCE
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Economics & Demand Dashboard</h1>
          </div>

          <button
            onClick={fetchAdminData}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Refresh Admin Data</span>
          </button>
        </div>

        {/* Financial Metrics Cards (Requirement 37 & 40) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Revenue</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-2 font-mono">
              ₹{m?.total_revenue_inr?.toFixed(2) || '0.00'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Customer billings accrued</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Provider Cost</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-2 font-mono">
              ₹{m?.total_provider_cost_inr?.toFixed(2) || '0.00'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">External infrastructure cost</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Gross Platform Margin</div>
            <div className="text-2xl font-extrabold text-blue-400 mt-2 font-mono">
              ₹{m?.gross_margin_inr?.toFixed(2) || '0.00'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Margin: {m?.margin_percentage || 0}%</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Compute Nodes</div>
            <div className="text-2xl font-extrabold text-white mt-2 font-mono">
              {m?.active_instances || 0} <span className="text-xs text-slate-400 font-normal">({m?.total_gpu_hours || 0} hrs)</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Live customer instances</div>
          </div>
        </div>

        {/* Market Demand Intelligence Analytics (Requirement 38 & 88) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Market Intelligence & Demand Analytics
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Aggregated customer signals to guide future owned NVIDIA GPU cluster capital expenditure decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
            {/* GPU Demand */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="font-bold text-white font-sans text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                GPU Model Demand Signals
              </div>
              <div className="space-y-2">
                {mi && Object.entries(mi.demand_by_gpu || {}).map(([gpuCode, v]: any) => (
                  <div key={gpuCode} className="p-2 bg-slate-900 rounded flex justify-between">
                    <span className="text-slate-200 uppercase font-bold">{gpuCode}</span>
                    <span className="text-slate-400">Deployments: <strong className="text-blue-400">{v.deployed}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Region Demand */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="font-bold text-white font-sans text-sm flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                Region Location Demand
              </div>
              <div className="space-y-2">
                {mi && Object.entries(mi.demand_by_region || {}).map(([regCode, count]: any) => (
                  <div key={regCode} className="p-2 bg-slate-900 rounded flex justify-between">
                    <span className="text-slate-200">{regCode}</span>
                    <span className="text-emerald-400 font-bold">{count} requests</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Workload Breakdown */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="font-bold text-white font-sans text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Workload Category Split
              </div>
              <div className="space-y-2">
                {mi && Object.entries(mi.demand_by_workload || {}).map(([wl, count]: any) => (
                  <div key={wl} className="p-2 bg-slate-900 rounded flex justify-between">
                    <span className="text-slate-200">{wl}</span>
                    <span className="text-amber-400 font-bold">{count} workloads</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Margin Management Table (Requirement 40 & 66) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800">
            <h2 className="font-bold text-white text-base">Inventory Pricing & Margin Control</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">GPU Offering</th>
                  <th className="p-4">Region</th>
                  <th className="p-4">Provider Cost (₹/hr)</th>
                  <th className="p-4">Customer Price (₹/hr)</th>
                  <th className="p-4">Platform Margin (₹/hr)</th>
                  <th className="p-4">Margin %</th>
                  <th className="p-4 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {adminData?.inventory?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white font-sans">{p.gpu_name}</td>
                    <td className="p-4 text-slate-400">{p.region_code}</td>
                    <td className="p-4 text-amber-400 font-bold">₹{p.provider_cost_inr}</td>
                    <td className="p-4 text-emerald-400 font-bold">₹{p.customer_price_inr}</td>
                    <td className="p-4 text-blue-400 font-bold">₹{p.platform_margin_inr}</td>
                    <td className="p-4 text-slate-300">{p.margin_percentage}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          handlePriceUpdate(
                            p.id,
                            p.customer_price_inr + 10,
                            p.provider_cost_inr
                          )
                        }
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans"
                      >
                        +₹10 Markup
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
