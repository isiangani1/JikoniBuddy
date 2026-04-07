"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "completed";

interface Order {
  id: string;
  buyerName: string;
  buyerId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: { name: string; quantity: number }[];
  assignedBuddyId?: string;
}

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function OrderManagementBoardInner() {
  const queryClient = useQueryClient();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [activeChatOrder, setActiveChatOrder] = useState<Order | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [driverPosition, setDriverPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [targetPosition, setTargetPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [lastUpdateAt, setLastUpdateAt] = useState<number | null>(null);
  const [isTrackingStale, setIsTrackingStale] = useState(false);

  useEffect(() => {
    setSellerId(localStorage.getItem("jb_session") || "test-seller-1");
  }, []);

  useEffect(() => {
    if (!sellerId) return;
    const socketUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const socket = io(`${socketUrl}/ws/seller`, { transports: ["websocket"] });
    socket.emit("seller:join", { sellerId });

    socket.on("order.updated", (payload: Order) => {
      queryClient.setQueryData(["sellerOrders", sellerId], (old: Order[] = []) => {
        const existing = old.find((order) => order.id === payload.id);
        if (existing) {
          return old.map((order) => (order.id === payload.id ? { ...order, ...payload } : order));
        }
        return [payload, ...old];
      });
    });

    return () => socket.disconnect();
  }, [sellerId, queryClient]);

  useEffect(() => {
    if (!activeTrackingOrder) {
      setTrackingData(null);
      setDriverPosition(null);
      setTargetPosition(null);
      setLastUpdateAt(null);
      return;
    }

    const orderId = activeTrackingOrder.id;
    fetch(`/api/seller/orders/${orderId}/tracking`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setTrackingData(data);
        if (data?.driver?.lat && data?.driver?.lng) {
          const initial = { lat: data.driver.lat, lng: data.driver.lng };
          setDriverPosition(initial);
          setTargetPosition(initial);
          setLastUpdateAt(Date.now());
        }
      })
      .catch(() => null);

    const socketUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const socket = io(`${socketUrl}/ws/buddy`, { transports: ["websocket"] });
    socket.emit("tracking:join", { orderId });
    socket.on("tracking:update", (payload) => {
      setTrackingData((prev: any) => ({
        ...(prev ?? {}),
        driver: { lat: payload.lat, lng: payload.lng },
        status: prev?.status ?? "in_progress"
      }));
      setTargetPosition({ lat: payload.lat, lng: payload.lng });
      setLastUpdateAt(Date.now());
    });

    return () => {
      socket.emit("tracking:leave", { orderId });
      socket.disconnect();
    };
  }, [activeTrackingOrder]);

  useEffect(() => {
    if (!targetPosition) return;
    const start = driverPosition ?? targetPosition;
    const duration = 900;
    let raf = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const lat = start.lat + (targetPosition.lat - start.lat) * progress;
      const lng = start.lng + (targetPosition.lng - start.lng) * progress;
      setDriverPosition({ lat, lng });
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [targetPosition]);

  useEffect(() => {
    if (!lastUpdateAt) return;
    const interval = window.setInterval(() => {
      setIsTrackingStale(Date.now() - lastUpdateAt > 15000);
    }, 2000);
    return () => window.clearInterval(interval);
  }, [lastUpdateAt]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["sellerOrders", sellerId],
    queryFn: async () => {
      if (!sellerId) return [];
      const res = await fetch(`/api/seller/orders?sellerId=${sellerId}`);
      if (!res.ok) throw new Error("Network error");
      return res.json() as Promise<Order[]>;
    },
    enabled: !!sellerId
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const res = await fetch(`/api/seller/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["sellerOrders", sellerId], (old: Order[] = []) =>
        old.map((o) => (o.id === variables.orderId ? { ...o, status: variables.status } : o))
      );
    }
  });

  const generateOrderMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/seller/orders?sellerId=${sellerId}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate order");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerOrders", sellerId] });
    }
  });

  const advanceStatus = (order: Order) => {
    const flows: Record<OrderStatus, OrderStatus | null> = {
      pending: "accepted",
      accepted: "preparing",
      preparing: "ready",
      ready: "completed",
      completed: null
    };
    const next = flows[order.status];
    if (next) updateStatusMutation.mutate({ orderId: order.id, status: next });
  };

  const columns: { label: string; status: OrderStatus }[] = [
    { label: "New Alerts (Pending)", status: "pending" },
    { label: "Queued (Accepted)", status: "accepted" },
    { label: "In Kitchen (Preparing)", status: "preparing" },
    { label: "Ready for Pickup", status: "ready" }
  ];

  const sellerPosition = trackingData?.seller ?? { lat: -1.286389, lng: 36.817223 };
  const driverLive = driverPosition ?? { lat: -1.29, lng: 36.825 };
  const destinationPosition =
    trackingData?.destination ?? { lat: -1.295, lng: 36.805, label: "Buyer" };

  if (isLoading) return <p className="p-8 text-white/70">Loading real-time order queue...</p>;

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Operations</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white m-0">Order Kanban Board</h1>
          <p className="text-white/60 text-sm mt-2">
            Live database stream tracker. Drag or move cards to update Postgres instantly.
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#1a1026] font-bold hover:opacity-90 transition-opacity"
          onClick={() => generateOrderMutation.mutate()}
          disabled={generateOrderMutation.isPending}
        >
          {generateOrderMutation.isPending ? "Simulating..." : "Simulate Incoming Order"}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {columns.map((col) => (
          <div key={col.status} className="bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[60vh]">
            <h3 className="text-white/80 font-semibold border-b border-white/10 pb-2 mb-4">
              {col.label}
            </h3>

            <div className="flex flex-col gap-4">
              {orders
                .filter((o) => o.status === col.status)
                .map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#211a30] border border-white/10 rounded-xl p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{order.id}</span>
                      <span className="text-teal-300 font-semibold">KES {order.totalAmount}</span>
                    </div>
                    <p className="text-white/80 text-sm m-0">{order.buyerName}</p>
                    <ul className="text-white/60 text-xs list-disc pl-5">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity}x {item.name}
                        </li>
                      ))}
                    </ul>
                    {col.status !== "ready" ? (
                      <button
                        className="w-full px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity"
                        onClick={() => advanceStatus(order)}
                      >
                        Move to {col.status === "pending" ? "Accepted" : col.status === "accepted" ? "Preparing" : "Ready"}
                      </button>
                    ) : (
                      <button
                        className="w-full px-4 py-2 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-400 transition-colors"
                        onClick={() => advanceStatus(order)}
                      >
                        Mark Completed
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="px-3 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
                        onClick={() => setActiveChatOrder(order)}
                      >
                        💬 Message
                      </button>
                      {(order.status === "ready" || order.status === "completed") && (
                        <button
                          className="px-3 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
                          onClick={() => setActiveTrackingOrder(order)}
                        >
                          📍 Track
                        </button>
                      )}
                    </div>
                  </div>
                ))}

              {orders.filter((o) => o.status === col.status).length === 0 && (
                <div className="text-white/40 text-center text-sm py-8">
                  <p className="m-0">Queue empty</p>
                  {col.status === "pending" && (
                    <button
                      className="mt-3 px-4 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
                      onClick={() => generateOrderMutation.mutate()}
                    >
                      Create Test Order
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeChatOrder && (
        <div className="fixed inset-y-0 right-0 w-[320px] sm:w-[360px] bg-[#1a1026] border-l border-white/10 z-[1000] flex flex-col">
          <header className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="m-0 text-white font-semibold">{activeChatOrder?.buyerName}</h3>
              <p className="m-0 text-xs text-white/50">Order #{activeChatOrder?.id.slice(-6)}</p>
            </div>
            <button
              className="text-white/70 text-2xl"
              onClick={() => setActiveChatOrder(null)}
              type="button"
            >
              ×
            </button>
          </header>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            <div className="bg-purple-500/10 p-3 rounded-xl text-xs text-white/70">
              Direct channel to the buyer. Messages are encrypted and logged for safety.
            </div>
            <div className="self-start bg-white/10 p-3 rounded-xl text-sm max-w-[80%]">
              Hi, how is the order coming along?
            </div>
            <div className="self-end bg-purple-500 p-3 rounded-xl text-sm max-w-[80%]">
              Almost ready! Just packaging it up now.
            </div>
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
              />
              <button className="px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold">Send</button>
            </div>
          </div>
        </div>
      )}

      {activeTrackingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1100] flex items-center justify-center p-4">
          <div className="bg-[#1a1026] w-full max-w-3xl rounded-2xl overflow-hidden border border-white/10">
            <header className="px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div>
                <h3 className="text-white font-semibold m-0">Tracking Order</h3>
                <p className="text-xs text-white/50 m-0">#{activeTrackingOrder.id}</p>
              </div>
              <button className="text-white/70 text-2xl" onClick={() => setActiveTrackingOrder(null)} type="button">
                ×
              </button>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">
              <div className="lg:col-span-2 h-[360px] rounded-xl overflow-hidden border border-white/10 bg-[#0e0814]">
                <MapContainer center={[driverLive.lat, driverLive.lng]} zoom={13} className="h-full w-full" scrollWheelZoom={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" className="brightness-90 contrast-90 invert hue-rotate-180" />
                  <Marker position={[sellerPosition.lat, sellerPosition.lng]}>
                    <Popup>Kitchen</Popup>
                  </Marker>
                  <Marker position={[driverLive.lat, driverLive.lng]}>
                    <Popup>Rider</Popup>
                  </Marker>
                  <Marker position={[destinationPosition.lat, destinationPosition.lng]}>
                    <Popup>Dropoff</Popup>
                  </Marker>
                  <Polyline
                    positions={[
                      [sellerPosition.lat, sellerPosition.lng],
                      [driverLive.lat, driverLive.lng],
                      [destinationPosition.lat, destinationPosition.lng]
                    ]}
                    pathOptions={{ color: "#7C5CFF", weight: 4, dashArray: "10, 10" }}
                  />
                </MapContainer>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
                <h4 className="text-white font-semibold m-0">Rider status</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Rider assigned</span>
                  <span className={driverPosition && !isTrackingStale ? "text-emerald-300 font-semibold" : "text-white/40"}>
                    {driverPosition && !isTrackingStale ? "Live" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Signal</span>
                  <span className={isTrackingStale ? "text-orange-300 font-semibold" : "text-emerald-300 font-semibold"}>
                    {isTrackingStale ? "Lost" : "Active"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Pickup</span>
                  <span className={activeTrackingOrder.status === "ready" || activeTrackingOrder.status === "completed" ? "text-emerald-300 font-semibold" : "text-white/40"}>
                    {activeTrackingOrder.status === "ready" || activeTrackingOrder.status === "completed" ? "Yes" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Dropoff</span>
                  <span className={activeTrackingOrder.status === "completed" ? "text-emerald-300 font-semibold" : "text-white/40"}>
                    {activeTrackingOrder.status === "completed" ? "Done" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function OrderManagementBoard() {
  return <OrderManagementBoardInner />;
}
