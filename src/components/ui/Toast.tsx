"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastStore {
  toasts: Toast[];
  show: (toast: Omit<Toast, "id">) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).slice(2) }],
    })),
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function toast(toast: Omit<Toast, "id">) {
  useToastStore.getState().show(toast);
}

const iconMap = {
  success: <CheckCircle2 size={20} className="text-emerald-600" />,
  error: <XCircle size={20} className="text-red-600" />,
  warning: <AlertTriangle size={20} className="text-amber-600" />,
  info: <Info size={20} className="text-blue-600" />,
};

const colorMap = {
  success: "bg-white border-emerald-200",
  error: "bg-white border-red-200",
  warning: "bg-white border-amber-200",
  info: "bg-white border-blue-200",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 pr-2 rounded-xl border shadow-lg w-full max-w-sm pointer-events-auto",
        "animate-in slide-in-from-right-5 fade-in duration-300",
        colorMap[toast.type]
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{iconMap[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#212121]">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-[#616161] mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="p-1 rounded hover:bg-[#f5f5f5] flex-shrink-0"
      >
        <X size={14} className="text-[#93939f]" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, remove } = useToastStore();
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => remove(t.id)} />
      ))}
    </div>
  );
}
