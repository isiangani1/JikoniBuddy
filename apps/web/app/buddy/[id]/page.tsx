"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getUserProfile } from "@/lib/buddy-client";
import { motion, AnimatePresence } from "framer-motion";

export default function BuddyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [buddy, setBuddy] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      getUserProfile(params.id as string)
        .then(setBuddy)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [params.id]);

  const handleRequest = () => {
    const role = sessionStorage.getItem("jb_role");
    if (role !== "seller") {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}&reason=seller_only`);
      return;
    }
    // Logic for seller to actually post a request would go here
    // For now, we point to the seller buddy pool management or a specific form
    router.push("/seller/buddy-pool");
  };

  const MotionDiv = motion.div as any;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090310] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!buddy) {
    return (
      <div className="min-h-screen bg-[#090310] relative overflow-hidden">
        <SiteHeader />
        <main className="relative z-10 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-h-[60vh] items-center justify-center text-center">
          <h2 className="text-3xl font-black text-white">Buddy not found</h2>
          <p className="text-white/50">This helper profile may have been removed or is currently private.</p>
          <button 
            onClick={() => router.push("/buddy-pool")}
            className="mt-4 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
          >
            Back to Pool
          </button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090310] relative overflow-hidden text-[#f6f1fb]">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute -top-24 right-[-120px] h-72 w-72 rounded-full bg-purple-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute left-[-120px] top-1/3 h-80 w-80 rounded-full bg-teal-500/5 blur-[100px]" />
      
      <SiteHeader />
      
      <main className="relative z-10 p-4 sm:p-6 lg:p-12 w-full max-w-7xl mx-auto flex flex-col gap-10">
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-8"
        >
          {/* Main Profile Info */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-xl">
              <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-3xl font-black border border-white/20 shadow-2xl">
                {buddy.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                   <h1 className="text-4xl font-black text-white m-0 tracking-tight">{buddy.name}</h1>
                   {buddy.isOnline && (
                     <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       Online
                     </span>
                   )}
                </div>
                <p className="text-white/50 font-medium text-lg m-0">Professional {buddy.skills?.[0] || 'Kitchen Helper'}</p>
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex items-center gap-1">
                      <span className="text-amber-400 font-bold">{buddy.rating.toFixed(1)}</span>
                      <span className="text-white/30 text-xs">Rating</span>
                   </div>
                   <div className="w-px h-3 bg-white/10" />
                   <div className="flex items-center gap-1">
                      <span className="text-white font-bold">{buddy.jobsCompleted}</span>
                      <span className="text-white/30 text-xs">Shifts</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] flex flex-col gap-4">
                <h3 className="text-xl font-bold text-white m-0">Specialized Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {buddy.skills?.map((skill: string) => (
                    <span key={skill} className="px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold text-xs uppercase tracking-wider">
                      {skill}
                    </span>
                  )) || <p className="text-white/30 text-sm">No specialized skills listed.</p>}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] flex flex-col gap-4">
                <h3 className="text-xl font-bold text-white m-0">Availability</h3>
                <div className="flex flex-col gap-3">
                  {buddy.availability?.length > 0 ? (
                    buddy.availability.map((a: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-white/50 font-medium">
                          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][a.dayOfWeek]}
                        </span>
                        <span className="text-white font-bold">{a.startTime} - {a.endTime}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/30 text-sm">Always available on short notice.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="flex flex-col gap-4 self-start sticky top-28">
            <div className="bg-gradient-to-br from-[#2dd4bf] to-emerald-400 p-[1px] rounded-[32px] shadow-2xl shadow-emerald-500/10">
              <div className="bg-[#090310] rounded-[31px] p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2 text-center">
                  <h3 className="text-2xl font-black text-white m-0 tracking-tight">Reserve Buddy</h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Instantly request {buddy.name.split(' ')[0]} for your next kitchen shift.
                  </p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm py-3 border-y border-white/5">
                    <span className="text-white/50">Base Rate</span>
                    <span className="text-white font-bold">From KES 850/hr</span>
                  </div>
                  <button 
                    onClick={handleRequest}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#2dd4bf] to-emerald-400 text-[#0d0a14] font-black text-lg hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all active:scale-95"
                  >
                    Send Request
                  </button>
                </div>
                
                <p className="text-[10px] text-center text-white/30 uppercase font-bold tracking-widest">
                  Secure checkout & vetted staff
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-lg">🛡️</div>
               <div className="flex flex-col gap-0.5">
                 <p className="text-xs font-bold text-white m-0">Jikoni Verified</p>
                 <p className="text-[10px] text-white/40 m-0">Identity & Safety Screened</p>
               </div>
            </div>
          </div>
        </MotionDiv>
      </main>
      
      <SiteFooter />
    </div>
  );
}
