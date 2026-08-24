'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Cpu,
  LayoutDashboard,
  Server,
  Activity,
  CreditCard,
  Key,
  ShieldAlert,
  PlusCircle,
  Wallet as WalletIcon,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const fetchWallet = async () => {
    try {
      const res = await fetch('/api/v1/wallet');
      const data = await res.json();
      if (data.success) {
        setWalletBalance(data.data.wallet.balance_inr);
      }
    } catch (e) {
      // silent fallback
    }
  };

  useEffect(() => {
    fetchWallet();
    const interval = setInterval(fetchWallet, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Deploy Compute', href: '/dashboard/compute/deploy', icon: PlusCircle },
    { label: 'Instances', href: '/dashboard/instances', icon: Server },
    { label: 'Usage Telemetry', href: '/dashboard/usage', icon: Activity },
    { label: 'Billing & Wallet', href: '/dashboard/billing', icon: CreditCard },
    { label: 'API Keys', href: '/dashboard/api-keys', icon: Key },
    { label: 'Admin Console', href: '/admin', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-blue-500 selection:text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950/90 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Org Switcher */}
          <div className="p-4 border-b border-slate-800/80">
            <Link href="/" className="flex items-center gap-2 mb-3 group">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/20 group-hover:scale-105 ui-transition">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">NVIDIA Cloud</span>
            </Link>

            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs ui-transition hover:border-slate-700">
              <div className="truncate font-mono">
                <div className="text-slate-500 text-[9px] uppercase tracking-wider font-semibold">Organization</div>
                <div className="font-bold text-slate-200 truncate">Acme AI Labs</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono ui-transition ui-button-press ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 border border-blue-500/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Wallet Widget */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <WalletIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Prepaid Wallet</div>
                <div className="text-xs font-bold text-white font-mono">
                  {walletBalance !== null ? `₹${walletBalance.toFixed(2)}` : 'Loading...'}
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/billing"
              className="text-[11px] text-blue-400 font-bold hover:underline font-mono uppercase tracking-wider"
            >
              Top Up
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Console Header */}
        <header className="h-14 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur px-6 flex items-center justify-between shrink-0">
          <div className="text-xs font-mono font-medium text-slate-400">
            Control Plane Console <span className="mx-2 text-slate-700">|</span> Region: <span className="text-emerald-400 font-bold">ap-south-1 (Mumbai)</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono uppercase tracking-wider ui-transition">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Docs</span>
            </Link>
            <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-xs font-bold font-mono text-blue-400 shadow-sm">
              AV
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
