"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  createSupportTicket,
  loadSupportTickets,
  SupportTicket
} from "@/data/buyerStorage";

export default function BuyerSupportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";

  const [version, setVersion] = useState(0);
  const tickets = useMemo(() => loadSupportTickets(), [version]);

  const [category, setCategory] = useState<SupportTicket["category"]>("late_delivery");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceNote, setEvidenceNote] = useState("");

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  const handleCreate = () => {
    if (!subject.trim() || !description.trim()) {
      alert("Please enter a subject and description.");
      return;
    }

    const created = createSupportTicket({
      orderId: orderId || undefined,
      category,
      subject: subject.trim(),
      description: description.trim(),
      evidenceNote: evidenceNote.trim() || undefined
    });

    setSubject("");
    setDescription("");
    setEvidenceNote("");
    setVersion((v) => v + 1);

    alert(`Ticket ${created.id} created. (Stub: ready for API wiring)`);
  };

  const whatsappLink = "https://wa.me/254700000000?text=Hello%20Jikoni%20Buddy%20Support";

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Support</p>
            <h1>Help, disputes & refunds</h1>
            <p className="text-white/70 m-0 text-lg">
              Create a ticket for an order issue, or reach support instantly.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer">
                Back to dashboard
              </Link>
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer/orders">
                Orders
              </Link>
              {orderId ? (
                <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href={`/buyer/orders/${orderId}`}>
                  Back to order
                </Link>
              ) : null}
            </div>
          </div>

          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>Quick support</h3>
            <a className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity" href={whatsappLink} target="_blank" rel="noreferrer">
              WhatsApp Support
            </a>
            <p className="text-white/50 text-sm">Number is stubbed. Replace with your real support line.</p>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Create a ticket</h2>
          <div className="form">
            <label className="field">
              <span>Order ID (optional)</span>
              <input value={orderId} readOnly placeholder="ord-..." />
            </label>

            <label className="field">
              <span>Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value as any)}>
                <option value="late_delivery">Late delivery</option>
                <option value="missing_items">Missing items</option>
                <option value="quality">Quality issue</option>
                <option value="payment">Payment issue</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="field">
              <span>Subject</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Wrong items delivered"
              />
            </label>

            <label className="field">
              <span>Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us what happened. Include timestamps and any details."
              />
            </label>

            <label className="field">
              <span>Evidence upload (stub)</span>
              <input type="file" multiple />
              <p className="text-white/50 text-sm">
                Evidence is not uploaded yet. This is a UI placeholder for API wiring.
              </p>
            </label>

            <label className="field">
              <span>Evidence note (optional)</span>
              <input
                value={evidenceNote}
                onChange={(e) => setEvidenceNote(e.target.value)}
                placeholder="e.g. Photo of packaging attached"
              />
            </label>

            <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" type="button" onClick={handleCreate}>
              Submit ticket
            </button>
            <p className="text-white/50 text-sm">
              Tickets are stored locally for now and ready for API wiring.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Your recent tickets</h2>
          {tickets.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.slice(0, 10).map((ticket) => (
                <div key={ticket.id} className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
                  <h3>{ticket.subject}</h3>
                  <p className="text-white/50 text-sm">Ticket: {ticket.id}</p>
                  <p className="text-white/50 text-sm">Status: {ticket.status}</p>
                  <p className="text-white/50 text-sm">Category: {ticket.category}</p>
                  {ticket.orderId ? <p className="text-white/50 text-sm">Order: {ticket.orderId}</p> : null}
                  <p>{ticket.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-sm">No tickets yet.</p>
          )}
        </section>
      </main>
    </>
  );
}
