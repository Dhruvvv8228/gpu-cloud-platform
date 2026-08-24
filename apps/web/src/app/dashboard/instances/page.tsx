'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Server,
  Play,
  Square,
  RefreshCcw,
  Trash2,
  ExternalLink,
  PlusCircle,
  Search,
} from 'lucide-react';
import { CustomerInstance } from '../../../lib/control-plane/types';

export default function InstancesPage() {
  const [instances, setInstances] = useState<CustomerInstance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchInstances = async () => {
    try {
      const res = await fetch('/api/v1/instances');
      const data = await res.json();
      if (data.success) {
        setInstances(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
    const interval = setInterval(fetchInstances, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: string, action: 'start' | 'stop' | 'restart' | 'delete') => {
    try {
      if (action === 'delete') {
        await fetch(`/api/v1/instances/${id}`, { method: 'DELETE' });
      } else {
        await fetch(`/api/v1/instances/${id}/${action}`, { method: 'POST' });
      }
      fetchInstances();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = instances.filter(
    (i) =>
      i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.gpu_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">GPU Compute Instances</h1>
          <p className="text-xs text-slate-400 mt-1">Manage running nodes, lifecycle controls, and connection keys.</p>
        </div>

        <Link
          href="/dashboard/compute/deploy"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-md shadow-blue-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Deploy New Instance</span>
        </Link>
      </div>

      {/* Table Controls */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search instance ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
        <button
          onClick={fetchInstances}
          className="px-3 py-1.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Instance Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="p-4">Instance</th>
                <th className="p-4">GPU Model</th>
                <th className="p-4">Region</th>
                <th className="p-4">Status</th>
                <th className="p-4">IP Connection</th>
                <th className="p-4">Uptime</th>
                <th className="p-4">Hourly Rate</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-sans">
                    No instances found.
                  </td>
                </tr>
              ) : (
                filtered.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <Link href={`/dashboard/instances/${inst.id}`} className="font-bold text-white hover:text-blue-400 block">
                        {inst.id}
                      </Link>
                      <span className="text-[11px] text-slate-500 font-sans">{inst.name}</span>
                    </td>
                    <td className="p-4 font-sans font-semibold text-slate-200">{inst.gpu_name} x{inst.gpu_count}</td>
                    <td className="p-4 text-slate-400">{inst.region_code}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                          inst.status === 'RUNNING'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : inst.status === 'PROVISIONING'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800 animate-pulse'
                            : inst.status === 'STOPPED'
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {inst.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {inst.connection_ip ? `${inst.ssh_username}@${inst.connection_ip}` : 'Assigning...'}
                    </td>
                    <td className="p-4 text-slate-400">
                      {inst.uptime_seconds ? `${Math.floor(inst.uptime_seconds / 60)}m` : '0m'}
                    </td>
                    <td className="p-4 font-bold text-white">₹{inst.customer_hourly_price_inr}/hr</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/instances/${inst.id}`}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Open Detail"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        {inst.status === 'STOPPED' && (
                          <button
                            onClick={() => handleAction(inst.id, 'start')}
                            className="p-1.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-400"
                            title="Start"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {inst.status === 'RUNNING' && (
                          <button
                            onClick={() => handleAction(inst.id, 'stop')}
                            className="p-1.5 rounded bg-amber-950 hover:bg-amber-900 text-amber-400"
                            title="Stop"
                          >
                            <Square className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {inst.status !== 'TERMINATED' && (
                          <button
                            onClick={() => handleAction(inst.id, 'delete')}
                            className="p-1.5 rounded bg-red-950 hover:bg-red-900 text-red-400"
                            title="Terminate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
