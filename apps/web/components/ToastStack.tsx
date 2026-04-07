"use client";

import { useEffect, useState } from "react";
import { ToastItem, removeToast, subscribeToToasts } from "@/lib/toast-store";

const variantStyles: Record<string, string> = {
  success: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  error: "border-rose-400/40 bg-rose-500/10 text-rose-100",
  info: "border-white/10 bg-white/10 text-white"
};

export default function ToastStack() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => subscribeToToasts(setItems), []);

  if (!items.length) return null;

  return (
    <div className="fixed right-4 top-20 z-[999] flex flex-col gap-3 w-[min(360px,92vw)]">
      {items.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl border px-4 py-3 shadow-[0_16px_40px_rgba(15,6,30,0.35)] backdrop-blur-xl ${variantStyles[toast.variant ?? "info"]}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="m-0 text-sm font-semibold">{toast.title}</p>
              {toast.message ? (
                <p className="m-0 mt-1 text-xs text-white/70">{toast.message}</p>
              ) : null}
            </div>
            <button
              type="button"
              className="text-white/60 hover:text-white text-lg leading-none"
              onClick={() => removeToast(toast.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
