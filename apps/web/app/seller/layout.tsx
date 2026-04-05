"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PortalHeader from "@/components/PortalHeader";
import SiteFooter from "@/components/SiteFooter";
import PortalGuard from "@/components/PortalGuard";
import SellerSOSButton from "@/components/SellerSOSButton";
import QueryProvider from "@/lib/QueryProvider";
import { io, Socket } from "socket.io-client";

export default function SellerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);
  const pathname = usePathname();
  const [liveToasts, setLiveToasts] = useState<
    { id: string; title: string; message: string }[]
  >([]);

  useEffect(() => {
    const userId =
      sessionStorage.getItem("jb_user_id") ||
      sessionStorage.getItem("jb_seller_id") ||
      localStorage.getItem("jb_session");
    if (!userId) return;

    const baseUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const socket: Socket = io(`${baseUrl}/ws/notification`, {
      query: { userId },
      transports: ["websocket"]
    });

    socket.on("notification", (payload: any) => {
      const item = {
        id: payload?.id ?? `${Date.now()}`,
        title: payload?.title ?? "Notification",
        message: payload?.message ?? ""
      };
      setLiveToasts((prev) => [item, ...prev].slice(0, 3));
      setTimeout(() => {
        setLiveToasts((prev) => prev.filter((toast) => toast.id !== item.id));
      }, 6000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
          <div className="relative min-h-screen flex flex-col text-white overflow-hidden">
            <div className="pointer-events-none absolute -top-24 right-[-120px] h-72 w-72 rounded-full bg-purple-600/20 blur-[100px] animate-pulse" />
            <div className="pointer-events-none absolute left-[-120px] top-1/3 h-80 w-80 rounded-full bg-teal-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute bottom-[-140px] right-1/4 h-80 w-80 rounded-full bg-amber-400/10 blur-[100px]" />

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
               <aside className={`fixed inset-y-0 left-0 z-40 w-[240px] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarToggled ? "translate-x-0" : "-translate-x-full"} bg-[#120c1c]/85 backdrop-blur-2xl border-r border-white/10 py-6 px-4 flex flex-col h-[calc(100vh-64px)] top-[64px] md:top-0 md:h-[calc(100vh-73px)] md:sticky shrink-0`}>
                  <div className="text-xs uppercase tracking-[0.12em] text-white/60 mb-6 font-semibold px-2">Seller Navigation</div>
                  <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 scrollbar-thin">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center px-3 py-2.5 rounded-xl border border-transparent font-medium transition-colors ${pathname === item.href ? 'bg-purple-500/15 border border-purple-500/50 text-[#f2e9ff]' : 'bg-[#120c1c]/70 text-white/85 hover:bg-purple-500/10 hover:border-purple-500/35'}`}
                        onClick={() => setIsSidebarToggled(false)}
                      >
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    ))}
                  </div>
               </aside>
               <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 lg:pb-12 h-[calc(100vh-64px)] md:h-[calc(100vh-73px)] overflow-y-auto relative">
                 {liveToasts.length > 0 ? (
                   <div className="absolute right-4 top-4 z-40 flex w-[min(320px,85vw)] flex-col gap-3">
                     {liveToasts.map((toast) => (
                       <div
                         key={toast.id}
                         className="rounded-2xl border border-white/10 bg-[#120c1c]/95 p-4 shadow-[0_24px_60px_rgba(20,6,40,0.35)]"
                       >
                         <p className="m-0 text-sm font-semibold text-white">{toast.title}</p>
                         <p className="m-0 mt-1 text-xs text-white/60">{toast.message}</p>
                       </div>
                     ))}
                   </div>
                 ) : null}
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
