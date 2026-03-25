"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import NotificationBanner from "@/components/NotificationBanner";

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [auth, setAuth] = useState<{ isLoggedIn: boolean; role: string; userName: string; initials: string }>(() => ({
    isLoggedIn: false,
    role: "buyer",
    userName: "Account",
    initials: "U"
  }));

  useEffect(() => {
    try {
      if (pathname === "/") {
        setAuth({ isLoggedIn: false, role: "buyer", userName: "Account", initials: "U" });
        return;
      }
      const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
      const role = sessionStorage.getItem("jb_role") ?? "buyer";
      
      const storedName = sessionStorage.getItem("jb_user_name");
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
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("jb_auth");
    sessionStorage.removeItem("jb_role");
    sessionStorage.removeItem("jb_user_name");
    sessionStorage.removeItem("jb_helper_id");
    localStorage.removeItem("jb_auth");
    localStorage.removeItem("jb_role");
    localStorage.removeItem("jb_user_name");
    localStorage.removeItem("jb_helper_id");
    router.push("/");
  };

  return (
    <>
      <NotificationBanner />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#120c1c]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link className="text-lg font-semibold tracking-tight text-white" href="/">
            Jikoni Buddy
          </Link>
          <div className="hidden flex-1 md:block">
            <input
              type="search"
              placeholder="Search meals, chefs, or services..."
              aria-label="Search meals, chefs, or services"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/50 focus:border-white/30 focus:outline-none"
            />
          </div>
          <nav className="hidden items-center gap-5 text-sm font-medium text-white/80 md:flex">
            <div className="group relative">
              <button className="transition hover:text-white" type="button">
                Browse
              </button>
              <div className="pointer-events-none absolute left-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#1a1026] p-2 opacity-0 shadow-xl transition group-hover:pointer-events-auto group-hover:opacity-100">
                <Link href="/meal-prep" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                  Meal Prep
                </Link>
                <Link href="/office-bites" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                  Office Bites
                </Link>
                <Link href="/picnic-snacks" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                  Picnic Snacks
                </Link>
                <Link href="/catering" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                  Catering
                </Link>
                <Link href="/near-me" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                  Near Me
                </Link>
                <Link href="/top-rated" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                  Top Rated
                </Link>
                <Link href="/available-now" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                  Available Now
                </Link>
              </div>
            </div>
            <Link className="transition hover:text-white" href="/seller">
              Become a Seller
            </Link>
            <div className="group relative">
              <button className="transition hover:text-white" type="button">
                Help
              </button>
              <div className="pointer-events-none absolute left-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#1a1026] p-2 opacity-0 shadow-xl transition group-hover:pointer-events-auto group-hover:opacity-100">
                <Link href="/how-it-works" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                  How it Works
                </Link>
                <Link href="/faqs" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                  FAQs
                </Link>
                <Link href="/contact-support" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                  Contact Support
                </Link>
                <Link href="/disputes-refunds" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                  Disputes & Refunds
                </Link>
              </div>
            </div>
          </nav>
          <div className="ml-auto flex items-center gap-3">
          {auth.isLoggedIn ? (
            <div className="group relative">
              <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2dd4bf]/20 text-xs font-semibold text-[#2dd4bf]">
                  {auth.initials}
                </span>
                <span className="hidden sm:inline">{auth.userName}</span>
              </button>
              <div className="pointer-events-none absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#1a1026] p-2 opacity-0 shadow-xl transition group-hover:pointer-events-auto group-hover:opacity-100">
                {auth.role === "buyer" ? (
                  <>
                    <Link href="/buyer" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">Dashboard</Link>
                    <Link href="/buyer/account" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">Settings</Link>
                    <Link href="/buyer/cart" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">My Cart</Link>
                    <Link href="/buyer/orders" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">Previous Orders</Link>
                  </>
                ) : auth.role === "buddy" ? (
                  <>
                    <Link href="/buddy-portal/dashboard" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">Portal</Link>
                  </>
                ) : (
                  <>
                    <Link href={`/${auth.role}`} className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">{auth.role.charAt(0).toUpperCase() + auth.role.slice(1)} Dashboard</Link>
                  </>
                )}
                <button className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link className="text-sm text-white/70 transition hover:text-white" href="/login">
                Login
              </Link>
              <Link className="rounded-full bg-[#2dd4bf] px-4 py-2 text-sm font-semibold text-[#0d0a14] transition hover:opacity-90" href="/register">
                Sign Up
              </Link>
            </>
          )}
          </div>
        </div>
      </header>
    </>
  );
}
