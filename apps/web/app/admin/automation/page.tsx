"use client";

import { useEffect, useMemo, useState } from "react";

type AutomationRule = {
  id: string;
  name: string;
  description?: string | null;
  triggerType: string;
  actionType: string;
  enabled: boolean;
  approvalRequired: boolean;
  threshold?: number | null;
};

type AutomationExecution = {
  id: string;
  triggerType: string;
  actionType: string;
  referenceId?: string | null;
  status: string;
  severity: string;
  reason?: string | null;
  createdAt: string;
  approvedBy?: string | null;
  rule?: { name: string } | null;
};

const triggerPresets = [
  {
    triggerType: "order_stalled",
    label: "Order stalled",
    reason: "Order #JB-441 stalled for 12 minutes with no buddy movement.",
    severity: "critical"
  },
  {
    triggerType: "seller_overloaded",
    label: "Seller overloaded",
    reason: "Seller Kitchen A hit 92% load and backlog is rising.",
    severity: "medium"
  },
  {
    triggerType: "fraud_detected",
    label: "Fraud signal",
    reason: "GPS spoofing and repeated cancellations pushed risk above threshold.",
    severity: "critical"
  }
] as const;

function getActorId() {
  if (typeof window === "undefined") return "admin";
  return sessionStorage.getItem("jb_user_id") ?? "admin";
}

