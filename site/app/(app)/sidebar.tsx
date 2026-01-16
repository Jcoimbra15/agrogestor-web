"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Estoque", href: "/estoque" },
  { label: "Rebanho", href: "/rebanho" },
  { label: "Ordens de Serviço", href: "/os" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-[260px] shrink-0 bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800">
      <div className="px-6 py-6">
        <div className="text-2xl font-bold">
          <span className="text-emerald-400">Agro</span>Gestor
        </div>
        <div className="text-xs text-slate-400">Gestão Rural Inteligente</div>
      </div>

      <nav className="px-4 pb-6 space-y-2">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-emerald-500/90 text-slate-950 shadow"
                  : "text-slate-200 hover:bg-slate-800/60",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
