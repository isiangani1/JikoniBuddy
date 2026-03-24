"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sellers } from "@/data/sellers";
import { getOrder, getOrderReview, submitReview } from "@/data/buyerStorage";

export default function BuyerOrderReviewPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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

  const existing = useMemo(() => getOrderReview(params.id), [params.id]);

  useEffect(() => {
    if (existing) {
      setRating(existing.rating);
      setComment(existing.comment);
    }
  }, [existing]);

  if (!order) {
    return (
      <>
        <main className="category-page">
          <section className="section fade-in">
            <h2>Review not available</h2>
            <p className="muted">Order not found.</p>
            <Link className="primary" href="/buyer">
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
        <main className="category-page">
          <section className="section fade-in">
            <h2>Review locked</h2>
            <p className="muted">You can only review after an order is completed.</p>
            <Link className="primary" href={`/buyer/orders/${order.id}`}>
              Back to tracking
            </Link>
          </section>
        </main>
      </>
    );
  }

  const handleSubmit = () => {
    submitReview({
      sellerId: order.sellerId,
      orderId: order.id,
      rating,
      comment
    });
    router.push(`/buyer/sellers/${order.sellerId}`);
  };

  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Review</p>
            <h1>Rate your order</h1>
            <p className="subhead">
              {seller ? (
                <>Seller: {seller.name}</>
              ) : (
                <>Seller: {order.sellerId}</>
              )}
            </p>
            <div className="hero-actions">
              <Link className="badge" href={`/buyer/orders/${order.id}`}>
                Back to tracking
              </Link>
            </div>
          </div>
          <div className="category-hero-card">
            <h3>Order #{order.id}</h3>
            <p className="muted">Completed</p>
            {existing ? <p className="muted">You already submitted a review.</p> : null}
          </div>
        </section>

        <section className="section fade-in">
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
            <button className="primary" type="button" onClick={handleSubmit}>
              Submit review
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
