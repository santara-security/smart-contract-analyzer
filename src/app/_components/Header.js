'use client';
export default function Header() {
  return (
    <header className="relative overflow-hidden pt-20 mt-16">
      <div className="max-w-7xl sm:px-6 lg:px-8 md:pt-24 mr-auto ml-auto pt-16 pr-4 pb-8 pl-4">
        <div className="max-w-4xl text-center mr-auto ml-auto">
          <span className="inline-flex items-center gap-2 uppercase tracking-widest text-xs font-medium mb-6 animate-fadeSlideUp">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500"></span>
            <span className="text-neutral-400 font-geist font-normal">Next-Generation AI Architecture</span>
          </span>
          <h1 className="sm:text-5xl lg:text-7xl xl:text-8xl leading-[0.9] text-4xl font-light text-neutral-100 tracking-tight mb-8 font-geist animate-fadeSlideUp" style={{fontFamily: 'Playfair Display, serif'}}>
            Powered by the<br className="hidden sm:block" />
            <span className="bg-clip-text font-light text-transparent tracking-tight font-geist bg-gradient-to-tr from-teal-400 to-blue-500">Nexus AI Engine™</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-10 font-geist font-normal animate-fadeSlideUp">
            Revolutionary AI architecture designed for enterprise-grade customer intelligence. Built for precision, optimized for scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeSlideUp">
            <button className="group inline-flex gap-2 transition-all duration-300 transform hover:scale-105 hover:from-indigo-600 hover:to-indigo-700 text-sm font-normal text-white font-geist bg-gradient-to-tr from-teal-400 to-blue-500 rounded-full pt-3 pr-6 pb-3 pl-6 items-center">
              {/* Sparkles Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-4 h-4 stroke-2 group-hover:rotate-12 transition-transform"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>
              Experience Nexus AI Demo
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900/50 text-sm px-6 py-3 transition-all duration-300 font-geist font-normal">
              {/* Play Circle Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-circle w-4 h-4 stroke-1.5"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
              Watch Technical Overview
            </button>
          </div>
        </div>
      </div>
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full blur-3xl bg-indigo-500/5"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full blur-3xl bg-indigo-500/5"></div>
      </div>
    </header>
  );
}
