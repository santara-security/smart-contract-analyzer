'use client'; // Add use client directive

import { motion } from "framer-motion"; // Import motion

export default function TrustSection() {
  const certs = [
    { title: 'SOC 2 Type II', desc: 'Security Certified' },
    { title: 'GDPR', desc: 'Privacy Compliant' },
    { title: 'ISO 27001', desc: 'Information Security' },
    { title: 'HIPAA', desc: 'Healthcare Ready' },
  ];
  return (
    <motion.section // Wrap section with motion
      initial={{ opacity: 0, y: 50 }} // Keep initial state
      whileInView={{ opacity: 1, y: 0 }} // Change animate to whileInView
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }} // Add viewport prop to trigger once
      className="py-20 overflow-hidden" // Added overflow-hidden
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div // Wrap heading div with motion
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-sm text-neutral-400 uppercase tracking-widest mb-2 font-geist font-normal">Enterprise Security & Compliance</h3>
          <p className="text-2xl text-neutral-200 font-light tracking-tight font-geist">Trusted by Fortune 500 companies worldwide</p>
        </motion.div>
        <div className="flex gap-8 items-center justify-evenly">
          {/* Icons omitted for brevity, add as needed */}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center">
          {certs.map((c, i) => (
            <motion.div // Wrap individual cert div with motion
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }} // Staggered delay
              viewport={{ once: true }}
            >
              <div className="text-xs text-neutral-400 uppercase tracking-wide font-geist font-normal">{c.title}</div>
              <div className="text-sm text-neutral-500 mt-1 font-geist font-normal">{c.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
