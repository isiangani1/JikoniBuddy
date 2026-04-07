"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sellers } from "@/data/sellers";
import { getOrder } from "@/data/buyerStorage";
import { gatewayFetchJson } from "@/lib/gateway";

type ReviewRow = {
  id: string;
  sellerId: string;
  orderId: string;
  buyerId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export default function BuyerOrderReviewPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [existing, setExisting] = useState<ReviewRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (!order) return;
    let isMounted = true;
    gatewayFetchJson<ReviewRow[]>(
      `/api/review/reviews?orderId=${encodeURIComponent(order.id)}`
    )
      .then((rows) => {
        if (!isMounted) return;
        const row = rows[0] ?? null;
        setExisting(row);
        if (row) {
          setRating(row.rating);
          setComment(row.comment ?? "");
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setExisting(null);
      });
    return () => {
      isMounted = false;
    };
  }, [order]);

  if (!order) {
    return (
      <>
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
          <section className="flex flex-col gap-6 animate-in fade-in duration-500">
            <h2>Review not available</h2>
            <p className="text-white/50 text-sm">Order not found.</p>
            <Link className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" href="/buyer">
              Back to buyer
            </Link>
          </section>
        </main>
      </>
    );
  }

  if (order.status !== "completed") {
    return (
      <>
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
          <section className="flex flex-col gap-6 animate-in fade-in duration-500">
            <h2>Review locked</h2>
            <p className="text-white/50 text-sm">You can only review after an order is completed.</p>
            <Link className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" href={`/buyer/orders/${order.id}`}>
              Back to tracking
            </Link>
          </section>
        </main>
      </>
    );
  }

  const handleSubmit = async () => {
    if (!order) return;
    const buyerId =
      sessionStorage.getItem("jb_user_id") ??
      sessionStorage.getItem("jb_buyer_id") ??
      "";
    if (!buyerId) {
      alert("Please log in to submit a review.");
      router.replace("/login");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = await gatewayFetchJson<ReviewRow>("/api/review/reviews", {
        method: "POST",
        body: JSON.stringify({
          sellerId: order.sellerId,
          orderId: order.id,
          buyerId,
          rating,
          comment
        })
      });
      setExisting(payload);
      router.push(`/buyer/sellers/${order.sellerId}`);
    } catch (error) {
      console.error(error);
      alert("Could not submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Review</p>
            <h1>Rate your order</h1>
            <p className="text-white/70 m-0 text-lg">
              {seller ? (
                <>Seller: {seller.name}</>
              ) : (
                <>Seller: {order.sellerId}</>
              )}
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href={`/buyer/orders/${order.id}`}>
                Back to tracking
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>Order #{order.id}</h3>
            <p className="text-white/50 text-sm">Completed</p>
            {existing ? <p className="text-white/50 text-sm">You already submitted a review.</p> : null}
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Your rating</h2>
          <div className="form">
            <label className="field">
              <span>Stars (1-5)</span>
              <select
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Okay</option>
                <option value={2}>2 - Bad</option>
                <option value={1}>1 - Terrible</option>
              </select>
            </label>
            <label className="field">
              <span>Comment</span>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="What went well? What could be improved?"
              />
            </label>
            <button
              className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-70"
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit review"}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
