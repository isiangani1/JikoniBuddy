"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function CapacityManager() {
  const queryClient = useQueryClient();
  const [sellerId, setSellerId] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    maxOrdersPerHour: 20,
    prepBufferMinutes: 15,
    autoBuddyScaling: true,
    isAcceptingOrders: true,
    operatingHoursOpen: "08:00",
    operatingHoursClose: "22:00"
  });

  useEffect(() => {
    setSellerId(localStorage.getItem("jb_session") || "test-seller-1");
  }, []);

  const { isLoading } = useQuery({
    queryKey: ["sellerCapacity", sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const res = await fetch(`/api/seller/capacity?sellerId=${sellerId}`);
      if (!res.ok) throw new Error("Failed to load capacity settings");
      const data = await res.json();
      setSettings(data);
      return data;
    },
    enabled: !!sellerId,
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      const res = await fetch(`/api/seller/capacity?sellerId=${sellerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings)
      });
      if (!res.ok) throw new Error("Failed to save settings");
      return res.json();
    },
    onSuccess: () => {
      alert("Smart Capacity Engine settings updated!");
      queryClient.invalidateQueries({ queryKey: ["sellerCapacity", sellerId] });
    }
  });

  const handleToggle = (field: keyof typeof settings) => {
    const nextSettings = { ...settings, [field]: !settings[field] };
    setSettings(nextSettings);
    // Instant save for simple toggles feels snappy
    saveSettingsMutation.mutate(nextSettings);
  };

  if (isLoading) return <p style={{ padding: "2rem", color: "white" }}>Loading capacity profile...</p>;

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">Logistics & Load</p>
        <h1>Smart Capacity Engine</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "0.5rem" }}>
          Control exactly how much load your kitchen can take. If the threshold is breached, the engine will either stop orders or automatically broadcast an SOS to the Buddy Pool based on your preferences.
        </p>
      </header>

      <section style={{ background: "rgba(255,255,255,0.05)", padding: "2rem", borderRadius: "12px", marginBottom: "2rem" }}>
        <h3 style={{ margin: "0 0 1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>Working Hours</h3>
        <p style={{ margin: "0 0 1rem", color: "rgba(255,255,255,0.6)" }}>Define the hours your kitchen is visibly online and accepting incoming orders.</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Kitchen Opens At</label>
            <input 
              type="time" 
              value={settings.operatingHoursOpen} 
              onChange={e => setSettings({...settings, operatingHoursOpen: e.target.value})}
              style={{ width: "100%", padding: "1rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "8px", fontSize: "1.2rem", colorScheme: "dark" }} 
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Kitchen Closes At</label>
            <input 
              type="time" 
              value={settings.operatingHoursClose} 
              onChange={e => setSettings({...settings, operatingHoursClose: e.target.value})}
              style={{ width: "100%", padding: "1rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "8px", fontSize: "1.2rem", colorScheme: "dark" }} 
            />
          </div>
        </div>
      </section>
      
      <section style={{ background: "rgba(255,255,255,0.05)", padding: "2rem", borderRadius: "12px", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h3 style={{ margin: "0 0 0.5rem" }}>Live Store Status</h3>
            <p style={{ margin: "0", color: "rgba(255,255,255,0.6)" }}>Manually pause all incoming requests right now.</p>
          </div>
          <button 
            onClick={() => handleToggle("isAcceptingOrders")}
            style={{ 
              padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer",
              background: settings.isAcceptingOrders ? "#2dd4bf" : "rgba(255,255,255,0.1)",
              color: settings.isAcceptingOrders ? "#1a1026" : "white",
              transition: "all 0.2s ease"
            }}
          >
            {settings.isAcceptingOrders ? "ACCEPTING ORDERS" : "PAUSED"}
          </button>
        </div>
        
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem", display: "grid", gap: "2rem" }}>
          <div>
            <h3 style={{ margin: "0 0 0.5rem" }}>Max Orders Per Time Slot</h3>
            <p style={{ margin: "0 0 1rem", color: "rgba(255,255,255,0.6)" }}>If active orders exceed this number within a rolling hour, capacity is breached.</p>
            <input 
              type="number" 
              value={settings.maxOrdersPerHour} 
              onChange={e => setSettings({...settings, maxOrdersPerHour: parseInt(e.target.value) || 20})}
              style={{ width: "100%", padding: "1rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "8px", fontSize: "1.2rem" }} 
            />
          </div>

          <div>
            <h3 style={{ margin: "0 0 0.5rem" }}>Prep Time Buffer (Minutes)</h3>
            <p style={{ margin: "0 0 1rem", color: "rgba(255,255,255,0.6)" }}>How much extra cushion time to add to each order globally.</p>
            <input 
              type="number" 
              value={settings.prepBufferMinutes} 
              onChange={e => setSettings({...settings, prepBufferMinutes: parseInt(e.target.value) || 15})}
              style={{ width: "100%", padding: "1rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "8px", fontSize: "1.2rem" }} 
            />
          </div>
        </div>
      </section>

      <section style={{ background: settings.autoBuddyScaling ? "rgba(124, 92, 255, 0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${settings.autoBuddyScaling ? "#7C5CFF" : "transparent"}`, padding: "2rem", borderRadius: "12px", marginBottom: "2rem", transition: "all 0.3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ flex: "1 1 300px" }}>
            <h3 style={{ margin: "0 0 0.5rem", color: settings.autoBuddyScaling ? "#d8c5ff" : "white" }}>Auto-Trigger Buddy Pool</h3>
            <p style={{ margin: "0", color: "rgba(255,255,255,0.8)" }}>
              When "Max Orders" is breached, the system will instantly publish an SOS request to nearby available Buddies instead of rejecting customer orders. Scale elastically without manual intervention!
            </p>
          </div>
          <button 
            onClick={() => handleToggle("autoBuddyScaling")}
            style={{ 
              padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer",
              background: settings.autoBuddyScaling ? "#7C5CFF" : "rgba(255,255,255,0.2)",
              color: "white",
              transition: "all 0.2s ease"
            }}
          >
            {settings.autoBuddyScaling ? "ENABLED" : "DISABLED"}
          </button>
        </div>
      </section>

      <button className="primary" style={{ width: "100%", padding: "1rem" }} onClick={() => saveSettingsMutation.mutate(settings)} disabled={saveSettingsMutation.isPending}>
        {saveSettingsMutation.isPending ? "Saving..." : "Save Smart Logic Thresholds"}
      </button>

    </main>
  );
}
