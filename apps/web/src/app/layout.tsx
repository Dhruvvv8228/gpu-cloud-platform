import './globals.css';
import React from 'react';

export const metadata = {
  title: 'NVIDIA GPU Cloud Compute Marketplace | On-Demand High Performance Compute',
  description: 'Deploy high-performance NVIDIA GPU infrastructure by the hour for AI, ML, inference, training, computer vision and high-performance workloads.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
