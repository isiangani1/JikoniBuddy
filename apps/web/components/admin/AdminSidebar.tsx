"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

export type AdminRole = "ops" | "finance" | "support" | "content" | "super";

type NavItem = {
  label: string;
  href: string;
  roles: AdminRole[];
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/admin", roles: ["ops", "finance", "support", "content", "super"] },
  { label: "Command Center", href: "/admin/command-center", roles: ["ops", "super"] },
  { label: "Orders", href: "/admin/orders", roles: ["ops", "support", "super"] },
  { label: "Alerts", href: "/admin/alerts", roles: ["ops", "finance", "support", "super"] },
  { label: "Automation", href: "/admin/automation", roles: ["ops", "support", "super"] },
  { label: "Risk", href: "/admin/risk", roles: ["ops", "support", "super"] },
  { label: "Buddy Pool", href: "/admin/buddy-pool", roles: ["ops", "super"] },
  { label: "Audit Log", href: "/admin/audit", roles: ["ops", "finance", "support", "super"] },
  { label: "Finance", href: "/admin/finance", roles: ["finance", "super"] },
  { label: "Analytics", href: "/admin/analytics", roles: ["ops", "finance", "support", "super"] },
  { label: "Support", href: "/admin/support", roles: ["support", "super"] },
  { label: "Promotions", href: "/admin/promotions", roles: ["content", "super"] },
  { label: "Profile", href: "/admin/profile", roles: ["ops", "finance", "support", "content", "super"] }
];

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
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform border-r border-white/10 bg-[#0d0717] p-6 transition-transform lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50 m-0">Admin Role</p>
            <p className="text-lg font-semibold text-white m-0">
              {adminRole.charAt(0).toUpperCase() + adminRole.slice(1)}
            </p>
          </div>
          <button
            className="lg:hidden rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {visibleItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
                onClick={onClose}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
