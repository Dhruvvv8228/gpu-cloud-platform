'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Cpu, Search, Filter, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import seedData from '@/lib/data/seeds.json';

export default function ComputeMarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArch, setSelectedArch] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  const gpus = seedData.gpu_types;

  const filteredGpus = gpus.filter((gpu) => {
    const matchesSearch =
      gpu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gpu.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gpu.architecture.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArch = selectedArch === 'ALL' || gpu.architecture.toUpperCase() === selectedArch;
    return matchesSearch && matchesArch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-semibold tracking-wider uppercase mb-2">
            <Cpu className="w-4 h-4" />
            NVIDIA GPU Cloud Compute Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">On-Demand GPU Compute Offerings</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Filter, compare specifications, and deploy high-performance NVIDIA GPUs with database-driven hourly billing.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="surface-step-1 border border-slate-800/80 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search GPU model, architecture (Hopper, Blackwell)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 ui-transition"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="uppercase text-[10px] tracking-wider text-slate-500">Arch:</span>
              <select
                value={selectedArch}
                onChange={(e) => setSelectedArch(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="ALL">All Architectures</option>
                <option value="HOPPER">Hopper (H100/H200)</option>
                <option value="BLACKWELL">Blackwell (B200)</option>
                <option value="ADA LOVELACE">Ada Lovelace (L4/L40S)</option>
                <option value="AMPERE">Ampere (A100)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span className="uppercase text-[10px] tracking-wider text-slate-500">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="ALL">All Regions</option>
                <option value="ap-south-1">Mumbai, India (ap-south-1)</option>
                <option value="us-east-1">N. Virginia, USA (us-east-1)</option>
                <option value="us-west-2">Oregon, USA (us-west-2)</option>
                <option value="eu-west-1">Frankfurt, Germany (eu-west-1)</option>
              </select>
            </div>
          </div>
        </div>

        {/* GPU Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGpus.map((gpu) => {
            const pricing = seedData.pricing.find((p) => p.gpu_code === gpu.code);
            return (
              <div
                key={gpu.id}
                className="rounded-2xl surface-step-1 border border-slate-800/80 p-6 flex flex-col justify-between ui-card-hover group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-blue-950 text-blue-400 text-xs font-mono font-bold border border-blue-800/60">
                      {gpu.architecture}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800/40 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      In Stock
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-white group-hover:text-blue-400 ui-transition">
                    {gpu.name}
                  </h2>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">{gpu.description}</p>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-xs border-t border-b border-slate-800/80 py-4 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">VRAM</span>
                      <span className="text-slate-200 font-bold">{gpu.vram_gb} GB</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">FP16 Tensor</span>
                      <span className="text-slate-200 font-bold">{gpu.fp16_tflops} TFLOPS</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">CUDA Cores</span>
                      <span className="text-slate-200 font-bold">{gpu.cuda_cores.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">Interconnect</span>
                      <span className="text-slate-200 font-bold truncate block">{gpu.interconnect}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase block font-semibold">Rate</span>
                    <span className="text-2xl font-extrabold text-white font-mono">₹{pricing?.customer_hourly_price_inr}</span>
                    <span className="text-xs text-slate-400 font-mono">/hr</span>
                  </div>

                  <Link
                    href={`/compute/${gpu.code}`}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider ui-transition ui-button-press shadow-md shadow-blue-600/20"
                  >
                    <span>Configure</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
