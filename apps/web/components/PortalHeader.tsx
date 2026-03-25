"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PortalHeaderProps = {
  portalName: string;
  onToggleSidebar?: () => void;
};

export default function PortalHeader({ portalName, onToggleSidebar }: PortalHeaderProps) {
  const router = useRouter();
  const [userName, setUserName] = useState("Account");
  const [role, setRole] = useState("buyer");
  const initials = userName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    const stored = sessionStorage.getItem("jb_user_name");
    const storedRole = sessionStorage.getItem("jb_role");
    if (stored) {
      setUserName(stored);
    } else if (storedRole) {
      setUserName(storedRole.charAt(0).toUpperCase() + storedRole.slice(1));
    }
    if (storedRole) setRole(storedRole);
  }, []);

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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#12021f]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white/90 transition hover:border-white/40"
              onClick={onToggleSidebar}
            >
              ☰
            </button>
          )}
          <Link className="text-sm font-semibold text-white/90 sm:text-base" href="/">
            Jikoni Buddy: {portalName}
          </Link>
        </div>
        <div className="relative flex items-center">
          <div className="group relative">
            <button
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-white/90 transition hover:border-white/40"
              type="button"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/60 bg-violet-500/20 text-xs font-bold text-white">
                {initials || "U"}
              </span>
              <span className="hidden sm:inline">{userName}</span>
            </button>
            <div className="invisible absolute right-0 top-full z-20 mt-2 w-40 rounded-xl border border-white/10 bg-[#1a0f2d]/95 p-2 text-sm text-white opacity-0 shadow-[0_20px_60px_rgba(8,3,18,0.45)] transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link
                href={`/${role}/profile`}
                className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10"
              >
                Profile
              </Link>
              <Link href="/settings" className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10">
                Settings
              </Link>
              <button
                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
