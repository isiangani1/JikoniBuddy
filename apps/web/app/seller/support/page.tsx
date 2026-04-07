"use client";

import { useState } from "react";

export default function SellerSupportDesk() {
  const [ticket, setTicket] = useState({
    subject: "",
    category: "order_issue",
    priority: "normal",
    description: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setTicket({ subject: "", category: "order_issue", priority: "normal", description: "" });
  };

  return (
    <main className="p-4 sm:p-6 max-w-3xl mx-auto flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Help & Assistance</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white m-0">Seller Support Desk</h1>
        <p className="text-white/60 text-sm sm:text-base">
          Connected directly to platform administration. Typical response time is 15 minutes.
        </p>
      </header>

      {submitted ? (
        <div className="bg-teal-500/10 border border-teal-400/40 p-8 sm:p-12 rounded-3xl text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-white m-0">Ticket #JB-9102 Received</h3>
          <p className="text-white/70 mt-2">
            An administrator has been pinged. We&apos;ll reach out via push notification and email.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-6"
        >
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                Subject
              </label>
              <input
                type="text"
                value={ticket.subject}
                onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                Category
              </label>
              <select
                value={ticket.category}
                onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
              >
                <option value="order_issue">Order Issue</option>
                <option value="payout_issue">Payment / Payout</option>
                <option value="buddy_issue">Buddy Pool</option>
                <option value="technical">Technical Bug</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">
              Tell us more *
            </label>
            <textarea
              value={ticket.description}
              onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
              required
              placeholder="Include order numbers or specific Buddy IDs if applicable..."
              rows={6}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity"
          >
            Open Ticket
          </button>
        </form>
      )}

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-white m-0">FAQ Quick links</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "M-Pesa Payout Times",
            "Handling Chargebacks",
            "Buddy Pool Policies",
            "Kitchen Safety Standards"
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/80 hover:bg-white/10 transition-colors cursor-pointer"
            >
              {item} →
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
