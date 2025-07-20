'use client';

import { motion } from "framer-motion";

export default function SecurityStats() {
  const stats = [
    { value: "10,000+", label: "Contracts Analyzed" },
    { value: "99.7%", label: "Honeypot Detection" },
    { value: "150+", label: "Vulnerability Patterns" },
    { value: "24/7", label: "Multi-Chain Support" },
  ];
  
  return (
    <div className="py-12 border-y border-neutral-800/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-400">
                  {stat.label}
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}