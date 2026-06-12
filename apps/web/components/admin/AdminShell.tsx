"use client";

import { useState } from "react";
import PortalHeader from "@/components/PortalHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminQuickActions from "@/components/admin/AdminQuickActions";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d0a14] text-white">
      <div className="pointer-events-none absolute -top-24 right-[-120px] h-80 w-80 rounded-full bg-[#7C5CFF]/20 blur-[120px]" />
      <div className="pointer-events-none absolute left-[-120px] top-1/3 h-96 w-96 rounded-full bg-[#2dd4bf]/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-120px] right-1/4 h-72 w-72 rounded-full bg-[#F7C948]/10 blur-[120px]" />

      <PortalHeader portalName="Admin Portal" onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />

      <div className="relative flex">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 min-w-0 pb-10 pt-6 pl-4 pr-0 sm:pl-6 sm:pr-0 lg:pl-10 lg:pr-0">
          <div className="flex w-full flex-col gap-8 xl:flex-row xl:items-start">
            <div className="min-w-0 flex-1">{children}</div>
            <aside className="w-full shrink-0 xl:w-[360px] xl:pr-0">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_24px_70px_rgba(4,2,10,0.35)] backdrop-blur-xl xl:mr-0">
                  <AdminQuickActions />
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
