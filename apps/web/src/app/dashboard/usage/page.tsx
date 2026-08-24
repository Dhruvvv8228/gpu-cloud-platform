'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Clock, Zap, Cpu } from 'lucide-react';

export default function UsagePage() {
  const [usage, setUsage] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/usage')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsage(data.data);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Usage Telemetry & Spend</h1>
        <p className="text-xs text-slate-400 mt-1">Granular breakdown of GPU hours consumed across compute instances.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total GPU Hours</div>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">
            {usage?.summary?.total_gpu_hours || 0} hrs
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Spend Accrued</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
            ₹{usage?.summary?.total_spend_inr || 0}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Compute Nodes</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-2 font-mono">
            {usage?.summary?.active_instances_count || 0} nodes
          </div>
        </div>
      </div>

      {/* Usage by GPU Model */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <h3 className="font-bold text-white text-sm mb-4">Compute Hours Consumption by GPU Model</h3>
        <div className="space-y-3">
          {usage && Object.entries(usage.usage_by_gpu || {}).map(([gpuCode, val]: any) => (
            <div key={gpuCode} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-950 text-blue-400 flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm uppercase">{gpuCode}</div>
                  <div className="text-slate-400">{val.active_instances} active instance(s)</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-sm">{val.total_hours.toFixed(2)} hours</div>
                <div className="text-emerald-400">₹{val.total_spend_inr.toFixed(2)} total spend</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
