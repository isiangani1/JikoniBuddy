"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";

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

// Map Component imports (will be lazy loaded if needed, or used directly if libraries are available)
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function OrderManagementBoardInner() {
  const queryClient = useQueryClient();
  const [sellerId, setSellerId] = useState<string | null>(null);

  useEffect(() => {
    setSellerId(localStorage.getItem("jb_session") || "test-seller-1");
  }, []);

  const [activeChatOrder, setActiveChatOrder] = useState<Order | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);

  useEffect(() => {
    if (!activeTrackingOrder) {
      setTrackingData(null);
      return;
    }
    const orderId = activeTrackingOrder.id;
    fetch(`/api/seller/orders/${orderId}/tracking`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setTrackingData(data))
      .catch(() => null);

    const socketUrl =
      process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL ?? "http://localhost:4005";
    const socket = io(socketUrl);
    socket.emit("tracking:join", { orderId });
    socket.on("tracking:update", (payload) => {
      setTrackingData((prev: any) => ({
        ...(prev ?? {}),
        driver: { lat: payload.lat, lng: payload.lng },
        status: prev?.status ?? "in_progress"
      }));
    });
    return () => {
      socket.emit("tracking:leave", { orderId });
      socket.disconnect();
    };
  }, [activeTrackingOrder]);

  // Fetch Orders from DB explicitly
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["sellerOrders", sellerId],
    queryFn: async () => {
      if (!sellerId) return [];
      const res = await fetch(`/api/seller/orders?sellerId=${sellerId}`);
      if (!res.ok) throw new Error("Network error");
      return res.json() as Promise<Order[]>;
    },
    enabled: !!sellerId,
    refetchInterval: 5000 // Poll database for updates every 5s
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: OrderStatus }) => {
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
        old.map(o => o.id === variables.orderId ? { ...o, status: variables.status } : o)
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
      "pending": "accepted",
      "accepted": "preparing",
      "preparing": "ready",
      "ready": "completed",
      "completed": null
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
  const driverPosition = trackingData?.driver ?? { lat: -1.29, lng: 36.825 };
  const destinationPosition =
    trackingData?.destination ?? { lat: -1.295, lng: 36.805, label: "Buyer" };

  if (isLoading) return <p style={{ padding: "2rem" }}>Loading real-time order queue...</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Operations</p>
          <h1>Order Kanban Board</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "0.5rem" }}>Live Database Stream Tracker. Drag or move cards to update Postgres instantly.</p>
        </div>
        <button 
          className="base" 
          style={{ background: "#2dd4bf", color: "#1a1026", padding: "0.6rem 1.2rem", border: "none", fontWeight: "bold" }}
          onClick={() => generateOrderMutation.mutate()}
          disabled={generateOrderMutation.isPending}
        >
          {generateOrderMutation.isPending ? "Simulating..." : "Simulate Incoming Order"}
        </button>
      </header>

      <div className="kanban-board">
        {columns.map(col => (
          <div key={col.status} style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "12px", minHeight: "60vh" }}>
            <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
              {col.label}
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {orders.filter(o => o.status === col.status).map(order => (
                <div key={order.id} style={{ background: "#211a30", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: "bold" }}>{order.id}</span>
                    <span style={{ color: "#2dd4bf" }}>KES {order.totalAmount}</span>
                  </div>
                  <p style={{ margin: "0 0 0.5rem", color: "rgba(255,255,255,0.8)" }}>{order.buyerName}</p>
                  <ul style={{ margin: "0 0 1rem", paddingLeft: "1.2rem", color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
                    {order.items.map((item, idx) => (
                      <li key={idx}>{item.quantity}x {item.name}</li>
                    ))}
                  </ul>
                  {col.status !== "ready" ? (
                    <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} onClick={() => advanceStatus(order)}>
                      Move to {col.status === 'pending' ? 'Accepted' : col.status === 'accepted' ? 'Preparing' : 'Ready'}
                    </button>
                  ) : (
                    <button className="base" style={{ width: "100%", padding: "0.5rem", background: "#7C5CFF", color: "#fff", border: "none", marginBottom: "0.5rem" }} onClick={() => advanceStatus(order)}>
                      Mark Completed
                    </button>
                  )}
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" style={{ fontSize: "0.8rem", padding: "0.4rem" }} onClick={() => setActiveChatOrder(order)}>💬 Message</button>
                    {(order.status === 'ready' || order.status === 'completed') && (
                       <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" style={{ fontSize: "0.8rem", padding: "0.4rem" }} onClick={() => setActiveTrackingOrder(order)}>📍 Track</button>
                    )}
                  </div>
                </div>
              ))}
              {orders.filter(o => o.status === col.status).length === 0 && (
                <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", fontSize: "0.9rem", padding: "2rem 0" }}>
                  <p>Queue empty</p>
                  {col.status === "pending" && (
                    <button 
                      className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" 
                      style={{ marginTop: "1rem", fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
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

      {/* Chat Overlay */}
       {activeChatOrder && (
         <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "350px", background: "#1a1026", borderLeft: "1px solid rgba(255,255,255,0.1)", zIndex: 1000, display: "flex", flexDirection: "column", animation: "slideIn 0.3s ease-out" }}>
           <header style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <div>
               <h3 style={{ margin: 0 }}>{activeChatOrder?.buyerName}</h3>
               <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Order #{activeChatOrder?.id.slice(-6)}</p>
             </div>
             <button style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.5rem" }} onClick={() => setActiveChatOrder(null)}>&times;</button>
           </header>
           
           <div style={{ flex: 1, padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
             <div style={{ background: "rgba(124, 92, 255, 0.1)", padding: "1rem", borderRadius: "12px", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
                Direct channel to the buyer. Messages are encrypted and logged for safety.
             </div>
             {/* Simple message list mock */}
             <div style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.05)", padding: "0.8rem", borderRadius: "12px", maxWidth: "80%", fontSize: "0.9rem" }}>
               Hi, how is the order coming along?
             </div>
             <div style={{ alignSelf: "flex-end", background: "#7C5CFF", padding: "0.8rem", borderRadius: "12px", maxWidth: "80%", fontSize: "0.9rem" }}>
               Almost ready! Just packaging it up now.
             </div>
           </div>

           <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
             <div style={{ display: "flex", gap: "0.5rem" }}>
               <input 
                 type="text" 
                 placeholder="Type a message..." 
                 style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }} 
               />
               <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" style={{ padding: "0 1rem" }}>Send</button>
             </div>
           </div>
         </div>
       )}

       {/* Tracking Map Modal */}
       {activeTrackingOrder && (
         <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
            <div style={{ background: "#1a1026", width: "90%", maxWidth: "800px", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
              <header style={{ padding: "1.2rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Live Delivery Tracker</h2>
                <button style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.5rem" }} onClick={() => setActiveTrackingOrder(null)}>&times;</button>
              </header>
              <div style={{ height: "400px", background: "#0e0814", position: "relative" }}>
                 <MapContainer center={[driverPosition.lat, driverPosition.lng]} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[sellerPosition.lat, sellerPosition.lng]}>
                      <Popup>Kitchen (You)</Popup>
                    </Marker>
                    <Marker position={[driverPosition.lat, driverPosition.lng]}>
                      <Popup>Delivery Buddy (Active)</Popup>
                    </Marker>
                    <Marker position={[destinationPosition.lat, destinationPosition.lng]}>
                      <Popup>{destinationPosition.label ?? "Buyer Location"}</Popup>
                    </Marker>
                    <Polyline
                      positions={[
                        [sellerPosition.lat, sellerPosition.lng],
                        [driverPosition.lat, driverPosition.lng],
                        [destinationPosition.lat, destinationPosition.lng]
                      ]}
                      color="blue"
                    />
                 </MapContainer>
              </div>
              <footer style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#7C5CFF", display: "flex", alignItems: "center", justifyContent: "center" }}>🚴</div>
                    <div>
                      <p style={{ margin: 0, fontWeight: "bold" }}>Kamau J.</p>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>3.2 mins away from destination</p>
                    </div>
                 </div>
                 <button className="base" style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "none", padding: "0.6rem 1rem" }}>Contact Rider</button>
              </footer>
            </div>
         </div>
       )}
    </main>
  );
}

export default dynamic(() => Promise.resolve(OrderManagementBoardInner), { ssr: false });
