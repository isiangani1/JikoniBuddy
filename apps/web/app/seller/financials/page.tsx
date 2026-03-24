"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function SellerFinancialsPage() {
  const queryClient = useQueryClient();
  const [sellerId, setSellerId] = useState<string | null>(null);

  useEffect(() => {
    setSellerId(localStorage.getItem("jb_session") || "test-seller-1");
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["sellerFinancials", sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const res = await fetch(`/api/seller/financials?sellerId=${sellerId}`);
      if (!res.ok) throw new Error("Failed to load financials");
      return res.json();
    },
    enabled: !!sellerId,
  });

  const payoutMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await fetch(`/api/seller/financials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, amount })
      });
      if (!res.ok) throw new Error("Payout failed");
      return res.json();
    },
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: ["sellerFinancials", sellerId] });
    }
  });

  if (isLoading) return <div style={{ padding: "2rem", color: "white" }}>Syncing with bank node...</div>;

  const payments = data?.payments || [];
  const earnings = data?.earnings || [];
  const totalBalance = data?.totalBalance || 0;
  const pendingBalance = data?.pendingBalance || 0;

  return (
    <main style={{ padding: "1rem" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="eyebrow">Finance & Ledger</p>
          <h1 style={{ margin: "0.2rem 0" }}>Earnings & Payouts</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>Monitor your cash flow and request instant M-Pesa withdrawals.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
           <div style={{ background: "rgba(45,212,191,0.05)", border: "1px solid rgba(45,212,191,0.2)", padding: "1rem", borderRadius: "12px", textAlign: "right" }}>
              <p className="eyebrow" style={{ color: "#2dd4bf" }}>AVAILABLE FOR PAYOUT</p>
              <h2 style={{ margin: 0 }}>KES {totalBalance.toLocaleString()}</h2>
           </div>
           <button 
             className="primary" 
             style={{ background: "#2dd4bf", color: "#1a1026", fontWeight: "bold", padding: "0 2rem" }}
             disabled={totalBalance <= 0 || payoutMutation.isPending}
             onClick={() => payoutMutation.mutate(totalBalance)}
           >
             {payoutMutation.isPending ? "Connecting..." : "Request Payout"}
           </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
        <section style={{ background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Recent M-Pesa Transactions</h3>
          <div style={{ display: "grid", gap: "1rem" }}>
            {payments.map((p: any) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "12px" }}>
                <div>
                  <span style={{ display: "block", fontSize: "0.9rem", fontWeight: "bold" }}>Order #{p.orderId.slice(-6)}</span>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>{new Date(p.createdAt).toLocaleString()} • {p.order.buyer.name}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ display: "block", fontWeight: "bold", color: "#2dd4bf" }}>+KES {p.amount}</span>
                  <span style={{ fontSize: "0.7rem", color: "#2dd4bf", textTransform: "uppercase" }}>{p.status}</span>
                </div>
              </div>
            ))}
            {payments.length === 0 && <p style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.3)" }}>No transactions yet.</p>}
          </div>
        </section>

        <section style={{ background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Payout History</h3>
          <div style={{ display: "grid", gap: "1rem" }}>
             {earnings.filter((e: any) => e.type === "withdrawal").map((e: any) => (
                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div>
                    <span style={{ display: "block", fontSize: "0.9rem", fontWeight: "bold" }}>M-Pesa Withdrawal</span>
                    <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>{new Date(e.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ display: "block", fontWeight: "bold" }}>-KES {e.amount}</span>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>SUCCESS</span>
                  </div>
                </div>
             ))}
             {earnings.filter((e: any) => e.type === "withdrawal").length === 0 && <p style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.3)" }}>No past payouts found.</p>}
          </div>
        </section>
      </div>

      <div style={{ background: "rgba(124, 92, 255, 0.1)", border: "1px solid #7C5CFF", padding: "1.5rem", borderRadius: "16px", display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div style={{ fontSize: "2rem" }}>💡</div>
        <div>
          <h4 style={{ margin: "0 0 0.2rem", color: "#d8c5ff" }}>Pro-Tip: Elastic Payouts</h4>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>Withdrawals under KES 50,000 are processed instantly to your registered M-Pesa number. Larger amounts may take up to 4 hours for AML verification.</p>
        </div>
      </div>
    </main>
  );
}
