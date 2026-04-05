"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import SiteFooter from "@/components/SiteFooter";
import PortalGuard from "@/components/PortalGuard";
import { useBuddyStore } from "@/lib/buddy-store";
import dynamic from "next/dynamic";
const DemandMapModal = dynamic(() => import("@/components/DemandMapModal"), { ssr: false });
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
  const [liveNotifications, setLiveNotifications] = useState<
    { id?: string; title: string; message: string; createdAt?: string }[]
  >([]);
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
    const helperId = sessionStorage.getItem("jb_helper_id");
    if (helperId) {
       const baseUrl =
         process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
       fetch(`${baseUrl}/api/buddy/users/${helperId}`)
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
    const helperId = sessionStorage.getItem("jb_helper_id");
    if (helperId) {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
      fetch(`${baseUrl}/api/buddy/users/${helperId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOnline })
      }).catch(() => null);
    }
  }, [isOnline]);

  useEffect(() => {
    const stored = sessionStorage.getItem("jb_user_name");
    if (stored) {
      setUserName(stored);
      return;
    }
    const role = sessionStorage.getItem("jb_role");
    if (role) {
      setUserName(role.charAt(0).toUpperCase() + role.slice(1));
    }
    const helperId = sessionStorage.getItem("jb_helper_id");
    if (helperId) {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
      fetch(`${baseUrl}/api/buddy/users/${helperId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.name) {
            sessionStorage.setItem("jb_user_name", data.name);
            setUserName(data.name);
          }
        })
        .catch(() => null);
    }
  }, []);

  useEffect(() => {
    const helperId = sessionStorage.getItem("jb_helper_id");
    if (!helperId) return;

    const baseUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const socket: Socket = io(`${baseUrl}/ws/buddy`, {
      query: { userId: helperId },
      transports: ["websocket"]
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

  useEffect(() => {
    const helperId = sessionStorage.getItem("jb_helper_id");
    if (!helperId) return;

    const baseUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const socket: Socket = io(`${baseUrl}/ws/notification`, {
      query: { userId: helperId },
      transports: ["websocket"]
    });

    socket.on("notification", (payload: any) => {
      setLiveNotifications((prev) => [
        {
          id: payload?.id,
          title: payload?.title ?? "Notification",
          message: payload?.message ?? "",
          createdAt: payload?.createdAt
        },
        ...prev
      ].slice(0, 6));
    });

    return () => {
      socket.disconnect();
    };
  }, []);


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
    sessionStorage.removeItem("jb_auth");
    sessionStorage.removeItem("jb_role");
    sessionStorage.removeItem("jb_helper_id");
    router.push("/");
  };

  const handleAcceptJob = async () => {
    if (!incomingJob) return;
    const helperId = sessionStorage.getItem("jb_helper_id");
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
      await fetch(`${baseUrl}/api/buddy/requests/${incomingJob.id}/apply`, {
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
      <div className="min-h-screen flex flex-col bg-[#0c0612] text-white">
        <header className="sticky top-0 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 bg-[#0c0612]/95 border-b border-white/10 backdrop-blur-md">
          <Link className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent" href="/">
            Jikoni Buddy
          </Link>
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-full border border-white/10 bg-[#0f081a]/60 text-white ml-2"
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            ☰
          </button>
          <div className="flex items-center gap-3 justify-self-end relative" ref={notificationsRef}>
            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
              <span className="text-white/60">Earnings</span>
              <strong className="text-white">{quickStats.earnings}</strong>
            </div>
            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
              <span className="text-white/60">Location</span>
              <strong className="text-white">{quickStats.location}</strong>
            </div>
            <button
              className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/10 bg-[#0f081a]/60 text-white font-medium hover:bg-white/10 transition-colors"
              type="button"
              onClick={() => setNotificationsOpen((prev) => !prev)}
            >
              <span className="hidden md:inline text-sm">Notifications</span> 
              <span className="md:hidden">🔔</span>
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-pink-500 text-white text-[10px] font-bold px-1 absolute -top-1 -right-1 md:static">
                {liveNotifications.length || 3}
              </span>
            </button>
            <Link className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/10 bg-[#0f081a]/60 text-white font-medium hover:bg-white/10 transition-colors" href="/buddy-portal/messages">
              <span className="hidden md:inline text-sm">Messages</span>
              <span className="md:hidden">💬</span>
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-pink-500 text-white text-[10px] font-bold px-1 absolute -top-1 -right-1 md:static">2</span>
            </Link>
            <div className="relative" ref={profileRef}>
              <button
                className="inline-flex items-center gap-2 pl-1 pr-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500/25 border border-purple-500/45 font-bold text-white text-sm">
                  {initials}
                </span>
                <span className="hidden sm:inline font-medium text-sm">{userName}</span>
              </button>
              {profileOpen ? (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#12021f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 flex flex-col z-50 overflow-hidden">
                  <Link href="/buddy-portal/profile" className="px-4 py-2.5 text-sm hover:bg-white/10 transition-colors">
                    My Profile
                  </Link>
                  <button
                    className="px-4 py-2.5 text-left text-sm hover:bg-white/10 transition-colors text-purple-300 font-medium"
                    type="button"
                    onClick={toggleOnline}
                  >
                    {isOnline ? "Go Offline 🔴" : "Go Online 🟢"}
                  </button>
                  <Link href="/buddy-portal/earnings" className="px-4 py-2.5 text-sm hover:bg-white/10 transition-colors">
                    My Earnings
                  </Link>
                  <Link href="/buddy-portal/settings" className="px-4 py-2.5 text-sm hover:bg-white/10 transition-colors">
                    Settings
                  </Link>
                  <div className="h-px bg-white/10 my-1"></div>
                  <button className="px-4 py-2.5 text-left text-sm text-pink-400 hover:bg-red-500/10 transition-colors" type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          {notificationsOpen ? (
            <div className="absolute right-4 top-16 w-[min(320px,90vw)] bg-[#0e0716]/98 backdrop-blur-xl border border-white/12 rounded-2xl p-4 flex flex-col gap-3 shadow-[0_24px_60px_rgba(20,6,40,0.35)] z-50">
              <h4 className="m-0 text-base font-semibold">Notifications</h4>
              {liveNotifications.length ? (
                liveNotifications.map((note) => (
                  <Link
                    key={note.id ?? note.createdAt ?? note.title}
                    href="/buddy-portal/earnings"
                    className="block bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 hover:border-purple-500/50 hover:-translate-y-0.5 transition-all"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    <strong className="block text-sm text-white">{note.title}</strong>
                    <p className="m-0 mt-1 text-xs text-white/60">{note.message}</p>
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="/buddy-portal/dashboard"
                    className="block bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 hover:border-purple-500/50 hover:-translate-y-0.5 transition-all"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    <strong className="block text-sm text-white">New cooking job</strong>
                    <p className="m-0 mt-1 text-xs text-white/60">Kilimani · 2h · KES 1,500</p>
                  </Link>
                  <Link
                    href="/buddy-portal/earnings"
                    className="block bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 hover:border-purple-500/50 hover:-translate-y-0.5 transition-all"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    <strong className="block text-sm text-white">Payment received</strong>
                    <p className="m-0 mt-1 text-xs text-white/60">KES 800 · 15 mins ago</p>
                  </Link>
                  <Link
                    href="/buddy-portal/job"
                    className="block bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 hover:border-purple-500/50 hover:-translate-y-0.5 transition-all"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    <strong className="block text-sm text-white">Job reminder</strong>
                    <p className="m-0 mt-1 text-xs text-white/60">Packaging shift at 2PM</p>
                  </Link>
                </>
              )}
            </div>
          ) : null}
        </header>

        <div className="flex-1 flex flex-col md:flex-row relative">
          <aside className={`fixed inset-y-0 left-0 z-40 w-[240px] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-[#0c0612]/95 backdrop-blur-xl border-r border-white/10 py-6 px-4 flex flex-col h-[calc(100vh-64px)] top-[64px] md:top-0 md:h-[calc(100vh-73px)] md:sticky shrink-0`}>
            <div className="text-xs uppercase tracking-[0.12em] text-white/60 mb-6 font-semibold px-2">Buddy Navigation</div>
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 scrollbar-thin">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                if (item.children?.length) {
                  return (
                    <div key={item.label} className="flex flex-col gap-1.5">
                      <button
                        type="button"
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-transparent font-medium transition-colors ${isActive ? 'bg-purple-500/15 border-purple-500/50 text-[#f2e9ff]' : 'bg-[#0f081a]/60 text-white/85 hover:bg-purple-500/10 hover:border-purple-500/35'}`}
                        onClick={() => setRequestsOpen((prev) => !prev)}
                      >
                        <span className="text-sm">{item.label}</span>
                        <span className="text-white/70">{requestsOpen ? "−" : "+"}</span>
                      </button>
                      {requestsOpen ? (
                        <div className="flex flex-col gap-1 pl-3 border-l border-white/10 ml-3 mt-1">
                          {item.children.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                              <Link
                                key={child.label}
                                href={child.href}
                                className={`px-3 py-2 rounded-xl text-sm transition-colors ${childActive ? 'bg-purple-500/15 border border-purple-500/45 text-[#f2e9ff]' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
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
                    className={`flex items-center px-3 py-2.5 rounded-xl border border-transparent font-medium transition-colors ${isActive ? 'bg-purple-500/15 border-purple-500/50 text-[#f2e9ff]' : 'bg-[#0f081a]/60 text-white/85 hover:bg-purple-500/10 hover:border-purple-500/35'}`}
                  >
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-auto bg-[#0c0612]/80 rounded-2xl p-4 border border-white/10 flex flex-col gap-3 shrink-0">
              <h4 className="m-0 text-white font-semibold flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                Focus
              </h4>
              <p className="m-0 text-sm text-white/70 leading-relaxed">
                {activeSection === "offline" && "Go online to receive new job requests."}
                {activeSection === "requests" && "Review and accept new requests quickly."}
                {activeSection === "active" && "Complete active jobs and update sellers."}
              </p>
              <button 
                className={`w-full py-2.5 rounded-xl font-semibold transition-colors mt-2 ${isOnline ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'}`} 
                type="button"
                onClick={!isOnline ? toggleOnline : undefined}
              >
                {isOnline ? "View Requests" : "Go Online"}
              </button>
            </div>
          </aside>
          
          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && (
            <div 
              className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 lg:pb-12 h-[calc(100vh-64px)] md:h-[calc(100vh-73px)] overflow-y-auto">
            {children}
          </main>
        </div>

        {incomingJob && !autoMatchedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#12021f] border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full text-center flex flex-col gap-6 transform scale-100 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <span className="text-4xl">🚨</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold m-0 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">New Request!</h2>
              
              <div className="bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 text-[#2dd4bf] p-6 rounded-2xl flex flex-col gap-3">
                <h3 className="m-0 text-lg uppercase tracking-wider">{incomingJob.taskType?.toUpperCase() ?? "COOKING"} HELP</h3>
                <p className="m-0 text-xl font-bold text-white">{incomingJob.locationLabel}</p>
                <div className="inline-flex items-center justify-center gap-2 bg-[#2dd4bf]/20 px-4 py-2 rounded-full self-center">
                  <span className="text-sm font-medium text-[#2dd4bf]">Pays</span>
                  <strong className="text-lg">KES {incomingJob.compensation ?? "1,200"}</strong>
                </div>
              </div>
              
              <div className="grid gap-3 mt-2">
                <button 
                  className="bg-[#2dd4bf] hover:bg-[#20b2aa] text-[#0f0717] font-bold py-4 rounded-2xl text-lg shadow-lg shadow-[#2dd4bf]/20 transition-all hover:scale-[1.02]" 
                  onClick={handleAcceptJob}
                >
                  ACCEPT NOW
                </button>
                <button 
                  className="bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-2xl transition-colors" 
                  onClick={() => setIncomingJob(null)}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}

        {autoMatchedJob && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-red-900/40 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-[#12021f] border-2 border-[#ff4e50] shadow-[0_0_50px_rgba(255,78,80,0.3)] rounded-3xl p-6 sm:p-10 max-w-md w-full text-center flex flex-col gap-6">
              <div className="w-24 h-24 bg-[#ff4e50]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-5xl">🚀</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold m-0 text-[#ff4e50]">YOU'VE BEEN DEPLOYED!</h2>
              <p className="text-lg text-white/80 m-0 leading-relaxed">
                The system has auto-matched you to a high-demand Kitchen because you were Online!
              </p>
              
              <div className="bg-[#ff4e50]/10 p-6 rounded-2xl border border-[#ff4e50]/30 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4e50]/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
                <h3 className="m-0 text-white/70 font-medium text-sm tracking-widest uppercase">{autoMatchedJob.sellerId}</h3>
                <p className="m-0 text-2xl font-bold text-white relative z-10">{autoMatchedJob.taskType}</p>
                <p className="m-0 text-[#ff4e50] font-medium relative z-10">at {autoMatchedJob.locationLabel}</p>
              </div>
              
              <button 
                className="w-full bg-[#ff4e50] hover:bg-[#ff3b3d] text-white font-bold py-5 rounded-2xl text-lg shadow-lg shadow-[#ff4e50]/30 transition-all hover:scale-[1.02] mt-4" 
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
