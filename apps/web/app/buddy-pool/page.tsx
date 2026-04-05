"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BuddyPoolRequestForm from "@/components/BuddyPoolRequestForm";
import BuddyPoolHero from "@/components/BuddyPoolHero";
import BuddyPoolModal from "@/components/BuddyPoolModal";

export default function BuddyPoolPage() {
  const [activeModal, setActiveModal] = useState<"request" | "matching" | null>(
    null
  );

  return (
    <div className="relative min-h-screen overflow-hidden text-[#f6f1fb]">
      {/* Background Orbs (Consistent with Landing Page) */}
      <div className="pointer-events-none absolute -top-24 right-[-120px] h-72 w-72 rounded-full bg-purple-600/20 blur-[100px] animate-pulse" />
      <div className="pointer-events-none absolute left-[-120px] top-1/3 h-80 w-80 rounded-full bg-teal-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-140px] right-1/4 h-80 w-80 rounded-full bg-amber-400/10 blur-[100px]" />

      <SiteHeader />
      <main className={`relative z-10 min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-16 ${activeModal ? "blur-sm" : ""} transition-all duration-300`}>
        <section className="relative flex flex-col lg:flex-row items-center gap-10 py-10 md:py-20">
          <div className="flex flex-col gap-6 w-full lg:w-3/5 items-start text-left relative z-10">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              42 Buddies active now
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] m-0 tracking-tight">
              Scale your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-emerald-300 to-indigo-400">kitchen capacity</span> instantly.
            </h1>
            <p className="text-white/60 m-0 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
              Don't let a rush break your service. Access a pool of trusted, vetted helpers when you need them most. Built for Nairobi's busiest kitchens.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <button 
                className="px-8 py-4 rounded-full bg-[#2dd4bf] text-[#0d0a14] font-black text-lg hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all active:scale-95" 
                onClick={() => setActiveModal("request")}
              >
                Request a Buddy
              </button>
              <button 
                className="px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all backdrop-blur-md active:scale-95" 
                onClick={() => setActiveModal("matching")}
              >
                How it works
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-2/5 relative flex justify-center items-center h-[350px]">
             {/* Decorative Background for Hero */}
             <div className="absolute inset-0 bg-purple-600/5 blur-[80px] rounded-full animate-pulse" />
             <BuddyPoolHero />
             
             {/* Floating Labels (The "Human" touch) */}
             <div className="absolute top-10 -right-4 bg-white/5 border border-white/10 backdrop-blur-xl p-3 rounded-2xl shadow-2xl animate-bounce duration-[3000ms]">
                <p className="text-[10px] font-black uppercase text-purple-400 m-0">Chef Amos</p>
                <p className="text-xs text-white m-0 font-bold">Needs 2 helpers</p>
             </div>
             <div className="absolute bottom-10 -left-4 bg-white/5 border border-white/10 backdrop-blur-xl p-3 rounded-2xl shadow-2xl animate-bounce duration-[4000ms]">
                <p className="text-[10px] font-black uppercase text-emerald-400 m-0">Buddy Network</p>
                <p className="text-xs text-white m-0 font-bold">Matches in &lt; 5m</p>
             </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-black text-white m-0">The Buddy Flow</h2>
              <p className="text-white/50 m-0">Three steps to a stress-free shift.</p>
            </div>
            <div className="flex flex-col gap-6">
              {[
                { step: 1, title: "Drop a pin", desc: "Tell us where and when. We handle the rest." },
                { step: 2, title: "Smart Matching", desc: "We alert buddies who match your kitchen's vibe and location." },
                { step: 3, title: "Get Cooking", desc: "Your buddy arrives, you focus on the food. Simple." }
              ].map((item) => (
                <div key={item.step} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/40">
                    0{item.step}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-white font-bold text-lg m-0">{item.title}</h4>
                    <p className="text-white/50 text-sm m-0 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-2xl border border-purple-500/20">🛡️</div>
              <h3 className="text-2xl font-black text-white m-0 tracking-tight">Vetted for your peace of mind.</h3>
              <p className="text-white/60 leading-relaxed m-0">
                Every Buddy in our pool goes through a rigorous identity check and basic kitchen safety screening. We're not just a platform; we're your backup crew.
              </p>
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center gap-3 text-sm font-medium text-white/80 italic">
                   <span className="text-emerald-400">“</span> Reliable, fast, and exactly what we needed for the Saturday rush. <span className="text-emerald-400">”</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-white/20" />
                   <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Mama Jay Kitchen</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8 md:gap-12">
           <div className="text-center">
              <h2 className="text-3xl font-black text-white m-0">Built for Scale</h2>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: "Fill Rate", val: "99.8%", sub: "Matches completed" },
                { label: "Avg Match", val: "12m", sub: "Response time" },
                { label: "Vetted Buddies", val: "400+", sub: "In Nairobi" },
                { label: "Chef Score", val: "4.9/5", sub: "Satisfaction index" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/[0.08] transition-colors">
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] m-0 mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-white m-0">{stat.val}</p>
                  <p className="text-xs text-white/30 m-0 mt-1">{stat.sub}</p>
                </div>
              ))}
           </div>
        </section>

      </main>
      <SiteFooter />

      {activeModal === "request" ? (
        <BuddyPoolModal
          title="Request a Helper"
          description="Fill in the request details and pick your exact location."
          onClose={() => setActiveModal(null)}
        >
          <BuddyPoolRequestForm />
        </BuddyPoolModal>
      ) : null}

      {activeModal === "matching" ? (
        <BuddyPoolModal
          title="How Matching Works"
          description="We rank helpers by distance, skills, availability, and ratings."
          onClose={() => setActiveModal(null)}
        >
          <div className="mt-6 flex flex-col gap-4 pb-4">
            {[
              { step: 1, title: "Request created", desc: "Seller specifies task, time, and location." },
              { step: 2, title: "Helpers ranked", desc: "System scores helpers and notifies the best ones." },
              { step: 3, title: "Seller confirms", desc: "Seller chooses a helper and confirms assignment." }
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center text-sm font-bold border border-purple-500/20">
                  {item.step}
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-white font-bold text-sm m-0">{item.title}</h4>
                  <p className="text-white/50 text-xs m-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </BuddyPoolModal>
      ) : null}
    </div>
  );
}
