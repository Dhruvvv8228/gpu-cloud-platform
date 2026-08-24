import Link from 'next/link';
import { Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">NVIDIA Cloud Compute Platform</span>
          </div>
          <p className="text-slate-400 text-sm max-w-sm">
            High-performance GPU cloud compute marketplace & control plane. Deploy NVIDIA L4, L40S, A100, H100, H200 & B200 instances on demand.
          </p>
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} GPU Cloud Platform Inc. All rights reserved.
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Compute Products</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/compute/h100-80gb" className="hover:text-white transition-colors">NVIDIA H100 80GB</Link></li>
            <li><Link href="/compute/h200-141gb" className="hover:text-white transition-colors">NVIDIA H200 141GB</Link></li>
            <li><Link href="/compute/b200-192gb" className="hover:text-white transition-colors">NVIDIA B200 Blackwell</Link></li>
            <li><Link href="/compute/a100-80gb" className="hover:text-white transition-colors">NVIDIA A100 80GB</Link></li>
            <li><Link href="/compute/l40s-48gb" className="hover:text-white transition-colors">NVIDIA L40S 48GB</Link></li>
            <li><Link href="/compute/l4-24gb" className="hover:text-white transition-colors">NVIDIA L4 24GB</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Developers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/docs" className="hover:text-white transition-colors">API Documentation</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Hourly Pricing</Link></li>
            <li><Link href="/dashboard/api-keys" className="hover:text-white transition-colors">API Key Manager</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Customer Console</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Legal & Compliance</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/acceptable-use" className="hover:text-white transition-colors">Acceptable Use Policy</Link></li>
            <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund & Billing Policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
