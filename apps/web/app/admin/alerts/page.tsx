"use client";

import { useEffect, useMemo, useState } from "react";

type AlertRule = {
  id: string;
  name: string;
  description?: string | null;
  metric: string;
  comparison: string;
  threshold: number;
  severity: string;
  enabled: boolean;
};

type AlertEvent = {
  id: string;
  title: string;
  message: string;
  severity: string;
  status: string;
  createdAt: string;
};

export default function AdminAlertsPage() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [events, setEvents] = useState<AlertEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminRole, setAdminRole] = useState<string>("ops");

  const severityFilter = useMemo(() => {
    if (adminRole === "finance") return ["critical", "medium"];
    if (adminRole === "support") return ["medium", "low"];
    if (adminRole === "content") return ["low"];
    return ["critical", "medium", "low"];
  }, [adminRole]);

  useEffect(() => {
    const stored = sessionStorage.getItem("jb_admin_role");
    if (stored) setAdminRole(stored);
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    const severityQuery = severityFilter.join(",");
    Promise.all([
      fetch("/api/admin/alerts/rules"),
      fetch(`/api/admin/alerts?status=open&severity=${encodeURIComponent(severityQuery)}`)
    ])
      .then(async ([rulesRes, eventsRes]) => {
        const rulesData = rulesRes.ok ? await rulesRes.json() : [];
        const eventsData = eventsRes.ok ? await eventsRes.json() : [];
        if (!active) return;
        setRules(rulesData ?? []);
        setEvents(eventsData ?? []);
      })
      .catch(() => null)
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [severityFilter]);

  const updateRule = async (rule: AlertRule, update: Partial<AlertRule>) => {
    const res = await fetch("/api/admin/alerts/rules", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: rule.id, ...update })
    });
    if (!res.ok) return;
    setRules((prev) =>
      prev.map((item) => (item.id === rule.id ? { ...item, ...update } : item))
    );
  };

  const acknowledge = async (eventId: string) => {
    const res = await fetch(`/api/admin/alerts/${eventId}/ack`, { method: "POST" });
    if (!res.ok) return;
    setEvents((prev) => prev.filter((item) => item.id !== eventId));
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50 m-0">Smart Alerts Engine</p>
        <h1 className="text-3xl font-semibold text-white m-0 mt-2">Alerts & Rules</h1>
        <p className="text-white/60 text-sm m-0 mt-2">
          Configure thresholds and review real‑time system alerts.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-white m-0">Alert Rules</h2>
          {isLoading ? (
            <p className="text-white/60">Loading rules…</p>
          ) : rules.length === 0 ? (
            <p className="text-white/60">No rules configured.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {rules.map((rule) => (
                <div key={rule.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white m-0">{rule.name}</h3>
                      <p className="text-white/50 text-sm m-0 mt-1">{rule.description}</p>
                      <p className="text-white/40 text-xs m-0 mt-2">
                        Metric: {rule.metric} {rule.comparison} {rule.threshold}
                      </p>
                    </div>
                    <button
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        rule.enabled
                          ? "bg-emerald-500/20 text-emerald-200"
                          : "bg-white/10 text-white/50"
                      }`}
                      type="button"
                      onClick={() => updateRule(rule, { enabled: !rule.enabled })}
                    >
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex flex-col gap-1 text-xs text-white/50">
                      Threshold
                      <input
                        type="number"
                        value={rule.threshold}
                        onChange={(event) =>
                          updateRule(rule, { threshold: Number(event.target.value) })
                        }
                        className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-white/50">
                      Severity
                      <select
                        value={rule.severity}
                        onChange={(event) =>
                          updateRule(rule, { severity: event.target.value })
                        }
                        className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="critical">Critical</option>
                      </select>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-white m-0">Live Alerts</h2>
          {isLoading ? (
            <p className="text-white/60">Loading alerts…</p>
          ) : events.length === 0 ? (
            <p className="text-white/60">No active alerts.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {events.map((event) => (
                <li key={event.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-semibold m-0">{event.title}</p>
                      <p className="text-white/50 text-sm m-0 mt-1">{event.message}</p>
                      <p className="text-white/40 text-xs m-0 mt-2">
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          event.severity === "critical"
                            ? "bg-rose-500/20 text-rose-200"
                            : event.severity === "medium"
                              ? "bg-amber-500/20 text-amber-200"
                              : "bg-emerald-500/20 text-emerald-200"
                        }`}
                      >
                        {event.severity}
                      </span>
                      <button
                        className="text-xs text-white/60 hover:text-white"
                        onClick={() => acknowledge(event.id)}
                        type="button"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
