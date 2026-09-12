'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Cpu, Globe2, Layers, Server, Key, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import seedData from '@/lib/data/seeds.json';

function DeployWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);

  // Form State
  const [selectedGpu, setSelectedGpu] = useState(searchParams.get('gpu') || 'h100-80gb');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'ap-south-1');
  const [image, setImage] = useState('ubuntu-22.04-cuda-12.4');
  const [gpuCount, setGpuCount] = useState(1);
  const [instanceName, setInstanceName] = useState('gpu-node-01');
  const [sshPublicKey, setSshPublicKey] = useState('ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... demo@dev');
  const [workloadCategory, setWorkloadCategory] = useState('LLM Training');

  const [deploying, setDeploying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const pricingObj = seedData.pricing.find((p) => p.gpu_code === selectedGpu);
  const gpuTypeObj = seedData.gpu_types.find((g) => g.code === selectedGpu);

  const hourlyPriceINR = (pricingObj?.customer_hourly_price_inr || 0) * gpuCount;
  const estimatedDailyINR = hourlyPriceINR * 24;
  const estimatedMonthlyINR = hourlyPriceINR * 730;

  const handleDeploy = async () => {
    setDeploying(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/v1/instances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gpu_code: selectedGpu,
          region_code: selectedRegion,
          gpu_count: gpuCount,
          name: instanceName,
          image,
          ssh_public_key: sshPublicKey,
          workload_category: workloadCategory,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to trigger provisioning workflow');
      }

      // Redirect directly to instance detail page
      router.push(`/dashboard/instances/${data.data.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Deployment error');
      setDeploying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Instance Deployment Wizard</h1>
        <p className="text-xs text-slate-400 mt-1">Configure and launch high-performance NVIDIA GPU compute node.</p>
      </div>

      {/* Step Progress Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between text-xs font-mono">
        {[
          { num: 1, label: 'GPU' },
          { num: 2, label: 'Region' },
          { num: 3, label: 'Image' },
          { num: 4, label: 'Quantity' },
          { num: 5, label: 'SSH & Workload' },
          { num: 6, label: 'Review & Deploy' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s.num)}
              className={`w-7 h-7 rounded-full font-bold flex items-center justify-center transition-colors ${
                step === s.num
                  ? 'bg-blue-600 text-white'
                  : step > s.num
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </button>
            <span className={`hidden sm:inline ${step === s.num ? 'text-white font-semibold' : 'text-slate-500'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/80 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: GPU Selection */}
      {step === 1 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            Step 1: Select NVIDIA GPU Model
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seedData.gpu_types.map((g) => {
              const p = seedData.pricing.find((pr) => pr.gpu_code === g.code);
              const isSelected = selectedGpu === g.code;
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGpu(g.code)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-base">{g.name}</span>
                    <span className="text-blue-400 font-mono font-bold text-sm">₹{p?.customer_hourly_price_inr}/hr</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mb-2">
                    {g.vram_gb}GB VRAM • {g.architecture} • {g.fp16_tflops} TFLOPS
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{g.description}</p>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2"
            >
              <span>Next: Region</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Region Selection */}
      {step === 2 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-emerald-400" />
            Step 2: Select Datacenter Region
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seedData.regions.map((r) => {
              const isSelected = selectedRegion === r.code;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRegion(r.code)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-base">{r.name}</span>
                    <span className="text-xs text-emerald-400 font-mono font-semibold">ONLINE</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">{r.datacenter} ({r.code})</div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2"
            >
              <span>Next: Image</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Operating System Image */}
      {step === 3 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Step 3: Choose Operating System / Image
          </h2>
          <div className="space-y-3">
            {[
              { id: 'ubuntu-22.04-cuda-12.4', name: 'Ubuntu 22.04 LTS + PyTorch 2.5 (CUDA 12.4)', desc: 'Standard deep learning stack with pre-configured CUDA, PyTorch, vLLM, and torchvision.' },
              { id: 'ubuntu-22.04-deepspeed', name: 'Ubuntu 22.04 LTS + DeepSpeed & FlashAttention-2', desc: 'Optimized for distributed multi-GPU LLM training and fine-tuning.' },
              { id: 'ubuntu-24.04-cuda-12.6', name: 'Ubuntu 24.04 LTS Base CUDA 12.6', desc: 'Minimal clean Linux kernel for custom environment setups.' },
            ].map((img) => (
              <div
                key={img.id}
                onClick={() => setImage(img.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  image === img.id
                    ? 'bg-blue-950/40 border-blue-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white text-sm">{img.name}</div>
                <div className="text-xs text-slate-400 mt-1">{img.desc}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2"
            >
              <span>Next: Quantity</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: GPU Quantity */}
      {step === 4 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-amber-400" />
            Step 4: Select GPU Quantity
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 4, 8].map((num) => (
              <div
                key={num}
                onClick={() => setGpuCount(num)}
                className={`p-5 rounded-xl border text-center cursor-pointer transition-all ${
                  gpuCount === num
                    ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-2xl font-extrabold text-white font-mono">{num}x</div>
                <div className="text-xs text-slate-400 mt-1 font-mono">{(gpuTypeObj?.vram_gb || 80) * num}GB Total VRAM</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(5)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2"
            >
              <span>Next: SSH & Workload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: SSH & Workload Category */}
      {step === 5 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-400" />
            Step 5: Instance Name, SSH Key & Workload Purpose
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Instance Name</label>
              <input
                type="text"
                value={instanceName}
                onChange={(e) => setInstanceName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Workload Category</label>
              <select
                value={workloadCategory}
                onChange={(e) => setWorkloadCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="LLM Training">LLM Fine-Tuning & Training</option>
                <option value="LLM Inference">LLM Real-Time Inference</option>
                <option value="Computer Vision">Computer Vision & Video AI</option>
                <option value="Scientific HPC">Scientific HPC & Simulation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">SSH Public Key</label>
              <textarea
                rows={3}
                value={sshPublicKey}
                onChange={(e) => setSshPublicKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(4)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(6)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2"
            >
              <span>Next: Review & Deploy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Review & Deploy */}
      {step === 6 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Step 6: Review Configuration & Confirm Deployment
          </h2>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Selected GPU</span>
              <span className="text-white font-bold">{gpuTypeObj?.name} x{gpuCount}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Datacenter Region</span>
              <span className="text-white font-bold">{selectedRegion}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Image Stack</span>
              <span className="text-white font-bold">{image}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Compute Hardware</span>
              <span className="text-white font-bold">{(pricingObj?.vcpu_count || 16) * gpuCount} vCPU • {(pricingObj?.ram_gb || 64) * gpuCount}GB RAM • {(pricingObj?.storage_gb || 200) * gpuCount}GB NVMe</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Workload Purpose</span>
              <span className="text-white font-bold">{workloadCategory}</span>
            </div>
          </div>

          <div className="p-5 bg-blue-950/40 border border-blue-800/60 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-blue-300 font-semibold uppercase tracking-wider">Calculated Billing Rate</div>
              <div className="text-3xl font-extrabold text-white mt-1 font-mono">
                ₹{hourlyPriceINR.toFixed(2)}
                <span className="text-xs font-normal text-slate-400"> / hour</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Estimated Daily: ₹{estimatedDailyINR.toFixed(2)} • Monthly: ₹{estimatedMonthlyINR.toFixed(2)}
              </div>
            </div>

            <button
              onClick={handleDeploy}
              disabled={deploying}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 text-sm whitespace-nowrap"
            >
              {deploying ? 'Initiating Provisioning Workflow...' : 'Deploy Instance Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeployWizardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400 font-mono text-xs">Loading wizard...</div>}>
      <DeployWizardContent />
    </Suspense>
  );
}
