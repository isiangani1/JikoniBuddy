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
      const res = await fetch(`/api/seller/capacity?sellerId=${sellerId}`); // Reusing capacity route which returns profile
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
    enabled: !!sellerId,
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (updated: typeof profile) => {
      const res = await fetch(`/api/seller/capacity?sellerId=${sellerId}`, { // Reusing update logic
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

  if (isLoading) return <div style={{ padding: "2rem", color: "white" }}>Syncing profile metadata...</div>;

  return (
    <main style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Identity & Visibility</p>
        <h1>Business Profile Editor</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "0.5rem" }}>Update how you appear to buyers and buddies across the platform.</p>
      </header>

      <section style={{ background: "rgba(255,255,255,0.05)", padding: "2rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "2rem" }}>
        <h3 style={{ margin: "0 0 1.5rem" }}>Kitchen Branding</h3>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Display Name</label>
            <input 
              type="text" 
              value={profile.businessName}
              onChange={e => setProfile({...profile, businessName: e.target.value})}
              style={{ width: "100%", padding: "1rem", borderRadius: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Bio / Description</label>
            <textarea 
              value={profile.description}
              onChange={e => setProfile({...profile, description: e.target.value})}
              rows={4}
              style={{ width: "100%", padding: "1rem", borderRadius: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
            />
          </div>
        </div>
      </section>

      <section style={{ background: "rgba(255,255,255,0.05)", padding: "2rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "2rem" }}>
        <h3 style={{ margin: "0 0 1.5rem" }}>Operational Parameters</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Delivery Radius (KM)</label>
            <input 
              type="number" 
              value={profile.deliveryRadius}
              onChange={e => setProfile({...profile, deliveryRadius: parseInt(e.target.value) || 0})}
              style={{ width: "100%", padding: "1rem", borderRadius: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Min Order Value (KES)</label>
            <input 
              type="number" 
              value={profile.minimumOrder}
              onChange={e => setProfile({...profile, minimumOrder: parseInt(e.target.value) || 0})}
              style={{ width: "100%", padding: "1rem", borderRadius: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
            />
          </div>
        </div>
      </section>

      <button 
        className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" 
        style={{ width: "100%", padding: "1.2rem", fontSize: "1rem", fontWeight: "bold" }}
        onClick={() => saveProfileMutation.mutate(profile)}
        disabled={saveProfileMutation.isPending}
      >
        {saveProfileMutation.isPending ? "Syncing..." : "Apply Global Changes"}
      </button>
    </main>
  );
}
