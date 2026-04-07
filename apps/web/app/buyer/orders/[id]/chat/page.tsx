"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client";
import { sellers } from "@/data/sellers";
import { getOrder } from "@/data/buyerStorage";

type ChatMessage = {
  id: string;
  orderId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
};

export default function BuyerOrderChatPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadAt, setLastReadAt] = useState<string | null>(null);

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

  const buyerId =
    typeof window !== "undefined"
      ? sessionStorage.getItem("jb_user_id") ?? "buyer"
      : "buyer";

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetch(`/api/chat/orders/${params.id}/messages?userId=${encodeURIComponent(buyerId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        setMessages((data?.messages ?? []).map((msg: any) => ({
          ...msg,
          createdAt: msg.createdAt ?? new Date().toISOString()
        })));
        setUnreadCount(data?.unreadCount ?? 0);
        setLastReadAt(data?.lastReadAt ?? null);
      })
      .catch(() => null)
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.id, buyerId]);

  const markRead = async () => {
    if (!buyerId) return;
    const res = await fetch(`/api/chat/orders/${params.id}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: buyerId })
    });
    if (res.ok) {
      const payload = await res.json();
      setLastReadAt(payload?.lastReadAt ?? new Date().toISOString());
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const socket = io(`${socketUrl}/ws/chat`, { transports: ["websocket"] });
    socket.emit("chat:join", { orderId: params.id });
    socket.on("chat:message", (payload: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === payload.id)) return prev;
        return [...prev, { ...payload, createdAt: payload.createdAt ?? new Date().toISOString() }];
      });
      if (payload.senderId !== buyerId) {
        setUnreadCount((count) => count + 1);
      }
    });
    return () => {
      socket.emit("chat:leave", { orderId: params.id });
      socket.disconnect();
    };
  }, [params.id, buyerId]);

  useEffect(() => {
    if (isLoading) return;
    markRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, messages.length]);

  const handleSend = async () => {
    if (!draft.trim()) return;
    const senderId = buyerId;
    const receiverId = order?.sellerId ?? undefined;
    const res = await fetch(`/api/chat/orders/${params.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId, text: draft.trim() })
    });
    if (res.ok) {
      const message = await res.json();
      setMessages((prev) => [...prev, message]);
      setDraft("");
    }
  };

  if (!order) {
    return (
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Chat not available</h2>
          <p className="text-white/50 text-sm">Order not found.</p>
          <Link className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" href="/buyer">
            Back to buyer
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Order chat</p>
          <h1>Chat with {seller ? seller.name : "Seller"}</h1>
          <p className="text-white/70 m-0 text-lg">Order #{order.id}</p>
          <p className="text-white/50 text-sm m-0">Unread messages: {unreadCount}</p>
          {lastReadAt ? (
            <p className="text-white/40 text-xs m-0">
              Last read: {new Date(lastReadAt).toLocaleTimeString()}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 mt-4">
            <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href={`/buyer/orders/${order.id}`}>
              Back to tracking
            </Link>
          </div>
        </div>
        <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
          <h3>Realtime</h3>
          <p className="text-white/50 text-sm">
            Live chat powered by Socket.IO with persistent message history.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6 animate-in fade-in duration-500">
        <h2>Conversation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-4">
            <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-2">
              {isLoading ? (
                <p className="text-white/50 text-sm">Loading messages...</p>
              ) : messages.length ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-xl p-3 text-sm ${
                      message.senderId === (sessionStorage.getItem("jb_user_id") ?? "buyer")
                        ? "bg-teal-500/20 text-white self-end"
                        : "bg-white/10 text-white/80"
                    }`}
                  >
                    <p className="m-0">{message.text}</p>
                    <p className="text-white/40 text-[11px] mt-2">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-white/50 text-sm">No messages yet.</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type a message"
                className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
              />
              <button
                className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                type="button"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
