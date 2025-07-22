import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-neutral-900/50 to-neutral-800/30 border-y border-neutral-800/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-6">
          Ready to Secure Your Contracts?
        </h3>
        <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
          Start analyzing smart contracts today with our comprehensive security tools. 
          Protect your users and investments from vulnerabilities and honeypots.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/audit"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Your First Audit
          </Link>
          
          <Link 
            href="/audit/base/0x8e3bFf1Abf376f7a5D036cC3D85766394744dd04"
            className="inline-flex items-center gap-2 border border-neutral-600 hover:border-neutral-500 hover:bg-neutral-800/50 text-neutral-300 px-8 py-4 rounded-lg font-medium transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Sample Report
          </Link>
        </div>
      </div>
    </section>
  );
}
