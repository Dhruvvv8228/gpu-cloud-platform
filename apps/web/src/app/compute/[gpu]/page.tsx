import React from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Cpu, ArrowRight, ShieldCheck, CheckCircle2, Zap, Server, Globe2 } from 'lucide-react';
import seedData from '@/lib/data/seeds.json';
import { notFound } from 'next/navigation';

export default async function GPUDetailPage({
  params,
}: {
  params: Promise<{ gpu: string }>;
}) {
  const { gpu: gpuCode } = await params;

  const gpu = seedData.gpu_types.find(
    (g) => g.code.toLowerCase() === gpuCode.toLowerCase()
  );

  if (!gpu) {
    notFound();
  }

  const pricing = seedData.pricing.find((p) => p.gpu_code === gpu.code);
  const regions = seedData.regions;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <Link href="/compute" className="hover:text-blue-400">Compute</Link>
          <span>/</span>
          <span className="text-slate-200">{gpu.name}</span>
        </div>

        {/* Hero Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 mb-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-400 text-xs font-semibold border border-blue-800/60 mb-4">
              <Zap className="w-3.5 h-3.5" />
              NVIDIA {gpu.architecture} Architecture
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{gpu.name}</h1>
            <p className="text-slate-300 text-base mt-4 max-w-2xl leading-relaxed">{gpu.description}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
              <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200">
                Interconnect: <strong className="text-blue-400">{gpu.interconnect}</strong>
              </span>
              <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200">
                CUDA Cores: <strong className="text-blue-400">{gpu.cuda_cores.toLocaleString()}</strong>
              </span>
              <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200">
                Tensor Cores: <strong className="text-blue-400">{gpu.tensor_cores}</strong>
              </span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">On-Demand Rate</div>
            <div className="text-4xl font-extrabold text-white mt-2">
              ₹{pricing?.customer_hourly_price_inr}
              <span className="text-sm font-normal text-slate-400"> / hour</span>
            </div>

            <div className="mt-2 text-xs text-slate-400">
              Includes {pricing?.vcpu_count} vCPU • {pricing?.ram_gb}GB RAM • {pricing?.storage_gb}GB NVMe
            </div>

            <Link
              href={`/dashboard/compute/deploy?gpu=${gpu.code}`}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-blue-600/20 text-sm"
            >
              <span>Configure Instance</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Detailed Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              Hardware Specifications
            </h3>
            <div className="divide-y divide-slate-800/80 text-sm">
              <div className="py-3 flex justify-between">
                <span className="text-slate-400">GPU VRAM Memory</span>
                <span className="font-mono text-white font-semibold">{gpu.vram_gb} GB</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-400">Architecture</span>
                <span className="font-mono text-white font-semibold">{gpu.architecture}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-400">FP16 Tensor Compute</span>
                <span className="font-mono text-white font-semibold">{gpu.fp16_tflops} TFLOPS</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-400">FP32 Vector Compute</span>
                <span className="font-mono text-white font-semibold">{gpu.fp32_tflops} TFLOPS</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-400">FP64 Double Precision</span>
                <span className="font-mono text-white font-semibold">{gpu.fp64_tflops} TFLOPS</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-400" />
              Global Datacenter Availability
            </h3>
            <div className="space-y-3">
              {regions.map((reg) => (
                <div key={reg.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">{reg.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{reg.datacenter} ({reg.code})</div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 text-xs font-mono font-medium border border-emerald-800/40">
                    Online
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
