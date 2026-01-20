// site/app/(app)/layout.tsx
import type { ReactNode } from "react";
import Sidebar from "./sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="appShell">
      <Sidebar />

      <div className="contentShell">
        <header className="topbar">
          <div className="topbarTitle">Painel</div>

          <div className="topbarRight">
            <span className="topbarUser">Olá, Usuário</span>
            <a className="btn btnGhost" href="/login">
              Sair
            </a>
          </div>
        </header>

        <main className="contentMain">{children}</main>
      </div>
    </div>
  );
}
