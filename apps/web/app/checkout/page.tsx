"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <>
      <SiteHeader />
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Checkout</p>
            <h1>Confirm your order and payment.</h1>
            <p className="subhead">
              Checkout is available only for logged-in users.
            </p>
          </div>
          <div className="category-hero-card">
            <h3>Payment Options</h3>
            <ul>
              <li>M-Pesa STK Push</li>
              <li>Pay on delivery</li>
            </ul>
            <button className="primary full">Proceed with Payment</button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
