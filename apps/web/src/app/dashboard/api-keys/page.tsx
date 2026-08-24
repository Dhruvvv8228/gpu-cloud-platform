'use client';

import React, { useEffect, useState } from 'react';
import { Key, Plus, Trash2, Copy, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [keyName, setKeyName] = useState('');
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/v1/api-keys');
      const data = await res.json();
      if (data.success) setKeys(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;
    setCreating(true);

    try {
      const res = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName }),
      });

      const data = await res.json();
      if (data.success) {
        setNewSecret(data.data.secret_key);
        setKeyName('');
        fetchKeys();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await fetch(`/api/v1/api-keys/${id}`, { method: 'DELETE' });
      fetchKeys();
    } catch (e) {
      console.error(e);
    }
  };

  const copySecret = () => {
    if (!newSecret) return;
    navigator.clipboard.writeText(newSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Developer API Keys</h1>
        <p className="text-xs text-slate-400 mt-1">Authenticate REST API calls for programmatic GPU deployment.</p>
      </div>

      {/* Secret Banner on creation */}
      {newSecret && (
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-xl p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-sans">
            <CheckCircle2 className="w-5 h-5" />
            <span>API Key Generated Successfully</span>
          </div>
          <p className="text-slate-300 font-sans text-xs">
            Save this key now. For security purposes, it will <strong className="text-white">NOT</strong> be displayed again.
          </p>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between text-emerald-400 font-bold font-mono">
            <span>{newSecret}</span>
            <button
              onClick={copySecret}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 text-xs font-sans"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Key'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <h3 className="font-bold text-white text-sm mb-3">Create New API Key</h3>
        <form onSubmit={handleCreate} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Key Identifier / Name</label>
            <input
              type="text"
              placeholder="e.g. Production CI/CD Pipeline Key"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              required
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 whitespace-nowrap"
          >
            {creating ? 'Generating...' : 'Generate API Key'}
          </button>
        </form>
      </div>

      {/* Active Keys List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800">
          <h3 className="font-bold text-white text-base">Active API Credentials</h3>
        </div>
        <div className="divide-y divide-slate-800/80">
          {keys.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">No API keys generated yet.</div>
          ) : (
            keys.map((k) => (
              <div key={k.id} className="p-4 flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="font-bold text-white font-sans text-sm">{k.name}</div>
                  <div className="text-slate-400 mt-1">Prefix: {k.key_prefix}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Created: {new Date(k.created_at).toLocaleDateString()}</div>
                </div>

                <button
                  onClick={() => handleRevoke(k.id)}
                  className="p-2 rounded bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-400 text-xs flex items-center gap-1 font-sans"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revoke</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
