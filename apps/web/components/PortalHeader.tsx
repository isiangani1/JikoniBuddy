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
    const stored = localStorage.getItem("jb_user_name");
    const storedRole = localStorage.getItem("jb_role");
    if (stored) {
      setUserName(stored);
    } else if (storedRole) {
      setUserName(storedRole.charAt(0).toUpperCase() + storedRole.slice(1));
    }
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jb_auth");
    localStorage.removeItem("jb_role");
    localStorage.removeItem("jb_helper_id");
    router.push("/");
  };

  return (
    <header className="top-nav portal-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {onToggleSidebar && (
          <button className="icon-button" onClick={onToggleSidebar}>
            ☰
          </button>
        )}
        <Link className="logo" href="/">
          Jikoni Buddy: {portalName}
        </Link>
      </div>
      <div className="nav-actions" style={{ justifyContent: 'flex-end', display: 'flex' }}>
        <div className="nav-dropdown">
          <button className="nav-link" type="button">
            <span className="user-avatar">{initials || "U"}</span>
            <span>{userName}</span>
          </button>
          <div className="dropdown-panel">
            <Link href={`/${role}/profile`} className="dropdown-item">
              Profile
            </Link>
            <Link href="/settings" className="dropdown-item">
              Settings
            </Link>
            <button className="dropdown-item" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
