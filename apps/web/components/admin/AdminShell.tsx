"use client";

import { useState } from "react";
import PortalHeader from "@/components/PortalHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminQuickActions from "@/components/admin/AdminQuickActions";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0613] text-white">
      <PortalHeader portalName="Admin Portal" onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 min-w-0 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:flex-row">
            <div className="flex-1 min-w-0">{children}</div>
            <div className="w-full lg:w-[320px] shrink-0">
              <div className="sticky top-24">
                <AdminQuickActions />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
