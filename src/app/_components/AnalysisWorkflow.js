"use client";
import { motion } from "framer-motion";

export default function AnalysisWorkflow() {
  // Streamlined, compact workflow with minimal color usage
  const steps = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M5 11h14M7 15h10" />
        </svg>
      ),
      title: "Input Contract",
      description: "Paste an address to analyze online, or upload your source for AI assistance.",
      color: "text-blue-400",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h6M7 9h10M6 13h12M5 17h14" />
        </svg>
      ),
      title: "Automated Checks",
      description: "Run static analysis and heuristics to surface potential issues.",
      color: "text-neutral-300",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4 19h16" />
        </svg>
      ),
      title: "AI Insights",
      description: "AI explains findings with context, code references, and remediation tips.",
      color: "text-neutral-300",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 6-6M7 17h10M7 21h6" />
        </svg>
      ),
      title: "Report Summary",
      description: "Clear severity levels with a compact, shareable report.",
      color: "text-neutral-300",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-3">
            Workflow at a Glance
          </h2>
          <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto">
            Input contract, run checks, get AI insights, and review a clean summary.
          </p>
        </motion.div>

        <div className="relative">
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-neutral-900/20 backdrop-blur-md rounded-lg p-6 border border-neutral-700/50 min-h-[200px]">
                  <div className="inline-flex p-3 rounded-lg bg-neutral-800/50 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400 mb-4">
                    {step.icon}
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-300 mr-3">
                      {i + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-200">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-8 h-0.5 animated-connector"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
