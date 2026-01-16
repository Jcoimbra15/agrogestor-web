"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
};

type ToastCtx = {
  toast: (t: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function cls(type: ToastType) {
  if (type === "success") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-50";
  if (type === "error") return "border-rose-500/40 bg-rose-500/10 text-rose-50";
  return "border-slate-500/40 bg-slate-500/10 text-slate-50";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const item: ToastItem = { ...t, id };
    setItems((prev) => [...prev, item]);

    // some sozinho
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Container */}
      <div className="fixed bottom-4 left-4 z-[9999] flex w-[92vw] max-w-sm flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl border px-4 py-3 shadow-lg backdrop-blur ${cls(t.type)}`}
          >
            {t.title ? <div className="text-sm font-semibold">{t.title}</div> : null}
            <div className="text-sm opacity-90">{t.message}</div>

            <button
              className="mt-2 text-xs opacity-80 hover:opacity-100"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
              type="button"
            >
              Fechar
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
