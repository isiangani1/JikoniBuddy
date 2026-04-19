"use client";

import { useEffect, useState } from "react";

type AuditRow = {
  id: string;
  actorId: string;
  actorRole?: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  severity: string;
  createdAt: string;
};

export default function AdminAuditPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetch("/api/admin/audit?page=1&pageSize=50")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        setRows(data?.items ?? []);
      })
      .catch(() => null)
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50 m-0">Admin</p>
        <h1 className="text-3xl font-semibold text-white m-0 mt-2">Audit Log</h1>
        <p className="text-white/60 text-sm m-0 mt-2">
          All admin actions are recorded for compliance and traceability.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#12021f]/70 p-6">
        {isLoading ? (
          <p className="text-white/60">Loading audit logs…</p>
        ) : rows.length === 0 ? (
          <p className="text-white/60">No audit logs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/80">
              <thead className="text-xs uppercase text-white/40">
                <tr>
                  <th className="text-left py-2">Time</th>
                  <th className="text-left py-2">Actor</th>
                  <th className="text-left py-2">Action</th>
                  <th className="text-left py-2">Target</th>
                  <th className="text-left py-2">Severity</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-white/5">
                    <td className="py-2">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2">
                      {row.actorId} <span className="text-white/40">({row.actorRole ?? "admin"})</span>
                    </td>
                    <td className="py-2">{row.action}</td>
                    <td className="py-2">
                      {row.targetType ?? "-"} {row.targetId ?? ""}
                    </td>
                    <td className="py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          row.severity === "critical"
                            ? "bg-rose-500/20 text-rose-200"
                            : row.severity === "medium"
                              ? "bg-amber-500/20 text-amber-200"
                              : "bg-emerald-500/20 text-emerald-200"
                        }`}
                      >
                        {row.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
