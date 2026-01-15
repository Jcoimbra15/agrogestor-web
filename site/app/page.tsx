import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold text-green-700">AgroGestor</h1>

        <p className="mt-3 text-lg text-gray-700">Gestão Rural Inteligente</p>

        <p className="mt-6 text-gray-600">
          Sistema web para gestão de fazendas, controle de estoque, ordens de
          serviço, rebanho e financeiro.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-block rounded bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          Entrar no sistema
        </Link>
      </div>
    </main>
  );
}
