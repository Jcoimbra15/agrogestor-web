import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 px-5 py-6">
          <div className="mb-8">
            <div className="text-2xl font-bold text-emerald-400">AgroGestor</div>
            <div className="text-sm text-slate-300">Gestão Rural Inteligente</div>
          </div>

          <nav className="space-y-2">
            <Link
              className="block rounded-lg px-3 py-2 hover:bg-slate-800"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="block rounded-lg px-3 py-2 hover:bg-slate-800"
              href="/estoque"
            >
              Estoque
            </Link>
            <Link
              className="block rounded-lg px-3 py-2 hover:bg-slate-800"
              href="/rebanho"
            >
              Rebanho
            </Link>
            <Link
              className="block rounded-lg px-3 py-2 hover:bg-slate-800"
              href="/os"
            >
              Ordens de Serviço
            </Link>
          </nav>
        </aside>

        {/* Conteúdo */}
        <div className="flex-1">
          {/* Topbar */}
          <header className="h-14 flex items-center justify-end px-6 border-b border-slate-800 bg-slate-950">
            <div className="text-sm text-slate-300 mr-4">Olá, Usuário</div>
            <Link
              href="/login"
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm hover:bg-slate-800"
            >
              Sair
            </Link>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
