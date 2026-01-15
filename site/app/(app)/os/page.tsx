import Link from "next/link";

export default function OSPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Ordens de Serviço</h1>
            <p className="mt-2 text-sm text-gray-600">
              Aqui vamos criar OS com fotos, status, responsável e materiais usados.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
          >
            Voltar
          </Link>
        </div>

        <div className="mt-6 rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-600">
            Próximo passo: botão “Nova OS”, lista de OS e detalhes da OS.
          </p>
        </div>
      </div>
    </main>
  );
}
