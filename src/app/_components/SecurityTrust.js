'use client';

import { motion } from "framer-motion";

export default function SecurityTrust() {
  const trustIndicators = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Security Focused",
      description: "Open source security tools and transparent analysis methodology"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Transparent Analysis",
      description: "Detailed vulnerability explanations with affected code and remediation steps"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      title: "Multi-Chain Verified",
      description: "Base network primary support with extensible architecture for EVM chains"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      title: "Community Trusted",
      description: "Security researcher validated with continuous community feedback"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="py-20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-sm text-neutral-400 uppercase tracking-widest mb-2">
            Security & Transparency
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-neutral-200">
            Trusted by Security Researchers Worldwide
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustIndicators.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex p-4 rounded-lg bg-neutral-800/30 text-green-400 mb-4">
                {item.icon}
              </div>
              <h4 className="text-lg font-semibold text-neutral-200 mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-neutral-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center"
        >
          <div>
            <div className="text-2xl font-bold text-green-400 mb-1">100%</div>
            <div className="text-xs text-neutral-400">Open Source</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-1">24/7</div>
            <div className="text-xs text-neutral-400">Available</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400 mb-1">Multi</div>
            <div className="text-xs text-neutral-400">Chain Support</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400 mb-1">Real-time</div>
            <div className="text-xs text-neutral-400">Analysis</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}