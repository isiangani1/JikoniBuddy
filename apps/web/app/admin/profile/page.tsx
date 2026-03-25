import React from "react";
export default function AdminProfilePage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-red-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <p className="text-red-300 font-bold tracking-widest uppercase text-sm m-0">Admin Profile</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white m-0">Administrator access</h1>
          <p className="text-white/70 m-0 text-lg">
            Review approvals, disputes, and platform metrics.
          </p>
        </div>
        <div className="w-full lg:w-[320px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-white m-0 mb-3 border-b border-white/10 pb-2">Admin snapshot</h3>
          <ul className="flex flex-col gap-2 m-0 p-0 list-none">
            <li className="text-white/80 flex justify-between"><span className="text-white/50">Role:</span> <span className="font-semibold">Platform Admin</span></li>
            <li className="text-white/80 flex justify-between"><span className="text-white/50">Approvals pending:</span> <span className="font-bold text-yellow-500">8</span></li>
            <li className="text-white/80 flex justify-between"><span className="text-white/50">Open disputes:</span> <span className="font-bold text-red-500">3</span></li>
          </ul>
        </div>
      </section>

      <section className="flex flex-col gap-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-white m-0">Admin details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest m-0">Region</h3>
            <p className="text-lg font-bold text-white m-0">Nairobi</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest m-0">Permissions</h3>
            <p className="text-lg font-bold text-white m-0">Full moderation & payouts</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest m-0">Last login</h3>
            <p className="text-lg font-bold text-white m-0">Today, 09:12</p>
          </div>
        </div>
      </section>
    </main>
  );
}
