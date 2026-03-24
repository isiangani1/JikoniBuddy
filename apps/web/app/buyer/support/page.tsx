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
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
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
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Support</p>
            <h1>Help, disputes & refunds</h1>
            <p className="subhead">
              Create a ticket for an order issue, or reach support instantly.
            </p>
            <div className="hero-actions">
              <Link className="badge" href="/buyer">
                Back to dashboard
              </Link>
              <Link className="badge" href="/buyer/orders">
                Orders
              </Link>
              {orderId ? (
                <Link className="badge" href={`/buyer/orders/${orderId}`}>
                  Back to order
                </Link>
              ) : null}
            </div>
          </div>

          <div className="category-hero-card">
            <h3>Quick support</h3>
            <a className="primary full" href={whatsappLink} target="_blank" rel="noreferrer">
              WhatsApp Support
            </a>
            <p className="muted">Number is stubbed. Replace with your real support line.</p>
          </div>
        </section>

        <section className="section fade-in">
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
              <p className="muted">
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

            <button className="primary" type="button" onClick={handleCreate}>
              Submit ticket
            </button>
            <p className="muted">
              Tickets are stored locally for now and ready for API wiring.
            </p>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Your recent tickets</h2>
          {tickets.length ? (
            <div className="category-grid">
              {tickets.slice(0, 10).map((ticket) => (
                <div key={ticket.id} className="category-card">
                  <h3>{ticket.subject}</h3>
                  <p className="muted">Ticket: {ticket.id}</p>
                  <p className="muted">Status: {ticket.status}</p>
                  <p className="muted">Category: {ticket.category}</p>
                  {ticket.orderId ? <p className="muted">Order: {ticket.orderId}</p> : null}
                  <p>{ticket.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No tickets yet.</p>
          )}
        </section>
      </main>
    </>
  );
}
