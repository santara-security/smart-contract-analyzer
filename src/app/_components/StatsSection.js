'use client';

import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { value: "99.7%", label: "Accuracy Rate" },
    { value: "2.3s", label: "Avg Response Time" },
    { value: "150M+", label: "Conversations Processed" },
    { value: "24/7", label: "Uptime Guarantee" },
  ];
  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-16 border-y border-neutral-800/50 backdrop-blur-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div className="text-center" key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }} // Modified animation
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  viewport={{ once: true }}
                >
                  <div className="text-2xl md:text-3xl mb-2 font-light tracking-tight font-geist text-cyan-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-400 font-geist font-normal">
                    {stat.label}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
