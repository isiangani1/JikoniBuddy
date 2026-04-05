"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PortalGuard from "@/components/PortalGuard";
import { loadBuyerState } from "@/data/buyerStorage";
import CartDrawer from "@/components/CartDrawer";

export default function BuyerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [userName, setUserName] = useState("Account");
  const router = useRouter();

  useEffect(() => {
    const refreshCart = () => {
      const { cart } = loadBuyerState();
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.qty, 0));
      setCartTotal(cart.reduce((sum: number, item: any) => sum + item.price * item.qty, 0));
    };

    refreshCart();
    window.addEventListener("cart-updated", refreshCart);
    return () => window.removeEventListener("cart-updated", refreshCart);
  }, []);

  useEffect(() => {
    const storedName = sessionStorage.getItem("jb_user_name");
    const storedRole = sessionStorage.getItem("jb_role");
    if (storedName) setUserName(storedName);
    else if (storedRole) setUserName(storedRole.charAt(0).toUpperCase() + storedRole.slice(1));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("jb_auth");
    sessionStorage.removeItem("jb_role");
    sessionStorage.removeItem("jb_user_name");
    sessionStorage.removeItem("jb_user_id");
    localStorage.removeItem("jb_auth");
    localStorage.removeItem("jb_role");
    localStorage.removeItem("jb_user_name");
    localStorage.removeItem("jb_user_id");
    router.push("/");
  };

  return (
    <>
      <PortalGuard role="buyer" allowGuest>
        <div className="relative min-h-screen grid grid-rows-[auto_1fr] text-white overflow-hidden">
          <div className="pointer-events-none absolute -top-24 right-[-120px] h-72 w-72 rounded-full bg-purple-600/20 blur-[100px] animate-pulse" />
          <div className="pointer-events-none absolute left-[-120px] top-1/3 h-80 w-80 rounded-full bg-teal-500/10 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-[-140px] right-1/4 h-80 w-80 rounded-full bg-amber-400/10 blur-[100px]" />

          <header className="sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto] items-center gap-6 px-4 md:px-[6vw] py-3 md:py-5 border-b border-white/10 bg-[#120c1c]/85 backdrop-blur-[20px]">
            <Link className="text-xl font-bold" href="/">
              Jikoni Buddy
            </Link>
            <div className="flex items-center gap-4">
              <button 
                className="md:hidden inline-flex items-center justify-center p-2 bg-transparent text-white border-none" 
                onClick={() => setIsSidebarToggled(!isSidebarToggled)}
              >
                ☰
              </button>
              <h2 className="m-0 mt-1 text-lg font-semibold">Buyer Portal</h2>
            </div>
            <div className="flex items-center gap-3 md:justify-end">
              <Link className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors" href="/buyer/orders">
                Orders
              </Link>
              <div className="relative hidden md:flex items-center">
                <button
                  onClick={() => setIsAccountOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/90 transition hover:border-white/40"
                  type="button"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-teal-400/60 bg-teal-500/20 text-xs font-bold text-white">
                    {userName
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean)
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "U"}
                  </span>
                  <span className="hidden lg:inline">{userName}</span>
                </button>
                {isAccountOpen ? (
                  <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-white/10 bg-[#1a0f2d]/95 p-2 text-sm text-white shadow-[0_20px_60px_rgba(8,3,18,0.45)]">
                    <Link
                      href="/buyer/account"
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Account
                    </Link>
                    <Link
                      href="/buyer/orders"
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      href="/buyer/payments"
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Payments
                    </Link>
                    <Link
                      href="/buyer/support"
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Support
                    </Link>
                    <button
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                      type="button"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-full border border-white/10 bg-[#120c1c]/70 text-white relative"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2dd4bf] text-[10px] font-bold text-[#0d0a14]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </header>

          <div className={`grid md:grid-cols-[240px_minmax(0,1fr)] gap-0 pb-12 min-h-[calc(100vh-72px)] ${isSidebarToggled ? "grid-cols-[240px_minmax(0,1fr)]" : "grid-cols-1"}`}>
            <aside className={`${isSidebarToggled ? 'block' : 'hidden md:flex'} sticky top-[72px] h-[calc(100vh-72px)] flex-col gap-4 bg-[#120c1c]/85 border-r border-white/10 p-6 z-20 backdrop-blur-2xl`}>
              <nav className="grid gap-2.5">
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-teal-500/50 bg-teal-500/15 text-[#eafff9] transition-colors" href="/buyer">
                  Home
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#120c1c]/70 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=meal-prep">
                  Meal Prep
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#120c1c]/70 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=office-bites">
                  Office Bites
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#120c1c]/70 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=picnic-snacks">
                  Picnic Snacks
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#120c1c]/70 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=catering">
                  Catering
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#120c1c]/70 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=groceries">
                  Groceries
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#120c1c]/70 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=convenience">
                  Convenience
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#120c1c]/70 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=alcohol">
                  Alcohol
                </Link>
              </nav>
            </aside>
            <div className="px-4 py-6 md:px-8 md:py-6 md:pb-12 min-w-0">{children}</div>
          </div>
          
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-[#120c1c]/85 backdrop-blur-[20px] border-t border-white/10 pb-[env(safe-area-inset-bottom)] pt-2 h-16">
            <Link href="/buyer" className="flex flex-col items-center gap-1 text-teal-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link href="/buyer/search" className="flex flex-col items-center gap-1 text-white/60 hover:text-teal-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span className="text-[10px] font-medium">Search</span>
            </Link>
            <Link href="/buyer/orders" className="flex flex-col items-center gap-1 text-white/60 hover:text-teal-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span className="text-[10px] font-medium">Orders</span>
            </Link>
            <Link href="/buyer/account" className="flex flex-col items-center gap-1 text-white/60 hover:text-teal-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span className="text-[10px] font-medium">Account</span>
            </Link>
          </nav>
          
          <div className="hidden md:flex fixed bottom-6 right-6 z-40">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 bg-[#2dd4bf] hover:opacity-90 text-[#0d0a14] px-5 py-3 rounded-full shadow-2xl transition-transform hover:-translate-y-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span className="flex items-center justify-center bg-white text-[#0d0a14] font-bold text-xs h-5 w-5 rounded-full">{cartCount}</span>
              <span className="font-semibold">KES {cartTotal}</span>
              <span className="ml-1 text-sm uppercase tracking-wider opacity-80">checkout</span>
            </button>
          </div>

          <CartDrawer 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />
        </div>
      </PortalGuard>
    </>
  );
}
