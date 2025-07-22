'use client';
export default function ArchitectureSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Description */}
          <div className="lg:col-span-4 space-y-6 animate-fadeSlideRight">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-geist font-normal bg-indigo-500/10 text-cyan-400">03</span>
              </div>
              <div>
                <h2 className="text-2xl text-neutral-100 mb-4 font-light tracking-tight font-geist">Advanced AI Architecture</h2>
                <p className="text-neutral-400 leading-relaxed font-geist font-normal">
                  The Nexus AI Engine™ features a proprietary AI architecture specifically engineered for customer service excellence. Every neural layer is meticulously optimized for precision, speed, and reliability—enabling our AI agents to resolve customer conversations more effectively than any competing solution.
                </p>
              </div>
            </div>
            <div className="space-y-4 pl-12">
              <div className="flex items-center gap-3">
                {/* Zap Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-4 h-4 stroke-2 text-cyan-400"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
                <span className="text-sm text-neutral-300 font-geist font-normal">Lightning-fast inference optimization</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Shield Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield w-4 h-4 stroke-2 text-cyan-400"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
                <span className="text-sm text-neutral-300 font-geist font-normal">Enterprise-grade security protocols</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Target Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target w-4 h-4 stroke-2 text-cyan-400"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                <span className="text-sm text-neutral-300 font-geist font-normal">Context-aware response generation</span>
              </div>
            </div>
          </div>
          {/* Architecture Diagram & Specs */}
          <div className="lg:col-span-8 animate-fadeSlideLeft">
            <div className="relative bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 border border-neutral-800/50 rounded-2xl overflow-hidden p-6 md:p-12">
              {/* Main Architecture Flow - simplified for brevity */}
              <div className="relative flex flex-col items-center space-y-8">
                <div className="w-full max-w-md">
                  <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6 text-center">
                    {/* Message Circle Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle w-8 h-8 text-blue-400 mx-auto mb-3 stroke-1.5"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
                    <div className="text-sm text-blue-400 font-geist font-normal">Customer Query Input</div>
                    <div className="text-xs text-neutral-400 mt-1 font-geist font-normal">Natural language processing</div>
                  </div>
                </div>
                <div className="w-full grid md:grid-cols-2 gap-6 max-w-4xl">
                  <div className="bg-gradient-to-r border rounded-xl p-6 from-indigo-500/20 to-indigo-600/20 border-indigo-500/30">
                    {/* Brain Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain w-8 h-8 mb-3 stroke-1.5 text-indigo-400"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
                    <div className="text-sm mb-2 font-geist font-normal text-indigo-400">Neural Processing Core</div>
                    <div className="text-xs text-neutral-400 font-geist font-normal">Advanced transformer architecture</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                    {/* Database Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database w-8 h-8 text-green-400 mb-3 stroke-1.5"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>
                    <div className="text-sm text-green-400 mb-2 font-geist font-normal">Knowledge Retrieval</div>
                    <div className="text-xs text-neutral-400 font-geist font-normal">RAG-enhanced information access</div>
                  </div>
                </div>
                <div className="w-full max-w-md">
                  <div className="bg-gradient-to-r border rounded-xl p-6 text-center from-indigo-500/20 to-indigo-600/20 border-indigo-500/30">
                    {/* Check Circle Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-8 h-8 mx-auto mb-3 stroke-1.5 text-indigo-400"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                    <div className="text-sm font-geist font-normal text-indigo-400">Validated Response</div>
                    <div className="text-xs text-neutral-400 mt-1 font-geist font-normal">Quality-assured output</div>
                  </div>
                </div>
              </div>
              {/* Technical Specifications */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-neutral-800/30">
                  <div className="text-lg mb-1 font-geist font-normal text-cyan-400">4.2B</div>
                  <div className="text-xs text-neutral-400 font-geist font-normal">Parameters</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-neutral-800/30">
                  <div className="text-lg mb-1 font-geist font-normal text-cyan-400">128K</div>
                  <div className="text-xs text-neutral-400 font-geist font-normal">Context Window</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-neutral-800/30">
                  <div className="text-lg mb-1 font-geist font-normal text-cyan-400">99.97%</div>
                  <div className="text-xs text-neutral-400 font-geist font-normal">Uptime SLA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
