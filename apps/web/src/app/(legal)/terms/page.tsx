import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-slate-300 space-y-6">
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-xs text-slate-500">Last updated: August 2026</p>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 font-mono">
          [LEGAL DISCLAIMER PLACEHOLDER - Pending Formal Legal Counsel Review]
        </div>
        <p>
          Welcome to NVIDIA GPU Cloud Compute Marketplace. By creating an account or deploying compute infrastructure through our control plane, you agree to these Terms of Service.
        </p>
        <h2 className="text-xl font-bold text-white mt-6">1. Compute Usage & Metering</h2>
        <p>
          GPU compute instances are billed strictly by the second based on active runtime rates. Prepaid credits must be maintained to prevent automated instance suspension.
        </p>
      </main>
      <Footer />
    </div>
  );
}
