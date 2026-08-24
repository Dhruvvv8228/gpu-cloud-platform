import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-slate-300 space-y-6">
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: August 2026</p>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 font-mono">
          [PRIVACY POLICY PLACEHOLDER - Pending Formal Legal Counsel Review]
        </div>
        <p>
          We respect user privacy and data security. We store essential account information, audit logs, and transaction ledgers required to operate our GPU cloud control plane.
        </p>
      </main>
      <Footer />
    </div>
  );
}
