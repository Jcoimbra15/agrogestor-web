import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <h1 className="text-2xl font-bold">
          <span className="text-emerald-400">Agro</span>Gestor
        </h1>
        <p className="mt-1 text-sm text-slate-400">Gestão Rural Inteligente</p>

        <div className="mt-6 space-y-3">
          <label className="block text-sm text-slate-300">Usuário</label>
          <input className="w-full rounded-lg border px-3 py-2" placeholder="Ex: admin" />

          <label className="block text-sm text-slate-300">Senha</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="••••••••"
            type="password"
          />

          <Link
            href="/dashboard"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Entrar
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          (Login simulado — navega direto para o sistema.)
        </p>
      </div>
    </main>
  );
}
