"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PortalHeader from "@/components/PortalHeader";
import SiteFooter from "@/components/SiteFooter";
import PortalGuard from "@/components/PortalGuard";
import SellerSOSButton from "@/components/SellerSOSButton";
import QueryProvider from "@/lib/QueryProvider";

export default function SellerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/seller" },
    { label: "Orders Queue", href: "/seller/orders" },
    { label: "Menu", href: "/seller/menu" },
    { label: "Buddy Pool", href: "/seller/buddy-pool" },
    { label: "Analytics", href: "/seller/analytics" },
    { label: "Reviews", href: "/seller/reviews" },
    { label: "Financials", href: "/seller/financials" },
    { label: "Profile", href: "/seller/profile" },
    { label: "Support", href: "/seller/support" },
    { label: "Settings", href: "/seller/capacity" }
  ];

  return (
    <>
      <PortalGuard role="seller">
        <QueryProvider>
          <div className="min-h-screen flex flex-col bg-[#0c0612] text-white">
            <PortalHeader 
              portalName="Seller Portal" 
              onToggleSidebar={() => setIsSidebarToggled(!isSidebarToggled)}
            />
            
            {/* Overlay for mobile sidebar */}
            {isSidebarToggled && (
              <div 
                className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
                onClick={() => setIsSidebarToggled(false)}
              />
            )}

            <div className="flex-1 flex flex-col md:flex-row relative">
               <aside className={`fixed inset-y-0 left-0 z-40 w-[240px] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarToggled ? "translate-x-0" : "-translate-x-full"} bg-[#0c0612]/95 backdrop-blur-xl border-r border-white/10 py-6 px-4 flex flex-col h-[calc(100vh-64px)] top-[64px] md:top-0 md:h-[calc(100vh-73px)] md:sticky shrink-0`}>
                  <div className="text-xs uppercase tracking-[0.12em] text-white/60 mb-6 font-semibold px-2">Seller Navigation</div>
                  <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 scrollbar-thin">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center px-3 py-2.5 rounded-xl border border-transparent font-medium transition-colors ${pathname === item.href ? 'bg-purple-500/15 border border-purple-500/50 text-[#f2e9ff]' : 'bg-[#0f081a]/60 text-white/85 hover:bg-purple-500/10 hover:border-purple-500/35'}`}
                        onClick={() => setIsSidebarToggled(false)}
                      >
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    ))}
                  </div>
               </aside>
               <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 lg:pb-12 h-[calc(100vh-64px)] md:h-[calc(100vh-73px)] overflow-y-auto">
                 {children}
               </main>
            </div>
            <SellerSOSButton />
            <SiteFooter />
          </div>
        </QueryProvider>
      </PortalGuard>
    </>
  );
}
