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
        <div className="min-h-screen grid grid-rows-[auto_1fr] bg-[#0d0717]">
          <header className="sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto] items-center gap-6 px-4 md:px-[6vw] py-3 md:py-5 border-b border-white/10 bg-[#12021f]/85 backdrop-blur-[20px]">
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
              <Link className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors" href="/buyer/account">
                Account
              </Link>
              <button className="md:hidden inline-flex items-center justify-center p-2 rounded-full border border-white/10 bg-[#0f081a]/60 text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </button>
            </div>
          </header>

          <div className={`grid md:grid-cols-[240px_minmax(0,1fr)] gap-0 pb-12 min-h-[calc(100vh-72px)] ${isSidebarToggled ? "grid-cols-[240px_minmax(0,1fr)]" : "grid-cols-1"}`}>
            <aside className={`${isSidebarToggled ? 'block' : 'hidden md:flex'} sticky top-[72px] h-[calc(100vh-72px)] flex-col gap-4 bg-[#0c0612]/95 border-r border-white/10 p-6 z-20`}>
              <nav className="grid gap-2.5">
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-purple-500/50 bg-purple-500/15 text-[#f2e9ff] transition-colors" href="/buyer">
                  Home
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#0f081a]/60 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=meal-prep">
                  Meal Prep
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#0f081a]/60 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=office-bites">
                  Office Bites
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#0f081a]/60 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=picnic-snacks">
                  Picnic Snacks
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#0f081a]/60 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=catering">
                  Catering
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#0f081a]/60 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=groceries">
                  Groceries
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#0f081a]/60 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=convenience">
                  Convenience
                </Link>
                <Link className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent bg-[#0f081a]/60 text-white/85 hover:border-purple-500/35 hover:bg-purple-500/10 transition-colors" href="/buyer/sellers?category=alcohol">
                  Alcohol
                </Link>
              </nav>
            </aside>
            <div className="px-4 py-6 md:px-8 md:py-6 md:pb-12 min-w-0">{children}</div>
          </div>
          
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-[#12021f]/85 backdrop-blur-[20px] border-t border-white/10 pb-[env(safe-area-inset-bottom)] pt-2 h-16">
            <Link href="/buyer" className="flex flex-col items-center gap-1 text-purple-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link href="/buyer/search" className="flex flex-col items-center gap-1 text-white/60 hover:text-purple-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span className="text-[10px] font-medium">Search</span>
            </Link>
            <Link href="/buyer/orders" className="flex flex-col items-center gap-1 text-white/60 hover:text-purple-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span className="text-[10px] font-medium">Orders</span>
            </Link>
            <Link href="/buyer/account" className="flex flex-col items-center gap-1 text-white/60 hover:text-purple-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span className="text-[10px] font-medium">Account</span>
            </Link>
          </nav>
          
          <div className="hidden md:flex fixed bottom-6 right-6 z-40">
            <button className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 rounded-full shadow-2xl transition-transform hover:-translate-y-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span className="flex items-center justify-center bg-white text-purple-900 font-bold text-xs h-5 w-5 rounded-full">0</span>
              <span className="font-semibold">KES 0</span>
              <span className="ml-1 text-sm uppercase tracking-wider opacity-80">checkout</span>
            </button>
          </div>
        </div>
      </PortalGuard>
    </>
  );
}
