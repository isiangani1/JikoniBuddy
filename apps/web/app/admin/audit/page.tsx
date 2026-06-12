"use client";

import { useEffect, useMemo, useState } from "react";

type AuditRow = {
  id: string;
  actorId: string;
  actorRole?: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  severity: string;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
};

type AuditResponse = {
  page: number;
  pageSize: number;
  total: number;
  items: AuditRow[];
};

type Filters = {
  q: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  severity: string;
  dateFrom: string;
  dateTo: string;
};

const initialFilters: Filters = {
  q: "",
  actorRole: "",
  action: "",
  targetType: "",
  targetId: "",
  severity: "",
  dateFrom: "",
  dateTo: ""
};

function buildQuery(filters: Filters, page: number, pageSize: number) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  return params.toString();
}

export default function AdminAuditPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetch(`/api/admin/audit?${buildQuery(filters, page, pageSize)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AuditResponse | null) => {
        if (!active) return;
        setRows(data?.items ?? []);
        setTotal(data?.total ?? 0);
      })
      .catch(() => null)
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters, page, pageSize]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [pageSize, total]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setPage(1);
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const exportCsv = async () => {
    const response = await fetch(`/api/admin/audit/export?${buildQuery(filters, 1, 1000)}`);
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jb-admin-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="m-0 text-xs uppercase tracking-[0.2em] text-white/50">Phase 11</p>
            <h1 className="m-0 mt-2 text-3xl font-semibold text-white">Audit Log</h1>
            <p className="m-0 mt-2 text-sm text-white/60">
              Search, filter, and export the full admin action trail for compliance and investigations.
            </p>
          </div>
          <button
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"
            onClick={exportCsv}
            type="button"
          >
            Export CSV
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm text-white/70">
          Search
          <input
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
            onChange={(event) => updateFilter("q", event.target.value)}
            placeholder="actor, action, target"
            value={filters.q}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          Actor role
          <input
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
            onChange={(event) => updateFilter("actorRole", event.target.value)}
            value={filters.actorRole}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          Action
          <input
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
            onChange={(event) => updateFilter("action", event.target.value)}
            value={filters.action}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          Severity
          <select
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
            onChange={(event) => updateFilter("severity", event.target.value)}
            value={filters.severity}
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="critical">Critical</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          Target type
          <input
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
            onChange={(event) => updateFilter("targetType", event.target.value)}
            value={filters.targetType}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          Target ID
          <input
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
            onChange={(event) => updateFilter("targetId", event.target.value)}
            value={filters.targetId}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          From
          <input
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
            onChange={(event) => updateFilter("dateFrom", event.target.value)}
            type="date"
            value={filters.dateFrom}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          To
          <input
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
            onChange={(event) => updateFilter("dateTo", event.target.value)}
            type="date"
            value={filters.dateTo}
          />
        </label>
      </section>

      <div className="rounded-2xl border border-white/10 bg-[#12021f]/70 p-6">
        {isLoading ? (
          <p className="text-white/60">Loading audit logs…</p>
        ) : rows.length === 0 ? (
          <p className="text-white/60">No audit logs match the current filters.</p>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-3 text-sm text-white/60">
              <span>{total.toLocaleString()} records found</span>
              <span>
                Page {page} of {totalPages}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/80">
                <thead className="text-xs uppercase text-white/40">
                  <tr>
                    <th className="py-2 text-left">Time</th>
                    <th className="py-2 text-left">Actor</th>
                    <th className="py-2 text-left">Action</th>
                    <th className="py-2 text-left">Target</th>
                    <th className="py-2 text-left">Severity</th>
                    <th className="py-2 text-left">Metadata</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t border-white/5 align-top">
                      <td className="py-3">{new Date(row.createdAt).toLocaleString()}</td>
                      <td className="py-3">
                        {row.actorId}
                        <div className="text-xs text-white/40">{row.actorRole ?? "admin"}</div>
                      </td>
                      <td className="py-3">{row.action}</td>
                      <td className="py-3">
                        {row.targetType ?? "-"}
                        <div className="text-xs text-white/40">{row.targetId ?? "—"}</div>
                      </td>
                      <td className="py-3">
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
                      <td className="py-3 text-xs text-white/55">
                        <pre className="whitespace-pre-wrap break-words font-mono">
                          {JSON.stringify(row.metadata ?? {}, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white disabled:opacity-40"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
              >
                Previous
              </button>
              <button
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white disabled:opacity-40"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                type="button"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
