export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-neutral-900/50 to-neutral-800/30 border-y border-neutral-800/50 animate-fadeSlideUp">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-3xl md:text-4xl text-neutral-100 mb-6 font-light tracking-tight font-geist">Ready to experience the future?</h3>
        <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto font-geist font-normal">Join thousands of enterprises leveraging Nexus AI Engine for superior customer experiences.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r text-white px-8 py-4 transition-all duration-300 transform hover:scale-105 font-geist font-normal from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
            {/* Rocket Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket w-5 h-5 stroke-2 group-hover:translate-x-1 transition-transform"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>
            Start Free Trial
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900/50 px-8 py-4 transition-all duration-300 font-geist font-normal">
            {/* Calendar Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-5 h-5 stroke-1.5"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  );
}
