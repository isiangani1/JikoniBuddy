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
            <p className="eyebrow">Buddy Pool</p>
            <h1 className="flow-reveal">Power up your kitchen on demand.</h1>
            <p className="subhead">
              Sellers can request trusted helpers when demand spikes, keeping
              quality high and delivery on time.
            </p>
            <div className="hero-actions">
              <button className="primary" onClick={() => setActiveModal("request")}>
                Request a Helper
              </button>
              <button className="ghost" onClick={() => setActiveModal("matching")}>
                How Matching Works
              </button>
            </div>
          </div>
          <BuddyPoolHero />
        </section>

        <section className="section fade-in">
          <h2>How Buddy Pool Works</h2>
          <div className="steps">
            <div className="step-card">
              <span>1</span>
              <h3>Create a request</h3>
              <p>Pick time, location, task type, and duration.</p>
            </div>
            <div className="step-card">
              <span>2</span>
              <h3>Helpers get notified</h3>
              <p>Nearby helpers receive real-time alerts.</p>
            </div>
            <div className="step-card">
              <span>3</span>
              <h3>Confirm and deliver</h3>
              <p>Choose the best helper, finish faster.</p>
            </div>
          </div>
        </section>

        <section className="section fade-in">
          <div className="section-header">
            <h2>Why it matters</h2>
            <p>Reliability, speed, and quality control for peak demand.</p>
          </div>
          <div className="category-grid">
            <div className="category-card">
              <h3>Instant capacity boost</h3>
              <p>Scale your kitchen without long-term hires.</p>
            </div>
            <div className="category-card">
              <h3>Trusted helpers</h3>
              <p>Ratings and verification keep standards high.</p>
            </div>
            <div className="category-card">
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
              <div className="step-card">
                <span>1</span>
                <h3>Request created</h3>
                <p>Seller specifies task, time, and location.</p>
              </div>
              <div className="step-card">
                <span>2</span>
                <h3>Helpers ranked</h3>
                <p>System scores helpers and notifies the best ones.</p>
              </div>
              <div className="step-card">
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
