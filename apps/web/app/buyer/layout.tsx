"use client";

import { useState } from "react";
import Link from "next/link";
import PortalGuard from "@/components/PortalGuard";

export default function BuyerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);

  return (
    <>
      <PortalGuard role="buyer">
        <div className="buyer-shell">
          <header className="buyer-header glass-header">
            <Link className="logo" href="/">
              Jikoni Buddy
            </Link>
            <div className="buyer-header-title">
              <button 
                className="icon-button hide-mobile" 
                onClick={() => setIsSidebarToggled(!isSidebarToggled)}
                style={{ marginRight: '1rem', background: 'transparent', border: 'none' }}
              >
                ☰
              </button>
              <h2>Buyer Portal</h2>
            </div>
            <div className="buyer-header-actions">
              <Link className="ghost hide-mobile" href="/buyer/orders">
                Orders
              </Link>
              <Link className="ghost hide-mobile" href="/buyer/account">
                Account
              </Link>
              <button className="icon-button show-mobile">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </button>
            </div>
          </header>

          <div className={`buyer-body ${isSidebarToggled ? "collapsed" : ""}`}>
            <aside className="buyer-sidebar hide-mobile">
              <nav className="sidebar-section">
                <Link className="sidebar-link active" href="/buyer">
                  Home
                </Link>
                <Link className="sidebar-link" href="/buyer/sellers?category=meal-prep">
                  Meal Prep
                </Link>
                <Link className="sidebar-link" href="/buyer/sellers?category=office-bites">
                  Office Bites
                </Link>
                <Link className="sidebar-link" href="/buyer/sellers?category=picnic-snacks">
                  Picnic Snacks
                </Link>
                <Link className="sidebar-link" href="/buyer/sellers?category=catering">
                  Catering
                </Link>
                <Link className="sidebar-link" href="/buyer/sellers?category=groceries">
                  Groceries
                </Link>
                <Link className="sidebar-link" href="/buyer/sellers?category=convenience">
                  Convenience
                </Link>
                <Link className="sidebar-link" href="/buyer/sellers?category=alcohol">
                  Alcohol
                </Link>
              </nav>
            </aside>
            <div className="buyer-content">{children}</div>
          </div>
          
          <nav className="buyer-bottom-nav show-mobile glass-nav">
            <Link href="/buyer" className="bottom-nav-item active">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span>Home</span>
            </Link>
            <Link href="/buyer/search" className="bottom-nav-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Search</span>
            </Link>
            <Link href="/buyer/orders" className="bottom-nav-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span>Orders</span>
            </Link>
            <Link href="/buyer/account" className="bottom-nav-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Account</span>
            </Link>
          </nav>
          
          <div className="floating-cart-wrapper hide-mobile">
            <button className="floating-cart-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span className="cart-badge">0</span>
              <span className="cart-total">KES 0</span>
              <span style={{marginLeft: '4px'}}>checkout</span>
            </button>
          </div>
        </div>
      </PortalGuard>
    </>
  );
}
