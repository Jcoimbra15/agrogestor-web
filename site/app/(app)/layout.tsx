import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-5 border-b">
          <div className="text-xl font-bold text-green-700">AgroGestor</div>
          <div className="text-xs text-gray-500">Gestão Rural Inteligente</div>
        </div>

        <nav className="p-3 space-y-1">
          <Link
            href="/dashboard"
            className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/estoque"
            className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Estoque
          </Link>
          <Link
            href="/rebanho"
            className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Rebanho
          </Link>
          <Link
            href="/os"
            className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Ordens de Serviço
          </Link>
        </nav>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1">
        {/* Topbar */}
        <header className="h-14 bg-white border-b flex items-center justify-between px-4">
          <div className="text-sm text-gray-600">Painel</div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">Olá, Usuário</div>
            <Link
              href="/"
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Sair
            </Link>
          </div>
        </header>

        <main className="p-6 bg-gray-50 text-gray-900 min-h-screen">
  {children}
</main>

      </div>
    </div>
  );
}
