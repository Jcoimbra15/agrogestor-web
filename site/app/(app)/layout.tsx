import Sidebar from "./sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="appShell">
      <Sidebar />
      <div className="appMain">
        <header className="topbar">
          <div className="topbar__left">Painel</div>
          <div className="topbar__right">
            <span className="topbar__user">Olá, Usuário</span>
            <a className="btn btn--ghost" href="/login">
              Sair
            </a>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}
