"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sellers } from "@/data/sellers";
import {
  appendOrderMessage,
  getOrder,
  loadOrderMessages,
  OrderMessage
} from "@/data/buyerStorage";

export default function BuyerOrderChatPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [version, setVersion] = useState(0);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  const order = useMemo(() => getOrder(params.id), [params.id]);
  const seller = useMemo(() => {
    if (!order) return null;
    return sellers.find((item) => item.id === order.sellerId) ?? null;
  }, [order]);

  const messages = useMemo<OrderMessage[]>(
    () => loadOrderMessages(params.id),
    [params.id, version]
  );

  useEffect(() => {
    // Stub for Pusher wiring:
    // Later replace with subscription to `private-order.${orderId}`.
    const interval = window.setInterval(() => setVersion((v) => v + 1), 2500);
    return () => window.clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (!draft.trim()) return;
    appendOrderMessage(params.id, {
      orderId: params.id,
      sender: "buyer",
      text: draft.trim()
    });
    setDraft("");
    setVersion((v) => v + 1);
  };

  if (!order) {
    return (
      <>
        <main className="category-page">
          <section className="section fade-in">
            <h2>Chat not available</h2>
            <p className="muted">Order not found.</p>
            <Link className="primary" href="/buyer">
              Back to buyer
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Order chat</p>
            <h1>Chat with {seller ? seller.name : "Seller"}</h1>
            <p className="subhead">Order #{order.id}</p>
            <div className="hero-actions">
              <Link className="badge" href={`/buyer/orders/${order.id}`}>
                Back to tracking
              </Link>
            </div>
          </div>
          <div className="category-hero-card">
            <h3>Realtime</h3>
            <p className="muted">
              Chat is stubbed with local persistence. Ready for Pusher private
              channels + auth.
            </p>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Conversation</h2>
          <div className="category-grid">
            <div className="category-card">
              <div className="chat-thread">
                {messages.length ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`chat-bubble ${message.sender === "buyer" ? "mine" : "theirs"}`}
                    >
                      <p>{message.text}</p>
                      <p className="muted">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="muted">No messages yet.</p>
                )}
              </div>

              <div className="chat-compose">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a message"
                />
                <button className="primary" type="button" onClick={handleSend}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
