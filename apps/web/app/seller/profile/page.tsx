"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function SellerProfileEditor() {
  const queryClient = useQueryClient();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    businessName: "",
    description: "",
    logoUrl: "",
    deliveryRadius: 5,
    minimumOrder: 500
  });

  useEffect(() => {
    setSellerId(localStorage.getItem("jb_session") || "test-seller-1");
  }, []);

  const { isLoading } = useQuery({
    queryKey: ["sellerProfile", sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const res = await fetch(`/api/seller/capacity?sellerId=${sellerId}`);
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setProfile({
        businessName: data.businessName || "",
        description: data.description || "",
        logoUrl: data.logoUrl || "",
        deliveryRadius: data.deliveryRadius || 5,
        minimumOrder: data.minimumOrder || 500
      });
      return data;
    },
    enabled: !!sellerId
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (updated: typeof profile) => {
      const res = await fetch(`/api/seller/capacity?sellerId=${sellerId}` , {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: () => {
      alert("Kitchen Profile Synchronized!");
      queryClient.invalidateQueries({ queryKey: ["sellerProfile", sellerId] });
    }
  });

  if (isLoading) return <div className="p-8 text-white">Syncing profile metadata...</div>;

  return (
    <main className="p-4 sm:p-6 max-w-3xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Identity & Visibility</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white m-0">Business Profile Editor</h1>
        <p className="text-white/60 text-sm sm:text-base">
          Update how you appear to buyers and buddies across the platform.
        </p>
      </header>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
        <h3 className="text-lg font-semibold text-white m-0">Kitchen Branding</h3>
        <div className="grid gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Display Name</label>
            <input
              type="text"
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Bio / Description</label>
            <textarea
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
        <h3 className="text-lg font-semibold text-white m-0">Operational Parameters</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Delivery Radius (KM)</label>
            <input
              type="number"
              value={profile.deliveryRadius}
              onChange={(e) => setProfile({ ...profile, deliveryRadius: parseInt(e.target.value) || 0 })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Min Order Value (KES)</label>
            <input
              type="number"
              value={profile.minimumOrder}
              onChange={(e) => setProfile({ ...profile, minimumOrder: parseInt(e.target.value) || 0 })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <button
        className="w-full px-5 py-3 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity"
        onClick={() => saveProfileMutation.mutate(profile)}
        disabled={saveProfileMutation.isPending}
      >
        {saveProfileMutation.isPending ? "Syncing..." : "Apply Global Changes"}
      </button>
    </main>
  );
}
