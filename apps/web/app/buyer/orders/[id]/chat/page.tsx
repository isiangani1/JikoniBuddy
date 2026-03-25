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
    const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
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
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
          <section className="flex flex-col gap-6 animate-in fade-in duration-500">
            <h2>Chat not available</h2>
            <p className="text-white/50 text-sm">Order not found.</p>
            <Link className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" href="/buyer">
              Back to buyer
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Order chat</p>
            <h1>Chat with {seller ? seller.name : "Seller"}</h1>
            <p className="text-white/70 m-0 text-lg">Order #{order.id}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href={`/buyer/orders/${order.id}`}>
                Back to tracking
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>Realtime</h3>
            <p className="text-white/50 text-sm">
              Chat is stubbed with local persistence. Ready for Pusher private
              channels + auth.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Conversation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <div className="chat-thread">
                {messages.length ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`chat-bubble ${message.sender === "buyer" ? "mine" : "theirs"}`}
                    >
                      <p>{message.text}</p>
                      <p className="text-white/50 text-sm">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-white/50 text-sm">No messages yet.</p>
                )}
              </div>

              <div className="chat-compose">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a message"
                />
                <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" type="button" onClick={handleSend}>
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
