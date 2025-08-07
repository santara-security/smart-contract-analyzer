'use client';
import Link from 'next/link';
import { useSearchModal } from '../contexts/SearchModalContext';

export default function HeroSection() {
  const { openModal } = useSearchModal();

  return (
    <section className="relative overflow-hidden pt-20 mt-16 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 uppercase tracking-widest text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-red-500"></span>
            <span className="text-neutral-400">Modern, AI‑guided Security Analysis</span>
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-200 mb-6 leading-tight">
            Smart Contract Analyzer
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-400">
              Simple, Fast, Professional
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Analyze any on-chain contract instantly or upload your own source with AI-guided insights. 
            Minimal, sleek, and built for clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={openModal}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Analyze a Contract
            </button>

            <Link
              href="/analyze-sc"
              className="inline-flex items-center gap-2 bg-neutral-800/60 text-neutral-200 border border-neutral-700 hover:bg-neutral-800 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553 2.276A2 2 0 0121 14.09V17a2 2 0 01-2 2h-5M9 7v10m6-10v3m-6 7h6" />
              </svg>
              Analyze Your Own with AI
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-neutral-900/20 backdrop-blur-md rounded-lg p-4 border border-neutral-700/50">
              <div className="text-neutral-300 text-sm font-medium mb-1">Analyze Online</div>
              <div className="text-neutral-400 text-xs">Lookup verified contracts by address</div>
            </div>
            <div className="bg-neutral-900/20 backdrop-blur-md rounded-lg p-4 border border-neutral-700/50">
              <div className="text-neutral-300 text-sm font-medium mb-1">AI-Assisted</div>
              <div className="text-neutral-400 text-xs">Upload or paste source for deep insights</div>
            </div>
            <div className="bg-neutral-900/20 backdrop-blur-md rounded-lg p-4 border border-neutral-700/50">
              <div className="text-neutral-300 text-sm font-medium mb-1">Modern Reports</div>
              <div className="text-neutral-400 text-xs">Clear severity and remediation</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full blur-3xl bg-neutral-800/40"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full blur-3xl bg-gradient-to-r from-blue-500/10 to-red-500/10"></div>
      </div>
    </section>
  );
}
