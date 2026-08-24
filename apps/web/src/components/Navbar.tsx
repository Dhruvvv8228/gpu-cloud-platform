'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: 'GPU Catalog', href: '/compute' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Developer API', href: '/docs' },
    { label: 'Architecture', href: '/terms' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md ui-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 ui-transition">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white font-sans">
            NVIDIA<span className="text-blue-400 font-light ml-1">Cloud</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`ui-transition hover:text-blue-400 ${
                  isActive ? 'text-blue-400 font-bold border-b-2 border-blue-500 pb-0.5' : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-400 hover:text-white ui-transition uppercase tracking-wider font-mono hidden sm:block"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg ui-transition ui-button-press shadow-md shadow-blue-600/20 hover:shadow-blue-500/30"
          >
            <span>Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
