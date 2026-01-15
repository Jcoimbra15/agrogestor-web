import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-gray-900">Entrar</h1>

        <p className="mt-2 text-sm text-gray-600">
          Acesse o AgroGestor com seu e-mail e senha.
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              placeholder="seuemail@empresa.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              placeholder="••••••••"
            />
          </div>

          <button
            type="button"
            className="w-full rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
  );
}
