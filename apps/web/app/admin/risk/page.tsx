"use client";

import { useEffect, useState } from "react";

type RiskRow = {
  user: {
    id: string;
    role: string;
    name?: string | null;
    displayName?: string | null;
    email: string;
  };
  score: number;
  severity: string;
  factors: {
    cancellations: number;
    gpsAnomalies: number;
    paymentAnomalies: number;
    reasons: string[];
  };
};

type UserRisk = {
  user: RiskRow["user"];
  score: number;
  severity: string;
  factors: RiskRow["factors"];
  history: Array<{ id: string; score: number; createdAt: string }>;
};

function severityClasses(severity: string) {
  if (severity === "high") return "bg-rose-500/20 text-rose-200";
  if (severity === "medium") return "bg-amber-500/20 text-amber-200";
  return "bg-emerald-500/20 text-emerald-200";
}

export default function AdminRiskPage() {
  const [items, setItems] = useState<RiskRow[]>([]);
  const [selected, setSelected] = useState<UserRisk | null>(null);
  const [severity, setSeverity] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();
    if (severity) params.set("severity", severity);
    if (role) params.set("role", role);

    fetch(`/api/admin/risk?${params.toString()}`)
      .then(async (res) => (res.ok ? ((await res.json()) as RiskRow[]) : []))
      .then((data) => {
        if (!active) return;
        setItems(data ?? []);
        const first = data?.[0];
        if (first) {
          return fetch(`/api/admin/risk/${first.user.id}`)
            .then(async (res) => (res.ok ? ((await res.json()) as UserRisk) : null))
            .then((detail) => {
              if (!active) return;
              setSelected(detail);
            });
        }
        setSelected(null);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
        setSelected(null);
      });

    return () => {
      active = false;
    };
  }, [severity, role]);

  async function loadUser(id: string) {
    const res = await fetch(`/api/admin/risk/${id}`);
    if (!res.ok) return;
    setSelected((await res.json()) as UserRisk);
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="m-0 text-xs uppercase tracking-[0.2em] text-white/50">Phase 5</p>
        <h1 className="m-0 mt-2 text-3xl font-semibold text-white">Fraud & Risk Scoring</h1>
        <p className="m-0 mt-2 text-sm text-white/60">
          Review risk signals across cancellations, GPS anomalies, and payment behavior.
        </p>
      </header>

      <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
        <select
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"
          onChange={(event) => setSeverity(event.target.value)}
          value={severity}
        >
          <option value="">All severities</option>
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
        <select
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"
          onChange={(event) => setRole(event.target.value)}
          value={role}
        >
          <option value="">All roles</option>
          <option value="buyer">buyer</option>
          <option value="seller">seller</option>
          <option value="buddy">buddy</option>
        </select>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="m-0 text-xl font-semibold text-white">Risk Queue</h2>
          <div className="mt-4 flex flex-col gap-3">
            {items.length === 0 ? (
              <p className="m-0 text-sm text-white/50">No users match the selected filters.</p>
            ) : (
              items.map((item) => (
                <button
                  key={item.user.id}
                  className="rounded-xl border border-white/10 bg-black/20 p-4 text-left"
                  onClick={() => loadUser(item.user.id)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-white">
                      {item.user.displayName ?? item.user.name ?? item.user.email}
                    </strong>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityClasses(item.severity)}`}>
                      {item.score}
                    </span>
                  </div>
                  <p className="m-0 mt-2 text-xs uppercase tracking-widest text-white/40">
                    {item.user.role}
                  </p>
                  <p className="m-0 mt-2 text-sm text-white/60">
                    Cancels {item.factors.cancellations} · GPS {item.factors.gpsAnomalies} · Payments {item.factors.paymentAnomalies}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          {!selected ? (
            <p className="m-0 text-sm text-white/50">Select a user to inspect their risk profile.</p>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="m-0 text-2xl font-semibold text-white">
                    {selected.user.displayName ?? selected.user.name ?? selected.user.email}
                  </h2>
                  <p className="m-0 mt-2 text-sm text-white/60">{selected.user.email}</p>
                </div>
                <span className={`rounded-full px-4 py-2 text-sm font-semibold ${severityClasses(selected.severity)}`}>
                  Score {selected.score}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="m-0 text-xs uppercase tracking-widest text-white/40">Cancellations</p>
                  <p className="m-0 mt-2 text-2xl font-semibold text-white">{selected.factors.cancellations}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="m-0 text-xs uppercase tracking-widest text-white/40">GPS anomalies</p>
                  <p className="m-0 mt-2 text-2xl font-semibold text-white">{selected.factors.gpsAnomalies}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="m-0 text-xs uppercase tracking-widest text-white/40">Payment anomalies</p>
                  <p className="m-0 mt-2 text-2xl font-semibold text-white">{selected.factors.paymentAnomalies}</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <h3 className="m-0 text-lg font-semibold text-white">Risk reasons</h3>
                <div className="mt-3 space-y-2">
                  {selected.factors.reasons.length === 0 ? (
                    <p className="m-0 text-sm text-white/50">No active risk reasons.</p>
                  ) : (
                    selected.factors.reasons.map((reason) => (
                      <p key={reason} className="m-0 text-sm text-white/70">
                        {reason}
                      </p>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <h3 className="m-0 text-lg font-semibold text-white">Risk history</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selected.history.map((point) => (
                    <span
                      key={point.id}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70"
                    >
                      {new Date(point.createdAt).toLocaleDateString()} · {point.score}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
