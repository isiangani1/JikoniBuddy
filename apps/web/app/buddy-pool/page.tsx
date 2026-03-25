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
    <>
      <SiteHeader />
      <main className={`category-page ${activeModal ? "blurred" : ""}`}>
        <section className="buddy-hero">
          <div className="buddy-hero-content">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Buddy Pool</p>
            <h1 className="flow-reveal">Power up your kitchen on demand.</h1>
            <p className="text-white/70 m-0 text-lg">
              Sellers can request trusted helpers when demand spikes, keeping
              quality high and delivery on time.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" onClick={() => setActiveModal("request")}>
                Request a Helper
              </button>
              <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" onClick={() => setActiveModal("matching")}>
                How Matching Works
              </button>
            </div>
          </div>
          <BuddyPoolHero />
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>How Buddy Pool Works</h2>
          <div className="steps">
            <div className="step- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
              <span>1</span>
              <h3>Create a request</h3>
              <p>Pick time, location, task type, and duration.</p>
            </div>
            <div className="step- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
              <span>2</span>
              <h3>Helpers get notified</h3>
              <p>Nearby helpers receive real-time alerts.</p>
            </div>
            <div className="step- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
              <span>3</span>
              <h3>Confirm and deliver</h3>
              <p>Choose the best helper, finish faster.</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2>Why it matters</h2>
            <p>Reliability, speed, and quality control for peak demand.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>Instant capacity boost</h3>
              <p>Scale your kitchen without long-term hires.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>Trusted helpers</h3>
              <p>Ratings and verification keep standards high.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>On-time delivery</h3>
              <p>Maintain SLAs even on the busiest days.</p>
            </div>
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
          <div className="modal-body">
            <BuddyPoolRequestForm />
          </div>
        </BuddyPoolModal>
      ) : null}

      {activeModal === "matching" ? (
        <BuddyPoolModal
          title="How Matching Works"
          description="We rank helpers by distance, skills, availability, and ratings."
          onClose={() => setActiveModal(null)}
        >
          <div className="modal-body">
            <div className="steps">
              <div className="step- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
                <span>1</span>
                <h3>Request created</h3>
                <p>Seller specifies task, time, and location.</p>
              </div>
              <div className="step- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
                <span>2</span>
                <h3>Helpers ranked</h3>
                <p>System scores helpers and notifies the best ones.</p>
              </div>
              <div className="step- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
                <span>3</span>
                <h3>Seller confirms</h3>
                <p>Seller chooses a helper and confirms assignment.</p>
              </div>
            </div>
          </div>
        </BuddyPoolModal>
      ) : null}
    </>
  );
}
