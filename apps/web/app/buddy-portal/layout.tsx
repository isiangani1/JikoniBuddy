"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import SiteFooter from "@/components/SiteFooter";
import PortalGuard from "@/components/PortalGuard";
import { useBuddyStore } from "@/lib/buddy-store";
import DemandMapModal from "@/components/DemandMapModal";

  const navItems = [
    { label: "Dashboard", href: "/buddy-portal/dashboard"},
    { label: "Offers", href: "/buddy-portal/my-requests", children: [
      { label: "Open Requests", href: "/buddy-portal/my-requests"},
      { label: "Active Jobs", href: "/buddy-portal/active-jobs"}
    ]},
    { label: "History", href: "/buddy-portal/history" },
    { label: "Earnings", href: "/buddy-portal/earnings"},
    { label: "My Ratings", href: "/buddy-portal/ratings"},
    { label: "Messages", href: "/buddy-portal/messages" },
    { label: "Settings", href: "/buddy-portal/settings" },
    { label: "Support", href: "/buddy-portal/support"}
  ];

  const getIconText = (icon: string): string => {
    // Return the icon as-is since we're using emoji/text labels
    return icon;
  };

export default function BuddyPortalLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOnline, setIsOnline, toggleOnline } = useBuddyStore();
  const [showDemandMap, setShowDemandMap] = useState(false);
  const prevOnlineRef = useRef(isOnline);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("Buddy");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [incomingJob, setIncomingJob] = useState<any>(null);
  const [autoMatchedJob, setAutoMatchedJob] = useState<any>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initial sync from DB/LocalStorage on mount
    const helperId = localStorage.getItem("jb_helper_id");
    if (helperId) {
       const baseUrl = process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
       fetch(`${baseUrl}/buddy/users/${helperId}`)
         .then(res => res.ok ? res.json() : null)
         .then(data => {
           if (data?.helperProfile) {
             setIsOnline(data.helperProfile.isOnline);
             prevOnlineRef.current = data.helperProfile.isOnline;
           }
         });
    }
  }, []);

  useEffect(() => {
    // Trigger Demand Map Popup when going online
    if (isOnline && !prevOnlineRef.current) {
      setShowDemandMap(true);
    }
    prevOnlineRef.current = isOnline;

    // Sync to API
    const helperId = localStorage.getItem("jb_helper_id");
    if (helperId) {
      const baseUrl = process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
      fetch(`${baseUrl}/buddy/users/${helperId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOnline })
      }).catch(() => null);
    }
  }, [isOnline]);

  useEffect(() => {
    const stored = localStorage.getItem("jb_user_name");
    if (stored) {
      setUserName(stored);
      return;
    }
    const role = localStorage.getItem("jb_role");
    if (role) {
      setUserName(role.charAt(0).toUpperCase() + role.slice(1));
    }
    const helperId = localStorage.getItem("jb_helper_id");
    if (helperId) {
      const baseUrl =
        process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
      fetch(`${baseUrl}/buddy/users/${helperId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.name) {
            localStorage.setItem("jb_user_name", data.name);
            setUserName(data.name);
          }
        })
        .catch(() => null);
    }
  }, []);

  useEffect(() => {
    const helperId = localStorage.getItem("jb_helper_id");
    if (!helperId) return;

    const baseUrl = process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
    const socket: Socket = io(`${baseUrl}/buddy`, {
      query: { userId: helperId }
    });

    socket.on("buddy.job_offered", (jobRequest: any) => {
      setIncomingJob(jobRequest);
    });

    socket.on("buddy.job_confirmed", (jobData: any) => {
      if (jobData.sellerId) {
        // This is an Auto-Match aggressive override!
        setAutoMatchedJob(jobData);
      } else {
        // Standard confirmation routing
        router.push("/buddy-portal/active-jobs");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [router]);


  const initials = useMemo(() => {
    const parts = userName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return userName.slice(0, 1).toUpperCase();
  }, [userName]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const quickStats = useMemo(
    () => ({
      earnings: "KES 1,200 today",
      location: "Westlands"
    }),
    []
  );

  const activeSection = useMemo(() => {
    if (!isOnline) return "offline";
    if (pathname?.includes("/job")) return "active";
    return "requests";
  }, [isOnline, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("jb_auth");
    localStorage.removeItem("jb_role");
    localStorage.removeItem("jb_helper_id");
    router.push("/");
  };

  const handleAcceptJob = async () => {
    if (!incomingJob) return;
    const helperId = localStorage.getItem("jb_helper_id");
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
      await fetch(`${baseUrl}/buddy/requests/${incomingJob.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId, note: "I'm available now!" })
      });
      setIncomingJob(null);
      alert("Application sent to seller!");
    } catch (e) {
      alert("Failed to apply for job.");
    }
  };

  return (
    <PortalGuard role="buddy">
    <div className="buddy-shell">
      <header className="buddy-header">
        <Link className="logo" href="/">
          Jikoni Buddy
        </Link>
        <button
          className="icon-button sidebar-toggle"
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>
        <div className="buddy-header-actions" ref={notificationsRef}>
            <div className="header-chip">
              <span className="icon-label">Earnings</span>
              <strong>{quickStats.earnings}</strong>
            </div>
            <div className="header-chip">
              <span className="icon-label">Location</span>
              <strong>{quickStats.location}</strong>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={() => setNotificationsOpen((prev) => !prev)}
            >
              <span className="icon-label">Notifications</span> <span className="badge">3</span>
            </button>
            <Link className="icon-button" href="/buddy-portal/messages">
              <span className="icon-label">Messages</span> <span className="badge">2</span>
            </Link>
          <div className="nav-dropdown" ref={profileRef}>
            <button
              className="nav-link"
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
            >
              <span className="user-avatar">{initials}</span>
              {userName}
            </button>
            {profileOpen ? (
              <div className="dropdown-panel">
                <Link href="/buddy-portal/profile" className="dropdown-item">
                  My Profile
                </Link>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={toggleOnline}
                >
                  {isOnline ? "Go Offline" : "Go Online"}
                </button>
                <Link href="/buddy-portal/earnings" className="dropdown-item">
                  My Earnings
                </Link>
                  <Link href="/buddy-portal/settings" className="dropdown-item">
                    Settings
                  </Link>
                  <button className="dropdown-item" type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
        </div>
        {notificationsOpen ? (
          <div className="notification-panel">
            <h4>Notifications</h4>
            <Link
              href="/buddy-portal/dashboard"
              className="notification-item"
              onClick={() => setNotificationsOpen(false)}
            >
              <strong>New cooking job</strong>
              <p>Kilimani · 2h · KES 1,500</p>
            </Link>
            <Link
              href="/buddy-portal/earnings"
              className="notification-item"
              onClick={() => setNotificationsOpen(false)}
            >
              <strong>Payment received</strong>
              <p>KES 800 · 15 mins ago</p>
            </Link>
            <Link
              href="/buddy-portal/job"
              className="notification-item"
              onClick={() => setNotificationsOpen(false)}
            >
              <strong>Job reminder</strong>
              <p>Packaging shift at 2PM</p>
            </Link>
          </div>
        ) : null}
      </header>

      <div className={`buddy-body ${isSidebarOpen ? "collapsed" : ""}`}>
        <aside className={`buddy-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="sidebar-title">Buddy Navigation</div>
            <div className="sidebar-section">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                if (item.children?.length) {
                  return (
                    <div key={item.label} className="sidebar-group">
                      <button
                        type="button"
                        className={`sidebar-link ${isActive ? "active" : ""}`}
                        onClick={() => setRequestsOpen((prev) => !prev)}
                      >
                        <span className="nav-text">{item.label}</span>
                        <span className="nav-caret">{requestsOpen ? "−" : "+"}</span>
                      </button>
                      {requestsOpen ? (
                        <div className="sidebar-submenu">
                          {item.children.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                              <Link
                                key={child.label}
                                href={child.href}
                                className={`sidebar-sublink ${childActive ? "active" : ""}`}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                  >
                    <span className="nav-text">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          <div className="sidebar-status">
            <h4>Focus</h4>
            <p>
              {activeSection === "offline" &&
                "Go online to receive new job requests."}
              {activeSection === "requests" &&
                "Review and accept new requests quickly."}
              {activeSection === "active" &&
                "Complete active jobs and update sellers."}
            </p>
            <button className="primary full" type="button">
              {isOnline ? "View Requests" : "Go Online"}
            </button>
          </div>
        </aside>

        <main className="buddy-content">{children}</main>
      </div>



      {incomingJob && !autoMatchedJob && (
        <div className="modal-overlay">
          <div className="modal-card incoming-job-modal" style={{ textAlign: "center", padding: "2rem" }}>
            <h2 style={{ fontSize: "2rem", margin: "0 0 1rem" }}>🚨 New Request! 🚨</h2>
            <div style={{ background: "#2dd4bf", color: "#1a1026", padding: "1rem", borderRadius: "12px", marginBottom: "1rem" }}>
              <h3 style={{ margin: "0" }}>{incomingJob.taskType?.toUpperCase() ?? "COOKING"} HELP</h3>
              <p style={{ margin: "0.5rem 0 0", fontSize: "1.2rem", fontWeight: "bold" }}>{incomingJob.locationLabel}</p>
              <p style={{ margin: "0.5rem 0 0" }}>Pays KES {incomingJob.compensation ?? "1,200"}</p>
            </div>
            <div style={{ display: "grid", gap: "1rem" }}>
              <button className="primary" style={{ padding: "1rem", fontSize: "1.2rem" }} onClick={handleAcceptJob}>
                ACCEPT NOW
              </button>
              <button className="ghost" onClick={() => setIncomingJob(null)}>
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

       {autoMatchedJob && (
          <div className="modal-overlay" style={{ zIndex: 9999, background: 'rgba(255, 0, 0, 0.4)' }}>
            <div className="modal-card" style={{ textAlign: "center", padding: "2rem", border: "2px solid #ff4e50" }}>
              <h2 style={{ fontSize: "2rem", margin: "0 0 1rem", color: "#ff4e50" }}>🚀 YOU'VE BEEN DEPLOYED! 🚀</h2>
              <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
                The system has auto-matched you to a high-demand Kitchen because you were Online!
              </p>
              <div style={{ background: "rgba(255, 78, 80, 0.1)", padding: "1.5rem", borderRadius: "12px", marginBottom: "1.5rem", border: "1px solid rgba(255, 78, 80, 0.3)" }}>
                <h3 style={{ margin: "0 0 0.5rem" }}>{autoMatchedJob.sellerId}</h3>
                <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold" }}>{autoMatchedJob.taskType} at {autoMatchedJob.locationLabel}</p>
              </div>
              <button 
                 className="primary" 
                 style={{ width: "100%", padding: "1rem", fontSize: "1.2rem", background: "#ff4e50" }} 
                 onClick={() => {
                   setAutoMatchedJob(null);
                   router.push("/buddy-portal/active-jobs");
                 }}
              >
                ACKNOWLEDGE & VIEW ROUTE
              </button>
            </div>
          </div>
       )}

       {showDemandMap && (
         <DemandMapModal onClose={() => setShowDemandMap(false)} />
       )}
    </div>
    </PortalGuard>
  );
}
