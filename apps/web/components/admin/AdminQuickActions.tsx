"use client";

import { useMemo, useState } from "react";

type ActionKey = "refund-order" | "reassign-buddy" | "credit-wallet" | "freeze-user";

type ActionState = {
  orderId: string;
  amount: string;
  note: string;
  newBuddyId: string;
  userId: string;
  walletType: "seller" | "buddy";
};

const initialState: ActionState = {
  orderId: "",
  amount: "",
  note: "",
  newBuddyId: "",
  userId: "",
  walletType: "seller"
};

const getActorId = () =>
  typeof window !== "undefined" ? sessionStorage.getItem("jb_user_id") ?? "admin" : "admin";

const getActorRole = () =>
  typeof window !== "undefined" ? sessionStorage.getItem("jb_admin_role") ?? "ops" : "ops";

async function runAdminAction(action: ActionKey, payload: Record<string, unknown>) {
  const response = await fetch(`/api/admin/actions/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actorId: getActorId(),
      actorRole: getActorRole(),
      ...payload
    })
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(body?.message ?? body?.error ?? "Action failed.");
  }

  return body;
}

export default function AdminQuickActions() {
  const [selectedAction, setSelectedAction] = useState<ActionKey>("refund-order");
  const [form, setForm] = useState<ActionState>(initialState);
  const [status, setStatus] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const actionMeta = useMemo(
    () => ({
      "refund-order": {
        title: "Refund order",
        description: "Issue a refund immediately and write the workflow trail for finance/support.",
        accent:
          "border-amber-500/30 bg-amber-500/10 text-amber-100"
      },
      "reassign-buddy": {
        title: "Reassign buddy",
        description: "Move an order to a replacement buddy and preserve the order/buddy audit trail.",
        accent:
          "border-sky-500/30 bg-sky-500/10 text-sky-100"
      },
      "credit-wallet": {
        title: "Credit wallet",
        description: "Apply a manual adjustment directly to a buddy or seller wallet.",
        accent:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
      },
      "freeze-user": {
        title: "Freeze user",
        description: "Suspend the account immediately and cut availability for active marketplace operations.",
        accent:
          "border-rose-500/30 bg-rose-500/10 text-rose-100"
      }
    }),
    []
  );

  const updateField = <K extends keyof ActionState>(key: K, value: ActionState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async () => {
    setStatus(null);
    setIsWorking(true);
    try {
      if (selectedAction === "refund-order") {
        if (!form.orderId.trim()) throw new Error("Order ID is required.");
        await runAdminAction("refund-order", {
          orderId: form.orderId.trim(),
          amount: form.amount ? Number(form.amount) : undefined,
          note: form.note.trim() || undefined
        });
        setStatus(`Refund completed for order ${form.orderId.trim()}.`);
      }

      if (selectedAction === "reassign-buddy") {
        if (!form.orderId.trim() || !form.newBuddyId.trim()) {
          throw new Error("Order ID and replacement buddy ID are required.");
        }
        await runAdminAction("reassign-buddy", {
          orderId: form.orderId.trim(),
          newBuddyId: form.newBuddyId.trim(),
          note: form.note.trim() || undefined
        });
        setStatus(`Buddy reassigned on order ${form.orderId.trim()}.`);
      }

      if (selectedAction === "credit-wallet") {
        if (!form.userId.trim() || !form.amount) {
          throw new Error("User ID and amount are required.");
        }
        await runAdminAction("credit-wallet", {
          userId: form.userId.trim(),
          walletType: form.walletType,
          amount: Number(form.amount),
          note: form.note.trim() || undefined
        });
        setStatus(`Wallet credited for user ${form.userId.trim()}.`);
      }

      if (selectedAction === "freeze-user") {
        if (!form.userId.trim()) throw new Error("User ID is required.");
        await runAdminAction("freeze-user", {
          userId: form.userId.trim(),
          note: form.note.trim() || undefined
        });
        setStatus(`User ${form.userId.trim()} has been frozen.`);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="m-0 text-xs uppercase tracking-[0.2em] text-white/50">Quick Actions</p>
        <h3 className="m-0 mt-1 text-lg font-semibold text-white">Internal tools</h3>
        <p className="m-0 mt-2 text-sm text-white/60">
          One-click operations for support, finance, and dispatch.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(actionMeta) as ActionKey[]).map((action) => (
          <button
            key={action}
            className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors ${
              selectedAction === action
                ? actionMeta[action].accent
                : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
            }`}
            onClick={() => setSelectedAction(action)}
            type="button"
          >
            {actionMeta[action].title}
          </button>
        ))}
      </div>

      <div className={`rounded-2xl border p-4 ${actionMeta[selectedAction].accent}`}>
        <p className="m-0 text-sm font-semibold">{actionMeta[selectedAction].title}</p>
        <p className="m-0 mt-2 text-xs leading-5 text-current/80">
          {actionMeta[selectedAction].description}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {(selectedAction === "refund-order" || selectedAction === "reassign-buddy") && (
          <label className="flex flex-col gap-2 text-sm text-white/70">
            Order ID
            <input
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
              onChange={(event) => updateField("orderId", event.target.value)}
              value={form.orderId}
            />
          </label>
        )}

        {selectedAction === "refund-order" && (
          <label className="flex flex-col gap-2 text-sm text-white/70">
            Amount (optional)
            <input
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
              inputMode="decimal"
              onChange={(event) => updateField("amount", event.target.value)}
              placeholder="Defaults to order total"
              value={form.amount}
            />
          </label>
        )}

        {selectedAction === "reassign-buddy" && (
          <label className="flex flex-col gap-2 text-sm text-white/70">
            Replacement buddy ID
            <input
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
              onChange={(event) => updateField("newBuddyId", event.target.value)}
              value={form.newBuddyId}
            />
          </label>
        )}

        {(selectedAction === "credit-wallet" || selectedAction === "freeze-user") && (
          <label className="flex flex-col gap-2 text-sm text-white/70">
            User ID
            <input
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
              onChange={(event) => updateField("userId", event.target.value)}
              value={form.userId}
            />
          </label>
        )}

        {selectedAction === "credit-wallet" && (
          <>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Wallet type
              <select
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
                onChange={(event) => updateField("walletType", event.target.value as "seller" | "buddy")}
                value={form.walletType}
              >
                <option value="seller">Seller</option>
                <option value="buddy">Buddy</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Amount
              <input
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
                inputMode="decimal"
                onChange={(event) => updateField("amount", event.target.value)}
                value={form.amount}
              />
            </label>
          </>
        )}

        <label className="flex flex-col gap-2 text-sm text-white/70">
          Note
          <textarea
            className="min-h-[88px] rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
            onChange={(event) => updateField("note", event.target.value)}
            placeholder="Why are we taking this action?"
            value={form.note}
          />
        </label>
      </div>

      <button
        className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isWorking}
        onClick={submit}
        type="button"
      >
        {isWorking ? "Processing…" : actionMeta[selectedAction].title}
      </button>

      {status ? <p className="m-0 text-xs text-white/70">{status}</p> : null}
    </section>
  );
}
