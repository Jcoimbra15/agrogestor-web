// site/app/(app)/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EstoqueItem, Movimentacao, OS, loadDB } from "../lib/agroStore";

function isToday(iso: string) {
  try {
    const d = new Date(iso);
    const n = new Date();
    return (
      d.getFullYear() === n.getFullYear() &&
      d.getMonth() === n.getMonth() &&
      d.getDate() === n.getDate()
    );
  } catch {
    return false;
  }
}

export default function DashboardPage() {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [movs, setMovs] = useState<Movimentacao[]>([]);
  const [os, setOs] = useState<OS[]>([]);

  // ✅ Recarrega tudo (botão Atualizar usa isso)
  function carregar() {
    const db = loadDB();
    setEstoque(db.estoque);
    setMovs(db.movimentacoes);
    setOs(db.os);
  }

  useEffect(() => {
    carregar();
  }, []);

  const estoqueCount = useMemo(() => estoque.length, [estoque]);

  const alertasCount = useMemo(() => {
    return estoque.filter((i) => (i.saldo ?? 0) <= (i.minimo ?? 0)).length;
  }, [estoque]);

  const osHojeCount = useMemo(() => {
    return os.filter((o) => isToday(o.data)).length;
  }, [os]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Bem-vindo ao AgroGestor. Aqui vamos mostrar os indicadores principais.
          </p>
        </div>

        <div className="flex gap-2">
          {/* ✅ ATUALIZAR DE VERDADE */}
          <button
            onClick={() => carregar()}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
          >
            Atualizar
          </button>

          <Link
            href="/"
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
          >
            Sair
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Ordens de Serviço</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{osHojeCount}</p>
          <p className="mt-1 text-sm text-gray-500">Abertas hoje</p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Estoque</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{estoqueCount}</p>
          <p className="mt-1 text-sm text-gray-500">Itens cadastrados</p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Alertas</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{alertasCount}</p>
          <p className="mt-1 text-sm text-gray-500">Pendências</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Ações rápidas</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/os"
              className="rounded bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
            >
              Nova OS
            </Link>

            <Link
              href="/estoque"
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              Ver estoque
            </Link>

            <Link
              href="/rebanho"
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              Ver rebanho
            </Link>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            (Essas telas a gente cria em seguida.)
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Resumo</h2>
          <p className="mt-2 text-sm text-gray-700">
            Aqui vamos colocar gráficos, movimentações e alertas de estoque mínimo.
          </p>

          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-900">Última movimentação</p>
            <p className="mt-1 text-sm text-gray-700">
              {movs[0]
                ? `${movs[0].tipo} - ${movs[0].itemNome} (${movs[0].quantidade})`
                : "Nenhuma movimentação ainda."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
