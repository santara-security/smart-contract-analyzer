'use client';

import { motion } from "framer-motion";

export default function SecurityFeatures() {
  // Focus on the two core features with minimal color usage and modern compact cards
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
        </svg>
      ),
      title: "Analyze Contract Online",
      description: "Lookup any verified contract by address and get instant security insights.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7v10m6-10v3m-6 7h6M5 7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7z" />
        </svg>
      ),
      title: "Analyze Your Own with AI",
      description: "Upload or paste source code to receive AI‑guided findings and remediation tips.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: "Clear Severity & Risks",
      description: "High, Medium, Low with concise explanations and actionable remediation.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4" />
        </svg>
      ),
      title: "Modern Reports",
      description: "Readable, compact, and designed for quick review and sharing.",
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-3">
            Two Powerful Ways to Analyze
          </h2>
          <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto">
            Analyze a public contract online or upload your own source with AI assistance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="bg-neutral-900/20 backdrop-blur-md rounded-lg p-6 border border-neutral-700/50"
            >
              <div className="inline-flex p-3 rounded-lg bg-neutral-800/50 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400 mb-4">
                {feature.icon}
              </div>

              <h3 className="text-base font-semibold text-neutral-200 mb-1.5">
                {feature.title}
              </h3>

              <p className="text-sm text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
