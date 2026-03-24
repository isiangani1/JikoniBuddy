"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBanner from "@/components/NotificationBanner";

export default function SiteHeader() {
  const router = useRouter();
  const [auth, setAuth] = useState<{ isLoggedIn: boolean; role: string; userName: string; initials: string }>(() => ({
    isLoggedIn: false,
    role: "buyer",
    userName: "Account",
    initials: "U"
  }));

  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem("jb_auth") === "true";
      const role = localStorage.getItem("jb_role") ?? "buyer";
      
      const storedName = localStorage.getItem("jb_user_name");
      const userName = storedName || (role.charAt(0).toUpperCase() + role.slice(1));
      const initials = userName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      setAuth({ isLoggedIn, role, userName, initials });
    } catch {
      setAuth({ isLoggedIn: false, role: "buyer", userName: "Account", initials: "U" });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jb_auth");
    localStorage.removeItem("jb_role");
    localStorage.removeItem("jb_helper_id");
    router.push("/");
  };

  return (
    <>
      <NotificationBanner />
      <header className="top-nav">
        <Link className="logo" href="/">
          Jikoni Buddy
        </Link>
        <div className="nav-search">
          <input
            type="search"
            placeholder="Search meals, chefs, or services..."
            aria-label="Search meals, chefs, or services"
          />
        </div>
        <nav className="nav-links">
          <div className="nav-dropdown">
            <button className="nav-link" type="button">
              Browse
            </button>
            <div className="dropdown-panel">
              <Link href="/meal-prep" className="dropdown-item">
                Meal Prep
              </Link>
              <Link href="/office-bites" className="dropdown-item">
                Office Bites
              </Link>
              <Link href="/picnic-snacks" className="dropdown-item">
                Picnic Snacks
              </Link>
              <Link href="/catering" className="dropdown-item">
                Catering
              </Link>
              <Link href="/near-me" className="dropdown-item">
                Near Me
              </Link>
              <Link href="/top-rated" className="dropdown-item">
                Top Rated
              </Link>
              <Link href="/available-now" className="dropdown-item">
                Available Now
              </Link>
            </div>
          </div>
          <Link className="nav-link" href="/seller">
            Become a Seller
          </Link>
          <div className="nav-dropdown">
            <button className="nav-link" type="button">
              Help
            </button>
            <div className="dropdown-panel">
              <Link href="/how-it-works" className="dropdown-item">
                How it Works
              </Link>
              <Link href="/faqs" className="dropdown-item">
                FAQs
              </Link>
              <Link href="/contact-support" className="dropdown-item">
                Contact Support
              </Link>
              <Link href="/disputes-refunds" className="dropdown-item">
                Disputes & Refunds
              </Link>
            </div>
          </div>
        </nav>
        <div className="nav-actions">
          {auth.isLoggedIn ? (
            <div className="nav-dropdown">
              <button className="nav-link" type="button">
                <span className="user-avatar">{auth.initials}</span>
                <span>{auth.userName}</span>
              </button>
              <div className="dropdown-panel">
                {auth.role === "buyer" ? (
                  <>
                    <Link href="/buyer" className="dropdown-item">Dashboard</Link>
                    <Link href="/buyer/account" className="dropdown-item">Settings</Link>
                    <Link href="/buyer/cart" className="dropdown-item">My Cart</Link>
                    <Link href="/buyer/orders" className="dropdown-item">Previous Orders</Link>
                  </>
                ) : auth.role === "buddy" ? (
                  <>
                    <Link href="/buddy-portal/dashboard" className="dropdown-item">Portal</Link>
                  </>
                ) : (
                  <>
                    <Link href={`/${auth.role}`} className="dropdown-item">{auth.role.charAt(0).toUpperCase() + auth.role.slice(1)} Dashboard</Link>
                  </>
                )}
                <button className="dropdown-item" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link className="nav-link" href="/login">
                Login
              </Link>
              <Link className="nav-cta" href="/register">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
}
