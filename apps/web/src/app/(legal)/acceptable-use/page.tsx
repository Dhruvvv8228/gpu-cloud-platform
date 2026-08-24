import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-slate-300 space-y-6">
        <h1 className="text-3xl font-extrabold text-white">Acceptable Use Policy (AUP)</h1>
        <p className="text-xs text-slate-500">Last updated: August 2026</p>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 font-mono">
          [ACCEPTABLE USE POLICY PLACEHOLDER - Abuse Enforcement Architecture]
        </div>
        <p>
          Prohibited activity includes unauthorized credential attacks, botnets, illegal workloads, DDoS execution, malware distribution, or crypto mining in violation of provider policies. Accounts engaged in prohibited activity are subject to immediate termination.
        </p>
      </main>
      <Footer />
    </div>
  );
}
