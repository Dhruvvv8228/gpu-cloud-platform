'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
import seedData from '../../../../../db/seeds/0001_initial_seeds.json';

export default function PricingPage() {
  const [selectedGpuCode, setSelectedGpuCode] = useState('h100-80gb');
  const [gpuCount, setGpuCount] = useState(1);
  const [estimatedHours, setEstimatedHours] = useState(100);

  const selectedPricing = seedData.pricing.find((p) => p.gpu_code === selectedGpuCode);
  const selectedGpu = seedData.gpu_types.find((g) => g.code === selectedGpuCode);

  const hourlyRate = (selectedPricing?.customer_hourly_price_inr || 0) * gpuCount;
  const estimatedTotal = hourlyRate * estimatedHours;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Transparent GPU Hourly Pricing</h1>
          <p className="text-slate-400 text-base mt-3">
            Database-driven hourly billing with zero hidden fees or long-term lock-in.
          </p>
        </div>

        {/* Pricing Calculator Widget */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 max-w-4xl mx-auto mb-16 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            GPU Compute Estimator
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Select GPU Model
              </label>
              <select
                value={selectedGpuCode}
                onChange={(e) => setSelectedGpuCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {seedData.gpu_types.map((g) => {
                  const p = seedData.pricing.find((pr) => pr.gpu_code === g.code);
                  return (
                    <option key={g.id} value={g.code}>
                      {g.name} ({g.vram_gb}GB VRAM) — ₹{p?.customer_hourly_price_inr}/hr
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                2. GPU Quantity
              </label>
              <select
                value={gpuCount}
                onChange={(e) => setGpuCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value={1}>1x GPU</option>
                <option value={2}>2x GPUs</option>
                <option value={4}>4x GPUs</option>
                <option value={8}>8x GPUs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                3. Estimated Usage Hours
              </label>
              <input
                type="number"
                min={1}
                max={730}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated Total Spend</div>
              <div className="text-3xl font-extrabold text-white mt-1">
                ₹{estimatedTotal.toLocaleString()}
                <span className="text-xs text-slate-400 font-normal ml-2">(₹{hourlyRate}/hr for {estimatedHours} hours)</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Includes {selectedGpu?.name} x{gpuCount} with {selectedPricing?.vcpu_count} vCPUs and {selectedPricing?.storage_gb}GB NVMe.
              </div>
            </div>

            <Link
              href={`/dashboard/compute/deploy?gpu=${selectedGpuCode}`}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm whitespace-nowrap"
            >
              Deploy This Config
            </Link>
          </div>
        </div>

        {/* Pricing Matrix Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800">
            <h3 className="font-bold text-white text-lg">Full GPU Catalog Pricing Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-4">GPU Model</th>
                  <th className="p-4">Architecture</th>
                  <th className="p-4">VRAM</th>
                  <th className="p-4">Included vCPU</th>
                  <th className="p-4">Included RAM</th>
                  <th className="p-4">NVMe Storage</th>
                  <th className="p-4 text-right">Hourly Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
                {seedData.gpu_types.map((g) => {
                  const p = seedData.pricing.find((pr) => pr.gpu_code === g.code);
                  return (
                    <tr key={g.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-sans font-semibold text-white">{g.name}</td>
                      <td className="p-4 text-slate-400">{g.architecture}</td>
                      <td className="p-4 text-blue-400 font-semibold">{g.vram_gb} GB</td>
                      <td className="p-4">{p?.vcpu_count} Cores</td>
                      <td className="p-4">{p?.ram_gb} GB</td>
                      <td className="p-4">{p?.storage_gb} GB</td>
                      <td className="p-4 text-right font-bold text-white text-base">₹{p?.customer_hourly_price_inr}/hr</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
