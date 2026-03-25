"use client";

import { useState } from "react";

export default function SellerSupportDesk() {
  const [ticket, setTicket] = useState({ subject: "", category: "order_issue", priority: "normal", description: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setTicket({ subject: "", category: "order_issue", priority: "normal", description: "" });
  };

  return (
    <main style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Help & Assistance</p>
        <h1>Seller Support Desk</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "0.5rem" }}>Connected directly to platform administration. Typical response time is 15 minutes.</p>
      </header>

      {submitted ? (
        <div style={{ background: "rgba(45,212,191,0.1)", border: "1px solid #2dd4bf", padding: "3rem", borderRadius: "24px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
          <h3>Ticket #JB-9102 Received</h3>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>An administrator has been pinged. We'll reach out via push notification and email.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.05)", padding: "2rem", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Subject</label>
                <input 
                  type="text" 
                  value={ticket.subject}
                  onChange={e => setTicket({...ticket, subject: e.target.value})}
                  required
                  style={{ width: "100%", padding: "1rem", borderRadius: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Category</label>
                <select 
                  value={ticket.category}
                  onChange={e => setTicket({...ticket, category: e.target.value})}
                  style={{ width: "100%", padding: "1rem", borderRadius: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                >
                  <option value="order_issue">Order Issue</option>
                  <option value="payout_issue">Payment / Payout</option>
                  <option value="buddy_issue">Buddy Pool</option>
                  <option value="technical">Technical Bug</option>
                </select>
              </div>
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Tell us more *</label>
              <textarea 
                value={ticket.description}
                onChange={e => setTicket({...ticket, description: e.target.value})}
                required
                placeholder="Include order numbers or specific Buddy IDs if applicable..."
                rows={6}
                style={{ width: "100%", padding: "1rem", borderRadius: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
              />
            </div>

            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" style={{ padding: "1.2rem", borderRadius: "12px", fontSize: "1rem" }}>
              Open Ticket
            </button>
          </div>
        </form>
      )}

      <div style={{ marginTop: "3rem" }}>
        <h3 style={{ marginBottom: "1.5rem" }}>FAQ Quick links</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {["M-Pesa Payout Times", "Handling Chargebacks", "Buddy Pool Policies", "Kitchen Safety Standards"].map(item => (
            <div key={item} style={{ background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
              {item} →
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
