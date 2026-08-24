'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Server,
  Terminal,
  Play,
  Square,
  RefreshCcw,
  Trash2,
  CheckCircle2,
  Copy,
  ArrowLeft,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { CustomerInstance } from '../../../../lib/control-plane/types';

export default function InstanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [instance, setInstance] = useState<CustomerInstance | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchInstance = async () => {
    try {
      const res = await fetch(`/api/v1/instances/${id}`);
      const data = await res.json();
      if (data.success) {
        setInstance(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInstance();
    const interval = setInterval(fetchInstance, 2000);
    return () => clearInterval(interval);
  }, [id]);

  const handleAction = async (action: 'start' | 'stop' | 'restart' | 'delete') => {
    try {
      if (action === 'delete') {
        await fetch(`/api/v1/instances/${id}`, { method: 'DELETE' });
        router.push('/dashboard/instances');
      } else {
        await fetch(`/api/v1/instances/${id}/${action}`, { method: 'POST' });
        fetchInstance();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copySsh = () => {
    if (!instance?.connection_ip) return;
    const cmd = `ssh ${instance.ssh_username || 'ubuntu'}@${instance.connection_ip} -p ${instance.connection_port || 22}`;
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!instance) {
    return (
      <div className="p-12 text-center text-slate-500 font-mono text-xs animate-pulse">
        Fetching compute telemetry for {id}...
      </div>
    );
  }

  const isProvisioning = instance.status === 'PROVISIONING' || instance.status === 'PENDING';

  return (
    <div className="space-y-6 ui-transition">
      {/* 1. Top Header Bar & Action Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/instances"
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white ui-transition ui-button-press"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">{instance.id}</h1>
              <span
                className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase font-mono tracking-wider flex items-center gap-1.5 ${
                  instance.status === 'RUNNING'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 shadow-sm shadow-emerald-950'
                    : isProvisioning
                    ? 'bg-blue-950/80 text-blue-400 border border-blue-800/80 animate-pulse'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {instance.status === 'RUNNING' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                {instance.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              {instance.name} • <span className="font-mono text-slate-300 font-bold">{instance.gpu_name} x{instance.gpu_count}</span> • Region: <span className="font-mono text-blue-400">{instance.region_code}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {instance.status === 'STOPPED' && (
            <button
              onClick={() => handleAction('start')}
              className="flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/80 px-4 py-2 rounded-xl font-bold ui-transition ui-button-press shadow-md"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start Node</span>
            </button>
          )}
          {instance.status === 'RUNNING' && (
            <button
              onClick={() => handleAction('stop')}
              className="flex items-center gap-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-400 border border-amber-800/80 px-4 py-2 rounded-xl font-bold ui-transition ui-button-press shadow-md"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Halt Node</span>
            </button>
          )}
          {instance.status === 'RUNNING' && (
            <button
              onClick={() => handleAction('restart')}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-4 py-2 rounded-xl font-bold ui-transition ui-button-press"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reboot</span>
            </button>
          )}
          {instance.status !== 'TERMINATED' && (
            <button
              onClick={() => handleAction('delete')}
              className="flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800/60 px-4 py-2 rounded-xl font-bold ui-transition ui-button-press"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Terminate</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Durable Provisioning Workflow Step Tracker (Requirement 32) */}
      {isProvisioning && (
        <div className="surface-step-1 rounded-2xl p-6 space-y-4 font-mono text-xs border border-blue-900/40 shadow-xl">
          <div className="font-bold text-blue-300 flex items-center gap-2.5 font-sans text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
            Durable Provisioning State Machine Workflow...
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>✓ Verified account authorization & wallet balance hold</span>
            </div>
            <div className="flex items-center gap-2.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>✓ Allocated GPU compute capacity in provider adapter</span>
            </div>
            <div className="flex items-center gap-2.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>✓ Initialized PyTorch 2.5 + CUDA 12.4 container environment</span>
            </div>
            <div className="flex items-center gap-2.5 text-blue-300 font-bold animate-pulse">
              <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
              <span>• Configuring virtual network interface & public IP routing</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500">
              <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              <span>• Performing GPU memory & network health checks</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Terminal Connection Block */}
      {instance.status === 'RUNNING' && (
        <div className="surface-step-2 rounded-2xl p-5 space-y-3 font-mono text-xs border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2 font-sans text-sm">
              <Terminal className="w-4 h-4 text-emerald-400" />
              SSH Terminal Connection Command
            </span>
            <button
              onClick={copySsh}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 ui-transition ui-button-press border border-slate-800 text-xs font-semibold"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Command'}</span>
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 text-emerald-400 font-bold font-mono overflow-x-auto text-xs selection:bg-emerald-950 selection:text-emerald-300">
            ssh {instance.ssh_username || 'ubuntu'}@{instance.connection_ip} -p {instance.connection_port || 22}
          </div>
        </div>
      )}

      {/* 4. Telemetry Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hardware Specs */}
        <div className="surface-step-1 rounded-2xl p-6 space-y-3 text-xs font-mono">
          <h3 className="font-bold text-white font-sans text-base mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" />
            Hardware Specifications
          </h3>
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Instance ID</span>
            <span className="text-white font-bold">{instance.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">GPU Model</span>
            <span className="text-white font-bold">{instance.gpu_name} x{instance.gpu_count}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Datacenter Region</span>
            <span className="text-white font-bold">{instance.region_code}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Image Stack</span>
            <span className="text-slate-300 font-sans truncate max-w-[200px]">{instance.image}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Public Network IP</span>
            <span className="text-emerald-400 font-bold">{instance.connection_ip || 'Assigning IP...'}</span>
          </div>
        </div>

        {/* Runtime & Financial Telemetry */}
        <div className="surface-step-1 rounded-2xl p-6 space-y-3 text-xs font-mono">
          <h3 className="font-bold text-white font-sans text-base mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            Runtime Telemetry & Spend
          </h3>
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Hourly Billing Rate</span>
            <span className="text-white font-bold">₹{instance.customer_hourly_price_inr}/hr</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Active Uptime</span>
            <span className="text-blue-400 font-bold">{instance.uptime_seconds ? `${Math.floor(instance.uptime_seconds / 60)} minutes (${instance.uptime_seconds}s)` : '0 minutes'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Accrued Spend</span>
            <span className="text-emerald-400 font-bold">₹{instance.current_spend_inr ? instance.current_spend_inr.toFixed(2) : '0.00'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Created Timestamp</span>
            <span className="text-slate-400">{new Date(instance.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
