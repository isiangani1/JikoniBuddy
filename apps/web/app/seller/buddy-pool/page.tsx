"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function SellerBuddyPoolPage() {
  const queryClient = useQueryClient();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [sosForm, setSosForm] = useState({
    task: "",
    startTime: "",
    endTime: "",
    location: "Main Kitchen",
    budget: "1000"
  });

  // Rating Modal State
  const [ratingModal, setRatingModal] = useState<{ isOpen: boolean; assignmentId: string; helperId: string; helperName: string } | null>(null);
  const [ratingData, setRatingData] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    setSellerId(localStorage.getItem("jb_session") || "test-seller-1");
  }, []);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["sellerBuddyRequests", sellerId],
    queryFn: async () => {
      if (!sellerId) return [];
      const res = await fetch(`/api/seller/buddy-pool?sellerId=${sellerId}`);
      if (!res.ok) throw new Error("Failed to fetch requests");
      return res.json();
    },
    enabled: !!sellerId,
    refetchInterval: 5000 // Poll for new applications every 5s
  });

  const createSOSMutation = useMutation({
    mutationFn: async (data: typeof sosForm) => {
      const res = await fetch(`/api/seller/buddy-pool?sellerId=${sellerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to broadcast SOS");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerBuddyRequests", sellerId] });
      setIsSOSModalOpen(false);
      setSosForm({ task: "", startTime: "", endTime: "", location: "Main Kitchen", budget: "1000" });
    }
  });

  const assignBuddyMutation = useMutation({
    mutationFn: async ({ requestId, applicationId, helperId }: { requestId: string; applicationId: string; helperId: string }) => {
      const res = await fetch(`/api/seller/buddy-pool/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, applicationId, helperId })
      });
      if (!res.ok) throw new Error("Failed to assign buddy");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerBuddyRequests", sellerId] });
    }
  });

  const completeAssignmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/seller/buddy-pool/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sellerId })
      });
      if (!res.ok) throw new Error("Failed to complete assignment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerBuddyRequests", sellerId] });
      setRatingModal(null);
      setRatingData({ rating: 5, comment: "" });
    }
  });

  if (isLoading) return <div style={{ padding: "2rem", color: "white" }}>Syncing with Buddy Network...</div>;

  const openRequests = requests.filter((r: any) => r.status === "open" || r.status === "assigned");
  const completedRequests = requests.filter((r: any) => r.status === "completed");

  return (
    <main style={{ padding: "1rem" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">On-Demand Human Capital</p>
          <h1 style={{ margin: "0.2rem 0" }}>Buddy Pool Management</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>Scale your kitchen staff elastically in real-time.</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" style={{ background: "#7C5CFF" }} onClick={() => setIsSOSModalOpen(true)}>
          🚨 Broadcast SOS Request
        </button>
      </header>

      <section style={{ marginBottom: "3rem" }}>
        <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2dd4bf" }}></span>
          Active SOS & Applications
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "1.5rem" }}>
          {openRequests.map((req: any) => (
            <div key={req.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", background: req.status === "assigned" ? "rgba(45,212,191,0.05)" : "transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <h4 style={{ margin: 0 }}>{req.task}</h4>
                  <span style={{ 
                    fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase", padding: "0.3rem 0.6rem", borderRadius: "4px",
                    background: req.status === "assigned" ? "rgba(45,212,191,0.2)" : "rgba(124, 92, 255, 0.2)",
                    color: req.status === "assigned" ? "#2dd4bf" : "#d8c5ff"
                  }}>
                    {req.status}
                  </span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", display: "grid", gap: "0.3rem" }}>
                  <span>📍 {req.location}</span>
                  <span>⏱️ {new Date(req.startTime).toLocaleTimeString()} - {new Date(req.endTime).toLocaleTimeString()}</span>
                  <span style={{ color: "#2dd4bf", fontWeight: "bold" }}>Budget: KES {req.budget}</span>
                </div>
              </div>

              <div style={{ padding: "1.2rem" }}>
                {req.status === "open" && (
                  <>
                    <p style={{ margin: "0 0 1rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>Applications ({req.applications?.length || 0})</p>
                    <div style={{ display: "grid", gap: "0.8rem" }}>
                      {req.applications?.map((app: any) => (
                        <div key={app.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "0.8rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#7C5CFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "bold" }}>
                              {app.helper.user.name[0]}
                            </div>
                            <div>
                              <span style={{ display: "block", fontSize: "0.9rem", fontWeight: "bold" }}>{app.helper.user.name}</span>
                              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>⭐ 4.9 (24 jobs)</span>
                            </div>
                          </div>
                          <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }} onClick={() => assignBuddyMutation.mutate({ requestId: req.id, applicationId: app.id, helperId: app.helperId })}>
                            Hire
                          </button>
                        </div>
                      ))}
                      {!req.applications?.length && <p style={{ textAlign: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", padding: "1rem 0" }}>Searching network for Buddies...</p>}
                    </div>
                  </>
                )}

                {req.status === "assigned" && (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>Active Helper</p>
                    {req.assignments?.filter((a: any) => a.status === "active").map((asgn: any) => (
                      <div key={asgn.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(45,212,191,0.1)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(45,212,191,0.2)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#2dd4bf", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#1a1026" }}>
                            {asgn.helper.user.name[0]}
                          </div>
                          <div>
                            <span style={{ display: "block", fontWeight: "bold" }}>{asgn.helper.user.name}</span>
                            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>In your kitchen now</span>
                          </div>
                        </div>
                        <button 
                          className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" 
                          style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "0.5rem 1rem", borderRadius: "6px" }}
                          onClick={() => setRatingModal({ isOpen: true, assignmentId: asgn.id, helperId: asgn.helperId, helperName: asgn.helper.user.name })}
                        >
                          Finish & Rate
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {openRequests.length === 0 && (
            <div style={{ gridColumn: "1/-1", padding: "4rem 2rem", background: "rgba(255,255,255,0.03)", borderRadius: "16px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>
               <p style={{ color: "rgba(255,255,255,0.4)", margin: 0 }}>No active help requests. Your kitchen is running at set capacity.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: "1.5rem", color: "rgba(255,255,255,0.6)" }}>Assignment History</h3>
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", textTransform: "uppercase" }}>
                <th style={{ padding: "1rem" }}>Date</th>
                <th style={{ padding: "1rem" }}>Helper</th>
                <th style={{ padding: "1rem" }}>Task</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Payout</th>
              </tr>
            </thead>
            <tbody>
              {completedRequests.map((req: any) => (
                <tr key={req.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "1rem", fontSize: "0.9rem" }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem" }}>
                    {req.assignments?.[0]?.helper.user.name || "N/A"}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.9rem" }}>{req.task}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.1)", padding: "0.2rem 0.5rem", borderRadius: "4px", color: "rgba(255,255,255,0.6)" }}>COMPLETED</span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right", fontWeight: "bold", color: "#2dd4bf" }}>KES {req.budget}</td>
                </tr>
              ))}
              {completedRequests.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No past assignments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SOS Modal */}
      {isSOSModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}>
          <div style={{ background: "#1a1026", borderRadius: "24px", width: "100%", maxWidth: "500px", border: "1px solid rgba(124, 92, 255, 0.3)", padding: "2rem", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            <h2 style={{ margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <span style={{ animation: "pulse 1.5s infinite" }}>🚨</span> Broadcast SOS Request
            </h2>
            <div style={{ display: "grid", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.4rem" }}>What do you need help with? *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dishwashing support, Peak hour delivery help" 
                  value={sosForm.task}
                  onChange={e => setSosForm({...sosForm, task: e.target.value})}
                  style={{ width: "100%", padding: "1rem", borderRadius: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.4rem" }}>Start Time</label>
                  <input 
                    type="datetime-local" 
                    value={sosForm.startTime}
                    onChange={e => setSosForm({...sosForm, startTime: e.target.value})}
                    style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white", colorScheme: "dark" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.4rem" }}>End Time</label>
                  <input 
                    type="datetime-local" 
                    value={sosForm.endTime}
                    onChange={e => setSosForm({...sosForm, endTime: e.target.value})}
                    style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white", colorScheme: "dark" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.4rem" }}>Location / Station</label>
                  <input 
                    type="text" 
                    value={sosForm.location}
                    onChange={e => setSosForm({...sosForm, location: e.target.value})}
                    style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.4rem" }}>Payout (KES)</label>
                  <input 
                    type="number" 
                    value={sosForm.budget}
                    onChange={e => setSosForm({...sosForm, budget: e.target.value})}
                    style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button 
                  className="base" 
                  style={{ flex: 1, background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", padding: "1rem", borderRadius: "12px" }}
                  onClick={() => setIsSOSModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" 
                  style={{ flex: 1, padding: "1rem", borderRadius: "12px" }}
                  onClick={() => createSOSMutation.mutate(sosForm)}
                  disabled={createSOSMutation.isPending}
                >
                  {createSOSMutation.isPending ? "Syncing..." : "Broadcast SOS"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal?.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "1rem" }}>
          <div style={{ background: "#1a1026", borderRadius: "24px", width: "100%", maxWidth: "450px", border: "1px solid rgba(45, 212, 191, 0.3)", padding: "2.5rem", textAlign: "center" }}>
            <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#2dd4bf", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.5rem", fontWeight: "bold", color: "#1a1026" }}>
              {ratingModal.helperName[0]}
            </div>
            <h2 style={{ margin: "0 0 0.5rem" }}>Rate {ratingModal.helperName}</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "2rem" }}>How was the quality of support provided by your Buddy today?</p>
            
            <div style={{ display: "flex", justifyContent: "center", gap: "0.8rem", marginBottom: "2rem" }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setRatingData({...ratingData, rating: star})}
                  style={{ background: "transparent", border: "none", fontSize: "2rem", cursor: "pointer", color: star <= ratingData.rating ? "#F7C948" : "rgba(255,255,255,0.1)" }}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea 
              placeholder="Leave a comment about their performance..." 
              value={ratingData.comment}
              onChange={e => setRatingData({...ratingData, comment: e.target.value})}
              style={{ width: "100%", padding: "1rem", borderRadius: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white", marginBottom: "2rem", resize: "none" }}
              rows={3}
            />

            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                className="base" 
                style={{ flex: 1, background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", padding: "1rem", borderRadius: "12px" }}
                onClick={() => setRatingModal(null)}
              >
                Skip
              </button>
              <button 
                className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" 
                style={{ flex: 1, background: "#2dd4bf", color: "#1a1026", padding: "1rem", borderRadius: "12px" }}
                onClick={() => completeAssignmentMutation.mutate({ assignmentId: ratingModal.assignmentId, helperId: ratingModal.helperId, ...ratingData })}
                disabled={completeAssignmentMutation.isPending}
              >
                {completeAssignmentMutation.isPending ? "Submitting..." : "Complete & Pay"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
