"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

export type AdminRole = "ops" | "finance" | "support" | "content" | "super";

type NavItem = {
  label: string;
  href: string;
  roles: AdminRole[];
  pulse?: "teal" | "violet" | "gold" | "rose";
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/admin", roles: ["ops", "finance", "support", "content", "super"], pulse: "teal" },
  { label: "Command Center", href: "/admin/command-center", roles: ["ops", "super"], pulse: "rose" },
  { label: "Orders", href: "/admin/orders", roles: ["ops", "support", "super"], pulse: "gold" },
  { label: "Alerts", href: "/admin/alerts", roles: ["ops", "finance", "support", "super"], pulse: "rose" },
  { label: "Automation", href: "/admin/automation", roles: ["ops", "support", "super"], pulse: "violet" },
  { label: "Risk", href: "/admin/risk", roles: ["ops", "support", "super"], pulse: "rose" },
  { label: "Buddy Pool", href: "/admin/buddy-pool", roles: ["ops", "super"], pulse: "teal" },
  { label: "Audit Log", href: "/admin/audit", roles: ["ops", "finance", "support", "super"], pulse: "gold" },
  { label: "Finance", href: "/admin/finance", roles: ["finance", "super"], pulse: "gold" },
  { label: "Analytics", href: "/admin/analytics", roles: ["ops", "finance", "support", "super"], pulse: "violet" },
  { label: "Support", href: "/admin/support", roles: ["support", "super"], pulse: "teal" },
  { label: "Promotions", href: "/admin/promotions", roles: ["content", "super"], pulse: "violet" },
  { label: "Profile", href: "/admin/profile", roles: ["ops", "finance", "support", "content", "super"], pulse: "teal" }
];

const pulseClass: Record<NonNullable<NavItem["pulse"]>, string> = {
  teal: "bg-[#2dd4bf]",
  violet: "bg-[#7C5CFF]",
  gold: "bg-[#F7C948]",
  rose: "bg-[#fb7185]"
};

export default function AdminSidebar({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [adminRole, setAdminRole] = useState<AdminRole>("ops");

  useEffect(() => {
    const stored = sessionStorage.getItem("jb_admin_role") as AdminRole | null;
    if (stored) setAdminRole(stored);
  }, []);

  const visibleItems = useMemo(() => {
    if (adminRole === "super") return navItems;
    return navItems.filter((item) => item.roles.includes(adminRole));
  }, [adminRole]);

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      ) : null}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-80 transform border-r border-white/10 bg-[linear-gradient(180deg,rgba(18,12,28,0.98),rgba(13,10,20,0.98))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-transform lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mt-16 rounded-[26px] border border-white/10 bg-white/5 p-5 lg:mt-4">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">Control Deck</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="m-0 text-lg font-semibold text-white capitalize">{adminRole}</p>
              <p className="m-0 mt-1 text-sm text-white/55">Marketplace oversight, finance, and live ops.</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2dd4bf]/30 bg-[#2dd4bf]/10 text-sm font-bold text-[#c9fff5]">
              JB
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <div>
            <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-white/40">Shift status</p>
            <p className="m-0 mt-1 text-sm font-medium text-white/80">Monitoring live platform traffic</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2dd4bf]/30 bg-[#2dd4bf]/10 px-3 py-1 text-xs font-semibold text-[#bdf8ee]">
            <span className="h-2 w-2 rounded-full bg-[#2dd4bf] animate-pulse" />
            Live
          </span>
        </div>

        <nav className="mt-5 flex flex-col gap-2">
          {visibleItems.map((item) => {
            const active = pathname === item.href;
            const pulse = item.pulse ? pulseClass[item.pulse] : "bg-white/40";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                  active
                    ? "border-[#7C5CFF]/45 bg-[linear-gradient(90deg,rgba(124,92,255,0.22),rgba(45,212,191,0.12))] text-white shadow-[0_12px_28px_rgba(124,92,255,0.18)]"
                    : "border-white/8 bg-white/[0.03] text-white/70 hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
                }`}
                onClick={onClose}
              >
                <span>{item.label}</span>
                <span className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${pulse} ${active ? "animate-pulse" : "opacity-70"}`} />
                  <span className="text-white/35 transition group-hover:text-white/60">→</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <button
          className="mt-5 w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.08] lg:hidden"
          onClick={onClose}
          type="button"
        >
          Close panel
        </button>
      </aside>
    </>
  );
}
