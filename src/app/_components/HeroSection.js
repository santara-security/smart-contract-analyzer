import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 mt-16 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 uppercase tracking-widest text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></span>
            <span className="text-neutral-400">Next-Generation Security Analysis</span>
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-200 mb-6 leading-tight">
            Smart Contract Security
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Analysis Made Simple
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Automated security auditing and honeypot detection for Ethereum-compatible contracts. 
            Identify vulnerabilities before they become exploits.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link 
              href="/audit"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Analyzing Contracts
            </Link>
            
            <Link 
              href="/audit/base/0x1234567890abcdef1234567890abcdef12345678"
              className="inline-flex items-center gap-2 border border-neutral-600 hover:border-neutral-500 hover:bg-neutral-800/50 text-neutral-300 px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Sample Report
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-neutral-900/20 backdrop-blur-md rounded-lg p-4 border border-neutral-700/50">
              <div className="text-green-400 text-sm font-medium mb-1">Static Analysis</div>
              <div className="text-neutral-400 text-xs">150+ vulnerability patterns</div>
            </div>
            <div className="bg-neutral-900/20 backdrop-blur-md rounded-lg p-4 border border-neutral-700/50">
              <div className="text-blue-400 text-sm font-medium mb-1">Honeypot Detection</div>
              <div className="text-neutral-400 text-xs">Transaction simulation</div>
            </div>
            <div className="bg-neutral-900/20 backdrop-blur-md rounded-lg p-4 border border-neutral-700/50">
              <div className="text-purple-400 text-sm font-medium mb-1">Multi-Chain</div>
              <div className="text-neutral-400 text-xs">Base, Ethereum & more</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full blur-3xl bg-green-500/5"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full blur-3xl bg-blue-500/5"></div>
      </div>
    </section>
  );
}