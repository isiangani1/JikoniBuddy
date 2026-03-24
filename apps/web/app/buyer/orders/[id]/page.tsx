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
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
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
      process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL ?? "http://localhost:4005";
    const socket = io(socketUrl);
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
      <>
        <main className="category-page">
          <section className="section fade-in">
            <h2>Order not found</h2>
            <p className="muted">Please return to the Buyer portal.</p>
            <Link className="primary" href="/buyer">
              Back to buyer
            </Link>
          </section>
        </main>
      </>
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
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Order tracking</p>
            <h1>Order #{order.id}</h1>
            <p className="subhead">
              {seller ? (
                <>Seller: {seller.name}</>
              ) : (
                <>Seller: {order.sellerId}</>
              )}
            </p>
            <div className="hero-actions">
              <Link className="badge" href={`/buyer/orders/${order.id}/chat`}>
                Chat
              </Link>
              <Link className="badge" href={`/buyer/orders/${order.id}/receipt`}>
                Receipt
              </Link>
              {order.status === "completed" ? (
                <Link className="badge" href={`/buyer/orders/${order.id}/review`}>
                  {existingReview ? "View review" : "Leave review"}
                </Link>
              ) : null}
              <Link className="badge" href={`/buyer/support?orderId=${order.id}`}>
                Support
              </Link>
              <Link className="badge" href={`/buyer/orders/${order.id}/refund`}>
                {existingRefund ? `Refund: ${existingRefund.status}` : "Request refund"}
              </Link>
              <Link className="badge" href="/buyer">
                Back to browse
              </Link>
            </div>
          </div>

          <div className="category-hero-card">
            <h3>Status</h3>
            <p className="muted">{statusLabels[order.status]}</p>
            <div className="hero-actions">
              <button className="ghost" type="button" onClick={rewindStatus}>
                Previous
              </button>
              <button className="primary" type="button" onClick={bumpStatus}>
                Next
              </button>
            </div>
            <p className="muted">
              This status progression is a stub for Pusher events + REST replay.
            </p>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Timeline</h2>
          <div className="category-grid">
            {statusOrder.map((status, index) => {
              const isDone = index <= currentIndex;
              return (
                <div key={status} className="category-card">
                  <h3>{statusLabels[status]}</h3>
                  <p className="muted">{isDone ? "Done" : "Pending"}</p>
                </div>
              );
            })}
          </div>
        </section>

        {order.status === "out_for_delivery" || order.status === "delivered" || order.status === "completed" ? (
          <section className="section fade-in">
            <h2>Delivery tracking</h2>
            <div className="category-grid">
              <div className="category-card">
                <h3>Live map</h3>
                <div style={{ height: 240, borderRadius: 16, overflow: "hidden" }}>
                  <MapContainer
                    center={[
                      trackingData?.driver?.lat ?? -1.29,
                      trackingData?.driver?.lng ?? 36.82
                    ]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
                      color="#7C5CFF"
                    />
                  </MapContainer>
                </div>
              </div>

              <div className="category-card">
                <h3>Rider status (stub)</h3>
                <p className="muted">Channel: order:{order.id}</p>
                <ul>
                  <li>
                    <p>Rider assigned: {trackingData?.driver ? "Active" : "Pending"}</p>
                  </li>
                  <li>
                    <p>Rider picked up: {order.status === "out_for_delivery" ? "Yes" : "Pending"}</p>
                  </li>
                  <li>
                    <p>Rider on the way: {order.status !== "placed" ? "Active" : "Pending"}</p>
                  </li>
                  <li>
                    <p>ETA: 18-25 mins</p>
                  </li>
                </ul>
                <p className="muted">Live location updates stream every few seconds.</p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="section fade-in">
          <h2>Summary</h2>
          <div className="category-grid">
            <div className="category-card">
              <h3>Delivery</h3>
              <p className="muted">{order.checkout.deliveryLocation}</p>
              <p className="muted">
                Scheduled: {order.checkout.scheduledDate} · {order.checkout.timeWindow}
              </p>
            </div>
            <div className="category-card">
              <h3>Payment</h3>
              <p className="muted">Method: {order.payment.method}</p>
              <p className="muted">Status: {order.payment.status}</p>
            </div>
            <div className="category-card">
              <h3>Total</h3>
              <p className="muted">KES {order.total.toFixed(0)}</p>
              <p className="muted">Payment: {order.checkout.paymentMethod}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
