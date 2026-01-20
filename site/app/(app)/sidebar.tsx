// site/app/(app)/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

const items: Item[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/estoque", label: "Estoque" },
  { href: "/rebanho", label: "Rebanho" },
  { href: "/os", label: "Ordens de Serviço" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebarBrand">
        <div className="brandTitle">AgroGestor</div>
        <div className="brandSub">Gestão Rural Inteligente</div>
      </div>

      <nav className="sidebarNav">
        {items.map((it) => {
          const active =
            pathname === it.href || (it.href !== "/dashboard" && pathname?.startsWith(it.href));

          return (
            <Link
              key={it.href}
              href={it.href}
              className={`sidebarLink ${active ? "active" : ""}`}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebarFooter">v1.0 • localStorage</div>
    </aside>
  );
}
