import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Cpu, Zap, Shield, Layers, Code, ArrowRight, CheckCircle2, Server, Globe2, Activity } from 'lucide-react';
import seedData from '@/lib/data/seeds.json';

export default function LandingPage() {
  const gpus = seedData.gpu_types;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white font-sans">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/90 border border-blue-800/80 text-blue-400 text-xs font-mono font-semibold tracking-wider uppercase mb-8 shadow-lg shadow-blue-950/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            NVIDIA Hopper & Blackwell Cluster Capacity Online
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-none">
            NVIDIA GPU Compute. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              On Demand.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Deploy high-performance GPU infrastructure by the hour for AI, ML, inference, training, computer vision and high-performance workloads.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/compute"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl ui-transition ui-button-press shadow-xl shadow-blue-600/25 text-base font-sans"
            >
              <Cpu className="w-5 h-5" />
              <span>Explore GPUs</span>
            </Link>

            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold px-8 py-3.5 rounded-xl border border-slate-700/80 ui-transition ui-button-press text-base font-sans"
            >
              <span>View Pricing Matrix</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Quick Telemetry Metrics Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/60 font-mono">
            <div className="p-4 rounded-2xl surface-step-1 border border-slate-800/80 text-left">
              <div className="text-2xl font-extrabold text-white">Sub-Minute</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold font-sans">Instant Provisioning</div>
            </div>
            <div className="p-4 rounded-2xl surface-step-1 border border-slate-800/80 text-left">
              <div className="text-2xl font-extrabold text-blue-400">100% Hourly</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold font-sans">Prepaid Ledger Billing</div>
            </div>
            <div className="p-4 rounded-2xl surface-step-1 border border-slate-800/80 text-left">
              <div className="text-2xl font-extrabold text-emerald-400">4 Global</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold font-sans">Datacenter Regions</div>
            </div>
            <div className="p-4 rounded-2xl surface-step-1 border border-slate-800/80 text-left">
              <div className="text-2xl font-extrabold text-white">REST API</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold font-sans">Programmatic SDK</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Enterprise GPU Lineup */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Enterprise NVIDIA GPU Catalog</h2>
            <p className="mt-3 text-slate-400 text-sm">
              From cost-effective L4 inference cards to massive H200 and B200 Blackwell clusters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gpus.map((gpu) => {
              const pricing = seedData.pricing.find((p) => p.gpu_code === gpu.code);
              return (
                <div
                  key={gpu.id}
                  className="rounded-2xl surface-step-1 p-6 flex flex-col justify-between ui-card-hover group border border-slate-800/80 shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-md bg-blue-950 text-blue-400 text-xs font-mono font-bold border border-blue-800/60">
                        {gpu.architecture}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800/40 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Available
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 ui-transition">
                      {gpu.name}
                    </h3>
                    <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">{gpu.description}</p>

                    <div className="mt-6 grid grid-cols-2 gap-3 text-xs border-t border-b border-slate-800/80 py-4 font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase tracking-wider">VRAM</span>
                        <span className="text-slate-200 font-bold">{gpu.vram_gb} GB</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase tracking-wider">FP16 Tensor</span>
                        <span className="text-slate-200 font-bold">{gpu.fp16_tflops} TFLOPS</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase tracking-wider">CUDA Cores</span>
                        <span className="text-slate-200 font-bold">{gpu.cuda_cores.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Interconnect</span>
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
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider font-mono ui-transition"
                    >
                      <span>Configure</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Workloads Section */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Built for Critical AI & HPC Workloads</h2>
            <p className="mt-3 text-slate-400 text-sm">Optimized CUDA stacks pre-installed for PyTorch, vLLM, TensorRT-LLM, and DeepSpeed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl surface-step-1 ui-card-hover border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-4 shadow-md">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">LLM Fine-Tuning</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Train Llama 3, Mistral, and custom multi-billion parameter foundation models with NVLink high-speed interconnects.</p>
            </div>

            <div className="p-6 rounded-2xl surface-step-1 ui-card-hover border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4 shadow-md">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Real-Time Inference</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Low-latency vLLM and TensorRT-LLM server deployments for high-throughput production token generation.</p>
            </div>

            <div className="p-6 rounded-2xl surface-step-1 ui-card-hover border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4 shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Computer Vision & 3D</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Process high-resolution video streams, NeRFs, Stable Diffusion XL, and 3D rendering pipelines.</p>
            </div>

            <div className="p-6 rounded-2xl surface-step-1 ui-card-hover border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400 mb-4 shadow-md">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Scientific HPC</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Double-precision FP64 scientific simulations, molecular dynamics, and financial quantitative models.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Developer API Code Snippet Section */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-mono mb-4">
              <Code className="w-3.5 h-3.5" />
              REST API & Python SDK
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Provision GPUs Programmatically</h2>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              Integrate compute provisioning into your CI/CD pipelines, MLOps workflows, and auto-scaling orchestrators with our developer API.
            </p>
            <ul className="mt-6 space-y-3 font-mono text-xs">
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deterministic REST API endpoints under <code className="text-blue-300 bg-slate-900 px-1.5 py-0.5 rounded">/api/v1</code></span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SHA-256 API key authentication</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated webhook notifications on state changes</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-blue-400 font-semibold px-5 py-2.5 rounded-xl border border-slate-700/80 text-xs font-mono uppercase tracking-wider ui-transition ui-button-press"
              >
                <span>Read API Documentation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl surface-step-2 p-5 font-mono text-xs overflow-x-auto shadow-2xl border border-slate-800">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800 text-slate-500">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-slate-400 font-sans text-xs font-semibold">deploy_h100.sh</span>
            </div>
            <pre className="text-slate-300 leading-relaxed">
{`curl -X POST https://api.yourgpuplatform.com/api/v1/instances \\
  -H "Authorization: Bearer sk_live_827361..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "gpu_code": "h100-80gb",
    "region_code": "ap-south-1",
    "gpu_count": 1,
    "name": "llama3-inference-node",
    "image": "ubuntu-22.04-cuda-12.4"
  }'

# Response (HTTP 202 Accepted)
{
  "success": true,
  "data": {
    "id": "inst_827361",
    "gpu_code": "h100-80gb",
    "status": "PROVISIONING",
    "customer_hourly_price_inr": 300.00
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-20 bg-blue-950/30 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Ready to Deploy GPU Infrastructure?</h2>
          <p className="mt-4 text-slate-300 text-base">
            Get started in under 60 seconds with prepaid credits and instant provisioning.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/dashboard/compute/deploy"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 text-sm ui-transition ui-button-press font-sans"
            >
              Deploy Instance Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
