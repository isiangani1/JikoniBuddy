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
          <div className="seller-shell">
            <PortalHeader 
              portalName="Seller Portal" 
              onToggleSidebar={() => setIsSidebarToggled(!isSidebarToggled)}
            />
            <div className={`seller-body ${isSidebarToggled ? "collapsed" : ""}`}>
               <aside className={`seller-sidebar ${isSidebarToggled ? "open" : ""}`}>
                  <div className="sidebar-title">Seller Navigation</div>
                  <div className="sidebar-section">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
                      >
                        <span className="nav-text">{item.label}</span>
                      </Link>
                    ))}
                  </div>
               </aside>
               <main className="seller-content">
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
