"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "block rounded-lg px-3 py-2 text-sm transition",
        active
          ? "bg-emerald-600 text-white"
          : "text-slate-200 hover:bg-slate-800 hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="min-h-screen w-64 border-r border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-6">
        <div className="text-xl font-bold text-emerald-400">AgroGestor</div>
        <div className="text-xs text-slate-300">Gestão Rural Inteligente</div>
      </div>

      <nav className="space-y-2">
        <NavItem href="/dashboard" label="Dashboard" />
        <NavItem href="/estoque" label="Estoque" />
        <NavItem href="/rebanho" label="Rebanho" />
        <NavItem href="/os" label="Ordens de Serviço" />
      </nav>
    </aside>
  );
}
