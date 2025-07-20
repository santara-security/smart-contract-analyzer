'use client';
import { motion } from "framer-motion";

export default function AnalysisWorkflow() {
  const steps = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      title: "Contract Input",
      description: "Enter contract address and select blockchain network",
      color: "text-blue-400"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: "Static Analysis",
      description: "Slither performs comprehensive security analysis",
      color: "text-green-400"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: "Vulnerability Detection",
      description: "Identify security issues across 4 impact levels",
      color: "text-orange-400"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Risk Assessment",
      description: "Detailed report with remediation guidance",
      color: "text-purple-400"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-neutral-900/50 to-neutral-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-4">
            How Security Analysis Works
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Complete automated pipeline for comprehensive contract security assessment
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
                <div className="bg-neutral-800/30 backdrop-blur-md rounded-lg p-6 border border-neutral-600/50">
                  <div className={`inline-flex p-3 rounded-lg bg-neutral-800/50 ${step.color} mb-4`}>
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
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-neutral-700 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-neutral-800/30 to-neutral-900/40 backdrop-blur-md rounded-lg p-6 border border-neutral-600/30"
        >
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">4</div>
              <div className="text-sm text-neutral-400">Security Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-1">Real-time</div>
              <div className="text-sm text-neutral-400">Analysis Results</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400 mb-1">100%</div>
              <div className="text-sm text-neutral-400">Open Source Tools</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}