type ToastVariant = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
};

let toasts: ToastItem[] = [];
const listeners = new Set<(items: ToastItem[]) => void>();

const notify = () => {
  listeners.forEach((listener) => listener(toasts));
};

export const subscribeToToasts = (listener: (items: ToastItem[]) => void) => {
  listeners.add(listener);
  listener(toasts);
  return () => listeners.delete(listener);
};

export const pushToast = (toast: Omit<ToastItem, "id">) => {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `toast_${Date.now()}_${Math.round(Math.random() * 1000)}`;
  const entry: ToastItem = { id, ...toast };
  toasts = [entry, ...toasts].slice(0, 4);
  notify();
  setTimeout(() => removeToast(id), 4500);
  return id;
};

export const removeToast = (id: string) => {
  toasts = toasts.filter((toast) => toast.id !== id);
  notify();
};

export const clearToasts = () => {
  toasts = [];
  notify();
};
