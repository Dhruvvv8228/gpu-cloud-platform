import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Terminal, Code, Key, Server, Cpu, Play, Square, RefreshCw, Trash2 } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-10 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-mono mb-2">
            <Terminal className="w-4 h-4" />
            DEVELOPER API REFERENCE v1.0
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Public Developer REST API</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-3xl">
            Programmatically query GPU availability, manage wallet balances, deploy instances, and control lifecycle state using standard HTTP REST endpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6 text-sm">
            <div>
              <div className="font-semibold text-white mb-2 uppercase text-xs tracking-wider">Getting Started</div>
              <ul className="space-y-1 text-slate-400 font-mono text-xs">
                <li><a href="#auth" className="hover:text-blue-400 block py-1">1. Authentication</a></li>
                <li><a href="#catalog" className="hover:text-blue-400 block py-1">2. GPU Catalog</a></li>
                <li><a href="#deploy" className="hover:text-blue-400 block py-1">3. Deploy Instance</a></li>
                <li><a href="#lifecycle" className="hover:text-blue-400 block py-1">4. Instance Lifecycle</a></li>
                <li><a href="#wallet" className="hover:text-blue-400 block py-1">5. Wallet & Usage</a></li>
              </ul>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* 1. Auth */}
            <section id="auth" className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-400" />
                Authentication
              </h2>
              <p className="text-slate-300 text-sm mb-4">
                Authenticate your API requests by including your secret API key (<code className="text-blue-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">sk_live_...</code>) in the HTTP <code className="text-blue-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">Authorization</code> header.
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300">
                Authorization: Bearer sk_live_8273619284736152
              </div>
            </section>

            {/* 2. Catalog */}
            <section id="catalog" className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                GET /api/v1/gpus
              </h2>
              <p className="text-slate-300 text-sm mb-4">
                Retrieves available GPU models, hardware specifications, and performance TFLOPS metrics.
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
{`# Request
curl -X GET https://api.yourgpuplatform.com/api/v1/gpus

# Response
{
  "success": true,
  "count": 6,
  "data": [
    {
      "code": "h100-80gb",
      "name": "NVIDIA H100 80GB",
      "architecture": "Hopper",
      "vram_gb": 80,
      "fp16_tflops": 1000.0
    }
  ]
}`}
              </div>
            </section>

            {/* 3. Deploy */}
            <section id="deploy" className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-400" />
                POST /api/v1/instances
              </h2>
              <p className="text-slate-300 text-sm mb-4">
                Triggers durable provisioning state machine workflow to launch a GPU compute node.
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
{`# Request
curl -X POST https://api.yourgpuplatform.com/api/v1/instances \\
  -H "Authorization: Bearer sk_live_8273..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "gpu_code": "h100-80gb",
    "region_code": "ap-south-1",
    "gpu_count": 1,
    "name": "llama3-worker-node"
  }'

# Response (HTTP 202)
{
  "success": true,
  "message": "Provisioning workflow initiated successfully",
  "data": {
    "id": "inst_827361",
    "status": "PROVISIONING",
    "customer_hourly_price_inr": 300.00
  }
}`}
              </div>
            </section>

            {/* 4. Lifecycle */}
            <section id="lifecycle" className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Play className="w-5 h-5 text-amber-400" />
                Instance Lifecycle Control Endpoints
              </h2>
              <ul className="space-y-3 font-mono text-xs">
                <li className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <span>POST /api/v1/instances/{`{id}`}/start</span>
                  <span className="text-emerald-400">Start Stopped Instance</span>
                </li>
                <li className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <span>POST /api/v1/instances/{`{id}`}/stop</span>
                  <span className="text-amber-400">Stop Instance (Halts Compute Billing)</span>
                </li>
                <li className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <span>POST /api/v1/instances/{`{id}`}/restart</span>
                  <span className="text-blue-400">Soft Reboot Node</span>
                </li>
                <li className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <span>DELETE /api/v1/instances/{`{id}`}</span>
                  <span className="text-red-400">Terminate & Finalize Ledger Charge</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
