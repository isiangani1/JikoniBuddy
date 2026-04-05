"use client";

import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Browse & Schedule",
    desc: "Choose meals and set your exact delivery window.",
    accent: "from-purple-400 to-indigo-400",
    glow: "shadow-[0_0_40px_rgba(125,95,255,0.25)]"
  },
  {
    id: 2,
    title: "Pay Securely",
    desc: "Pay with M-Pesa or select pay on delivery.",
    accent: "from-teal-300 to-cyan-400",
    glow: "shadow-[0_0_40px_rgba(45,212,191,0.25)]"
  },
  {
    id: 3,
    title: "Track & Enjoy",
    desc: "Real-time updates from prep to delivery.",
    accent: "from-amber-300 to-orange-400",
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.2)]"
  }
];

export default function HowItWorksFlow() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-10 sm:py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
          How it works
        </p>
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
          A live, intelligent food flow.
        </h2>
        <p className="max-w-2xl text-base text-white/60 sm:text-lg">
          Every order moves through a real-time pipeline so buyers, sellers, and
          buddies stay synced from start to finish.
        </p>
      </div>

      <div className="relative mt-14">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="absolute left-1/2 top-8 hidden h-[2px] w-[80%] -translate-x-1/2 origin-left bg-gradient-to-r from-purple-400 via-teal-300 to-amber-300 sm:block"
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative rounded-[28px] border border-white/10 bg-white/5 p-8 text-left backdrop-blur-xl ${step.glow}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} text-lg font-bold text-[#0d0a14]`}
                >
                  {step.id}
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Step {step.id}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-white/60">{step.desc}</p>
              <motion.span
                className="absolute right-5 top-6 h-2 w-2 rounded-full bg-white/40"
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.4 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
