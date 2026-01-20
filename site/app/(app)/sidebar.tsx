"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Estoque", href: "/estoque" },
  { label: "Rebanho", href: "/rebanho" },
  { label: "Ordens de Serviço", href: "/os" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__title">AgroGestor</div>
        <div className="sidebar__subtitle">Gestão Rural Inteligente</div>
      </div>

      <nav className="sidebar__nav">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar__link ${active ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
