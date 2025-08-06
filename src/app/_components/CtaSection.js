import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="py-20 bg-neutral-900/30 border-y border-neutral-800/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-4">
          Start Your Analysis
        </h3>
        <p className="text-base md:text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
          Analyze a public contract online, or upload your own source for AI‑guided security insights.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/audit"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Analyze a Contract
          </Link>
          
          <Link 
            href="/analyze-sc"
            className="inline-flex items-center gap-2 bg-neutral-800/60 text-neutral-200 border border-neutral-700 hover:bg-neutral-800 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553 2.276A2 2 0 0121 14.09V17a2 2 0 01-2 2h-5M9 7v10m6-10v3m-6 7h6" />
            </svg>
            Analyze Your Own with AI
          </Link>
        </div>
      </div>
    </section>
  );
}
