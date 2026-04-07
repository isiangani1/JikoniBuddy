"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import PayoutMethodModal from "@/components/PayoutMethodModal";

export default function SellerFinancialsPage() {
  const queryClient = useQueryClient();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [isMethodOpen, setIsMethodOpen] = useState(false);

  useEffect(() => {
    const sessionId =
      sessionStorage.getItem("jb_user_id") ||
      sessionStorage.getItem("jb_seller_id") ||
      localStorage.getItem("jb_session") ||
      "test-seller-1";
    setSellerId(sessionId);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["sellerFinancials", sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const walletRes = await fetch(
        `/api/payout/wallet?userId=${sellerId}&type=seller`
      );
      const txRes = await fetch(
        `/api/payout/transactions?userId=${sellerId}&type=seller`
      );
      if (!walletRes.ok || !txRes.ok) {
        throw new Error("Failed to load financials");
      }
      const wallet = await walletRes.json();
      const transactions = await txRes.json();
      return { wallet, transactions };
    },
    enabled: !!sellerId,
  });

  const payoutMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await fetch(`/api/payout/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: sellerId,
          walletType: "seller",
          amount,
          instant: true
        })
      });
      if (!res.ok) throw new Error("Payout failed");
      return res.json();
    },
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: ["sellerFinancials", sellerId] });
    }
  });

  if (isLoading) return <div className="p-8 text-center text-white/50"><p className="animate-pulse">Syncing with bank node...</p></div>;

  const wallet = data?.wallet;
  const transactions = data?.transactions || [];
  const totalBalance = wallet?.balance || 0;
  const pendingBalance = wallet?.pendingBalance || 0;
  const earnings = transactions.filter((t: any) => t.type === "earning");
  const withdrawals = transactions.filter((t: any) => t.type === "withdrawal");

  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-teal-400 font-bold tracking-widest uppercase text-sm m-0">Finance & Ledger</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white m-0">Earnings & Payouts</h1>
          <p className="text-white/60 m-0 text-lg">Monitor your cash flow and request instant M-Pesa withdrawals.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
           <div className="bg-teal-400/5 border border-teal-400/20 px-6 py-4 rounded-2xl flex flex-col sm:items-end flex-grow sm:flex-grow-0">
              <p className="text-teal-400/80 font-bold tracking-widest uppercase text-[10px] m-0 mb-1">Available For Payout</p>
              <h2 className="text-3xl font-extrabold text-white m-0 tracking-tight">KES {totalBalance.toLocaleString()}</h2>
           </div>
           <div className="flex flex-col sm:flex-row gap-3">
             <button 
               className="px-8 py-4 sm:py-0 sm:h-[84px] rounded-2xl bg-teal-400 hover:bg-teal-300 disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed text-[#1a1026] font-extrabold text-lg transition-all shadow-lg shadow-teal-400/20 active:scale-95"
               disabled={totalBalance <= 0 || payoutMutation.isPending}
               onClick={() => payoutMutation.mutate(totalBalance)}
             >
               {payoutMutation.isPending ? "Connecting..." : "Request Payout"}
             </button>
             <button
               className="px-6 py-3 rounded-2xl border border-white/15 bg-white/5 text-white/80 font-semibold hover:bg-white/10 transition-all"
               onClick={() => setIsMethodOpen(true)}
             >
               Update M-Pesa details
             </button>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <section className="bg-white/5 rounded-[24px] p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-teal-400/10 text-teal-400 flex items-center justify-center text-xl">💸</span>
            <h3 className="text-xl font-bold text-white m-0">Recent Inflow</h3>
          </div>
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 max-h-[500px]">
            {earnings.map((p: any) => (
              <div key={p.id} className="flex justify-between items-center bg-black/20 hover:bg-white/5 transition-colors p-4 rounded-xl border border-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-white font-bold text-[15px]">Order #{String(p.reference ?? "").slice(-6)}</span>
                  <span className="text-xs text-white/50 font-medium">
                    {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-teal-400 text-[15px]">+KES {p.amount}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-teal-400/20 bg-teal-400/10 text-teal-400 uppercase tracking-widest">{p.status}</span>
                </div>
              </div>
            ))}
            {earnings.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-white/40 py-12 border-2 border-dashed border-white/10 rounded-xl gap-2">
                <span className="text-3xl opacity-50">🧾</span>
                <p className="m-0 text-sm font-medium">No inflow transactions yet.</p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white/5 rounded-[24px] p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl">🏦</span>
            <h3 className="text-xl font-bold text-white m-0">Payout History</h3>
          </div>
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 max-h-[500px]">
             {withdrawals.map((e: any) => (
                <div key={e.id} className="flex justify-between items-center bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-xl border border-white/5">
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-bold text-[15px]">M-Pesa Withdrawal</span>
                    <span className="text-xs text-white/50 font-medium">{new Date(e.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-bold text-white text-[15px]">-KES {e.amount}</span>
                    <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Success</span>
                  </div>
                </div>
             ))}
             {withdrawals.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-white/40 py-12 border-2 border-dashed border-white/10 rounded-xl gap-2">
                  <span className="text-3xl opacity-50">🏧</span>
                  <p className="m-0 text-sm font-medium">No past payouts found.</p>
                </div>
             )}
          </div>
        </section>
      </div>

      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-xl shadow-purple-900/20">
        <div className="w-14 h-14 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-2xl flex-shrink-0 animate-pulse border border-purple-500/30">💡</div>
        <div className="flex flex-col gap-1">
          <h4 className="m-0 text-purple-200 font-bold text-lg">Pro-Tip: Elastic Payouts</h4>
          <p className="m-0 text-sm text-purple-200/70 leading-relaxed font-medium">Withdrawals under <strong className="text-purple-300">KES 50,000</strong> are processed instantly to your registered M-Pesa number. Larger amounts may take up to 4 hours for AML verification.</p>
        </div>
      </div>
      <PayoutMethodModal
        isOpen={isMethodOpen}
        onClose={() => setIsMethodOpen(false)}
        userId={sellerId}
        roleLabel="Seller"
      />
    </main>
  );
}
