"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sellers } from "@/data/sellers";
import { io } from "socket.io-client";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  BuyerOrderStatus,
  getOrder,
  getOrderReview,
  getRefundRequestForOrder,
  updateOrderStatus
} from "@/data/buyerStorage";

const statusLabels: Record<BuyerOrderStatus, string> = {
  placed: "Placed",
  accepted: "Accepted",
  in_preparation: "In preparation",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  completed: "Completed"
};

const statusOrder: BuyerOrderStatus[] = [
  "placed",
  "accepted",
  "in_preparation",
  "out_for_delivery",
  "delivered",
  "completed"
];

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function BuyerOrderTrackingPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [version, setVersion] = useState(0);
  const [trackingData, setTrackingData] = useState<any>(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  const order = useMemo(() => getOrder(params.id), [params.id, version]);
  const existingReview = useMemo(() => getOrderReview(params.id), [params.id, version]);
  const existingRefund = useMemo(() => getRefundRequestForOrder(params.id), [params.id, version]);
  const seller = useMemo(() => {
    if (!order) return null;
    return sellers.find((item) => item.id === order.sellerId) ?? null;
  }, [order]);

  useEffect(() => {
    if (!order) return;

    // Stub for Pusher wiring:
    // Later replace with: subscribe to `private-order.${order.id}` and update on events.
    const interval = window.setInterval(() => {
      setVersion((v) => v + 1);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [order]);

  useEffect(() => {
    if (!order) return;
    if (!["out_for_delivery", "delivered", "completed"].includes(order.status)) return;

    fetch(`/api/seller/orders/${order.id}/tracking`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setTrackingData(data))
      .catch(() => null);

    const socketUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const socket = io(`${socketUrl}/ws/buddy`, { transports: ["websocket"] });
    socket.emit("tracking:join", { orderId: order.id });
    socket.on("tracking:update", (payload) => {
      setTrackingData((prev: any) => ({
        ...(prev ?? {}),
        driver: { lat: payload.lat, lng: payload.lng },
        status: prev?.status ?? order.status
      }));
    });
    return () => {
      socket.emit("tracking:leave", { orderId: order.id });
      socket.disconnect();
    };
  }, [order]);

  if (!order) {
    return (
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-3xl mx-auto flex flex-col gap-6 items-center justify-center min-h-[50vh] text-center bg-white/5 border border-white/10 rounded-[24px] mt-8">
        <h2 className="text-3xl font-bold text-white m-0">Order not found</h2>
        <p className="text-white/60 m-0 text-lg">Please return to the Buyer homepage.</p>
        <Link className="mt-4 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors shadow-lg shadow-purple-500/20" href="/buyer">
          Back to browsing
        </Link>
      </main>
    );
  }

  const currentIndex = statusOrder.indexOf(order.status);

  const bumpStatus = () => {
    const next = statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)];
    updateOrderStatus(order.id, next);
    setVersion((v) => v + 1);
  };

  const rewindStatus = () => {
    const next = statusOrder[Math.max(currentIndex - 1, 0)];
    updateOrderStatus(order.id, next);
    setVersion((v) => v + 1);
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-purple-800 to-[#12021f] border border-white/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10 w-full justify-between items-start md:items-center">
          <div className="flex flex-col gap-4 max-w-xl">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-sm m-0">Order tracking</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white m-0">Order #{order.id}</h1>
            <p className="text-lg text-white/80 m-0">
              {seller ? (
                <>Seller: <strong className="text-white">{seller.name}</strong></>
              ) : (
                <>Seller: <strong className="text-white">{order.sellerId}</strong></>
              )}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Link className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors" href={`/buyer/orders/${order.id}/chat`}>
                💬 Chat
              </Link>
              <Link className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors" href={`/buyer/orders/${order.id}/receipt`}>
                📄 Receipt
              </Link>
              {order.status === "completed" ? (
                <Link className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors" href={`/buyer/orders/${order.id}/review`}>
                  ⭐ {existingReview ? "View review" : "Leave review"}
                </Link>
              ) : null}
              <Link className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors" href={`/buyer/support?orderId=${order.id}`}>
                ❓ Support
              </Link>
              <Link className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors" href={`/buyer/orders/${order.id}/refund`}>
                💸 {existingRefund ? `Refund: ${existingRefund.status}` : "Request refund"}
              </Link>
              <Link className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors" href="/buyer">
                Back to browse
              </Link>
            </div>
          </div>

          <div className="bg-[#12021f]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl w-full max-w-sm flex flex-col gap-4">
            <div>
               <h3 className="text-white font-bold text-lg m-0 mb-1">Status</h3>
               <p className="text-purple-400 font-bold text-xl m-0">{statusLabels[order.status]}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button 
                className="py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors text-center" 
                type="button" 
                onClick={rewindStatus}
              >
                Previous
              </button>
              <button 
                className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors text-center shadow-lg shadow-purple-500/20" 
                type="button" 
                onClick={bumpStatus}
              >
                Next
              </button>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-wider m-0 text-center">
              Stub for Pusher events + REST replay
            </p>
          </div>
        </div>
      </section>

      <section className="animate-in fade-in duration-500 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-white m-0">Timeline</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {statusOrder.map((status, index) => {
            const isDone = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={status} className={`relative flex flex-col p-5 rounded-[20px] border shrink-0 w-[160px] snap-center transition-all ${isCurrent ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20' : isDone ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 opacity-60'}`}>
                {isDone && !isCurrent && (
                  <div className="absolute top-3 right-3 text-green-400 text-xs text-xl">✓</div>
                )}
                {isCurrent && (
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></div>
                )}
                <h3 className={`text-[15px] font-bold m-0 mb-1 leading-tight ${isDone ? 'text-white' : 'text-white/60'}`}>{statusLabels[status]}</h3>
                <p className={`text-xs uppercase tracking-wider font-bold m-0 ${isDone ? 'text-purple-300' : 'text-white/40'}`}>{isDone ? "Done" : "Pending"}</p>
              </div>
            );
          })}
        </div>
      </section>

      {order.status === "out_for_delivery" || order.status === "delivered" || order.status === "completed" ? (
        <section className="animate-in fade-in duration-500 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white m-0">Delivery tracking</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative flex flex-col rounded-[20px] overflow-hidden border border-white/12 bg-white/5 h-[400px]">
              <div className="absolute top-4 left-4 z-[1000] bg-[#12021f]/80 backdrop-blur px-4 py-2 rounded-xl border border-white/10 shadow-lg text-sm font-semibold text-white">Live map</div>
              <MapContainer
                center={[
                  trackingData?.driver?.lat ?? -1.29,
                  trackingData?.driver?.lng ?? 36.82
                ]}
                zoom={13}
                style={{ height: "100%", width: "100%", background: "#0e0814" }}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" className="brightness-90 contrast-90 invert hue-rotate-180" />
                <Marker
                  position={[
                    trackingData?.seller?.lat ?? -1.286389,
                    trackingData?.seller?.lng ?? 36.817223
                  ]}
                >
                  <Popup>Kitchen</Popup>
                </Marker>
                <Marker
                  position={[
                    trackingData?.driver?.lat ?? -1.29,
                    trackingData?.driver?.lng ?? 36.82
                  ]}
                >
                  <Popup>Rider</Popup>
                </Marker>
                <Marker
                  position={[
                    trackingData?.destination?.lat ?? -1.295,
                    trackingData?.destination?.lng ?? 36.805
                  ]}
                >
                  <Popup>Dropoff</Popup>
                </Marker>
                <Polyline
                  positions={[
                    [
                      trackingData?.seller?.lat ?? -1.286389,
                      trackingData?.seller?.lng ?? 36.817223
                    ],
                    [
                      trackingData?.driver?.lat ?? -1.29,
                      trackingData?.driver?.lng ?? 36.82
                    ],
                    [
                      trackingData?.destination?.lat ?? -1.295,
                      trackingData?.destination?.lng ?? 36.805
                    ]
                  ]}
                  pathOptions={{ color: '#7C5CFF', weight: 4, dashArray: '10, 10' }}
                />
              </MapContainer>
              <style dangerouslySetInnerHTML={{__html: `
                .leaflet-container { font-family: inherit; }
                .leaflet-popup-content-wrapper { background: #1a1026; color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; }
                .leaflet-popup-tip { background: #1a1026; }
              `}} />
            </div>

            <div className="relative flex flex-col rounded-[20px] overflow-hidden border border-white/12 bg-white/5 p-6 h-[400px]">
              <h3 className="text-lg font-bold text-white m-0 mb-1 border-b border-white/10 pb-4">Rider status (stub)</h3>
              <p className="text-white/40 text-[11px] uppercase tracking-wider mt-0 mb-6 font-bold">Channel: order:{order.id}</p>
              
              <ul className="flex flex-col gap-5 m-0 p-0 list-none flex-1 overflow-y-auto pr-2">
                <li className="flex justify-between items-center text-[15px]">
                  <span className="text-white/70">Rider assigned</span>
                  <span className={`font-bold ${trackingData?.driver ? "text-green-400" : "text-white/40"}`}>{trackingData?.driver ? "Active" : "Pending"}</span>
                </li>
                <li className="flex justify-between items-center text-[15px]">
                  <span className="text-white/70">Rider picked up</span>
                  <span className={`font-bold ${order.status === "out_for_delivery" || order.status === "delivered" || order.status === "completed" ? "text-green-400" : "text-white/40"}`}>
                    {order.status === "out_for_delivery" || order.status === "delivered" || order.status === "completed" ? "Yes" : "Pending"}
                  </span>
                </li>
                <li className="flex justify-between items-center text-[15px]">
                  <span className="text-white/70">Rider on the way</span>
                  <span className={`font-bold ${(order.status as string) !== "placed" ? "text-green-400" : "text-white/40"}`}>{(order.status as string) !== "placed" ? "Active" : "Pending"}</span>
                </li>
                <li className="flex justify-between items-center text-[15px]">
                  <span className="text-white/70">ETA</span>
                  <span className="font-bold text-white">18-25 mins</span>
                </li>
              </ul>
              
              <div className="mt-auto pt-4 border-t border-white/10">
                <p className="text-white/50 text-xs m-0 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Live location updates stream every few seconds.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="animate-in fade-in duration-500 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-white m-0">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative flex flex-col rounded-[20px] overflow-hidden border border-white/12 bg-white/5 p-6">
            <h3 className="text-lg font-bold text-white m-0 mb-3 flex items-center gap-2 border-b border-white/10 pb-3"><span className="text-xl">📍</span> Delivery</h3>
            <p className="text-white/80 font-medium m-0 mb-1">{order.checkout.deliveryLocation}</p>
            <p className="text-white/60 text-sm m-0">
              Scheduled: {order.checkout.scheduledDate} · <span className="text-white">{order.checkout.timeWindow}</span>
            </p>
          </div>
          <div className="relative flex flex-col rounded-[20px] overflow-hidden border border-white/12 bg-white/5 p-6">
            <h3 className="text-lg font-bold text-white m-0 mb-3 flex items-center gap-2 border-b border-white/10 pb-3"><span className="text-xl">💳</span> Payment</h3>
            <div className="flex justify-between items-center mb-1">
               <span className="text-white/60 text-sm">Method</span>
               <span className="text-white font-medium uppercase tracking-wider text-xs bg-white/10 px-2 py-0.5 rounded">{order.payment.method}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-white/60 text-sm">Status</span>
               <span className="text-purple-400 font-bold uppercase tracking-wider text-xs">{order.payment.status}</span>
            </div>
          </div>
          <div className="relative flex flex-col rounded-[20px] overflow-hidden border border-purple-500/30 bg-purple-500/5 p-6">
            <h3 className="text-lg font-bold text-white m-0 mb-3 flex items-center gap-2 border-b border-white/10 pb-3"><span className="text-xl">🧾</span> Total</h3>
            <div className="mt-auto flex items-end justify-between">
              <div className="flex flex-col">
                 <span className="text-white/50 text-xs uppercase tracking-widest font-bold mb-1">Amount Due</span>
                 <p className="text-4xl font-extrabold text-white m-0 tracking-tight">KES {order.total.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