export default function AdminAutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const pendingApprovals = useMemo(
    () => executions.filter((execution) => execution.status === "pending_approval"),
    [executions]
  );

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    Promise.all([fetch("/api/admin/automation/rules"), fetch("/api/admin/automation")])
      .then(async ([rulesRes, execRes]) => {
        const rulesData = rulesRes.ok ? await rulesRes.json() : [];
        const execData = execRes.ok ? await execRes.json() : [];
        if (!active) return;
        setRules(rulesData ?? []);
        setExecutions(execData ?? []);
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

  async function updateRule(rule: AutomationRule, update: Partial<AutomationRule>) {
    const res = await fetch("/api/admin/automation/rules", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: rule.id, ...update })
    });
    if (!res.ok) return;
    setRules((prev) =>
      prev.map((item) => (item.id === rule.id ? { ...item, ...update } : item))
    );
  }

  async function simulateTrigger(triggerType: string, reason: string, severity: string) {
    setFeedback("Running automation...");
    const referenceId = window.prompt("Reference ID for this trigger", "");
    const res = await fetch("/api/admin/automation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        triggerType,
        referenceId: referenceId || undefined,
        reason,
        severity,
        payload: {
          source: "admin_portal_simulation"
        }
      })
    });
    if (!res.ok) {
      setFeedback("Automation trigger failed.");
      return;
    }
    const execution = (await res.json()) as AutomationExecution;
    setExecutions((prev) => [execution, ...prev]);
    setFeedback(`Trigger created: ${execution.actionType}`);
  }

  async function approveExecution(executionId: string) {
    const res = await fetch(`/api/admin/automation/${executionId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actorId: getActorId() })
    });
    if (!res.ok) return;
    const updated = (await res.json()) as AutomationExecution;
    setExecutions((prev) =>
      prev.map((item) => (item.id === executionId ? updated : item))
    );
  }

  async function cancelExecution(executionId: string) {
    const note = window.prompt("Override note", "Manual override by admin");
    const res = await fetch(`/api/admin/automation/${executionId}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actorId: getActorId(), note: note ?? undefined })
    });
    if (!res.ok) return;
    const updated = (await res.json()) as AutomationExecution;
    setExecutions((prev) =>
      prev.map((item) => (item.id === executionId ? updated : item))
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50 m-0">Automated Actions</p>
        <h1 className="text-3xl font-semibold text-white m-0 mt-2">Auto Ops Supervisor</h1>
        <p className="text-white/60 text-sm m-0 mt-2">
          Trigger and supervise automation for stalled orders, overloaded sellers, and fraud signals.
        </p>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-semibold text-white m-0">Automation Rules</h2>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
              {pendingApprovals.length} pending approvals
            </span>
          </div>

          {isLoading ? (
            <p className="text-white/60">Loading rules…</p>
          ) : (
            <div className="flex flex-col gap-4">
              {rules.map((rule) => (
                <div key={rule.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white m-0">{rule.name}</h3>
                      <p className="text-white/50 text-sm m-0 mt-1">{rule.description}</p>
                      <p className="text-white/40 text-xs m-0 mt-2">
                        {rule.triggerType} {"->"} {rule.actionType}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          rule.enabled
                            ? "bg-emerald-500/20 text-emerald-200"
                            : "bg-white/10 text-white/50"
                        }`}
                        onClick={() => updateRule(rule, { enabled: !rule.enabled })}
                        type="button"
                      >
                        {rule.enabled ? "Enabled" : "Disabled"}
                      </button>
                      <button
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          rule.approvalRequired
                            ? "bg-amber-500/20 text-amber-200"
                            : "bg-white/10 text-white/60"
                        }`}
                        onClick={() =>
                          updateRule(rule, { approvalRequired: !rule.approvalRequired })
                        }
                        type="button"
                      >
                        {rule.approvalRequired ? "Approval Required" : "Auto Execute"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <label className="text-xs text-white/50">
                      Threshold
                    </label>
                    <input
                      type="number"
                      className="w-32 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                      value={rule.threshold ?? 0}
                      onChange={(event) =>
                        updateRule(rule, { threshold: Number(event.target.value) })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-white m-0">Trigger Simulation</h2>
          <div className="flex flex-col gap-3">
            {triggerPresets.map((preset) => (
              <button
                key={preset.triggerType}
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-left text-white hover:bg-black/30"
                onClick={() =>
                  simulateTrigger(preset.triggerType, preset.reason, preset.severity)
                }
                type="button"
              >
                <span className="block font-semibold">{preset.label}</span>
                <span className="block text-sm text-white/50 mt-1">{preset.reason}</span>
              </button>
            ))}
          </div>
          {feedback ? <p className="text-sm text-white/60 m-0">{feedback}</p> : null}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white m-0">Execution Queue</h2>
        {isLoading ? (
          <p className="text-white/60">Loading executions…</p>
        ) : executions.length === 0 ? (
          <p className="text-white/60">No automation executions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/80">
              <thead className="text-xs uppercase text-white/40">
                <tr>
                  <th className="text-left py-2">Created</th>
                  <th className="text-left py-2">Rule</th>
                  <th className="text-left py-2">Reference</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {executions.map((execution) => (
                  <tr key={execution.id} className="border-t border-white/5">
                    <td className="py-3">{new Date(execution.createdAt).toLocaleString()}</td>
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span>{execution.rule?.name ?? execution.actionType}</span>
                        <span className="text-xs text-white/40">{execution.triggerType}</span>
                      </div>
                    </td>
                    <td className="py-3">{execution.referenceId ?? "-"}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          execution.status === "executed"
                            ? "bg-emerald-500/20 text-emerald-200"
                            : execution.status === "pending_approval"
                              ? "bg-amber-500/20 text-amber-200"
                              : execution.status === "cancelled"
                                ? "bg-rose-500/20 text-rose-200"
                                : "bg-white/10 text-white/60"
                        }`}
                      >
                        {execution.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {execution.status === "pending_approval" ? (
                        <div className="flex gap-2">
                          <button
                            className="rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200"
                            onClick={() => approveExecution(execution.id)}
                            type="button"
                          >
                            Approve
                          </button>
                          <button
                            className="rounded-lg bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-200"
                            onClick={() => cancelExecution(execution.id)}
                            type="button"
                          >
                            Override
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-white/40">
                          {execution.approvedBy ? `by ${execution.approvedBy}` : "system"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
