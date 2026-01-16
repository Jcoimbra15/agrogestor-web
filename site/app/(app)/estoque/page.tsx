"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadDB, EstoqueItem, Movimentacao, OS } from "../lib/agroStore";

function isToday(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function DashboardPage() {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [movs, setMovs] = useState<Movimentacao[]>([]);
  const [osList, setOsList] = useState<OS[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  function reload() {
    const db = loadDB();
    setEstoque(db?.estoque ?? []);
    setMovs(db?.movs ?? []);
    setOsList(db?.os ?? []);
  }

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    reload();
  }, [refreshKey]);

  const estoqueCount = estoque.length;

  const alertasCount = useMemo(() => {
    return estoque.filter(
      (i) => (i.saldo ?? 0) <= (i.minimo ?? 0)
    ).length;
  }, [estoque]);

  const osHojeCount = useMemo(() => {
    return osList.filter((o) => isToday(o.data)).length;
  }, [osList]);

  const ultimaMov = useMemo(() => {
    if (!movs || movs.length === 0) return null;
    return [...movs].sort(
      (a, b) =>
        new Date(b.data).getTime() - new Date(a.data).getTime()
    )[0];
  }, [movs]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Indicadores gerais do sistema
          </p>
        </div>

        <button
          onClick={() => setRefreshKey((v) => v + 1)}
          className="rounded border bg-white px-4 py-2 text-sm hover:bg-gray-100"
        >
          Atualizar
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Ordens de Serviço</p>
          <p className="text-2xl font-bold">{osHojeCount}</p>
          <p className="text-sm text-gray-500">Abertas hoje</p>
        </div>

        <div className="rounded bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Estoque</p>
          <p className="text-2xl font-bold">{estoqueCount}</p>
          <p className="text-sm text-gray-500">Itens cadastrados</p>
        </div>

        <div className="rounded bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Alertas</p>
          <p className="text-2xl font-bold">{alertasCount}</p>
          <p className="text-sm text-gray-500">Estoque baixo</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded bg-white p-4 shadow">
          <h2 className="font-semibold">Ações rápidas</h2>

          <div className="mt-4 flex gap-2">
            <Link href="/os" className="rounded bg-green-600 px-4 py-2 text-white">
              Nova OS
            </Link>
            <Link href="/estoque" className="rounded border px-4 py-2">
              Estoque
            </Link>
            <Link href="/rebanho" className="rounded border px-4 py-2">
              Rebanho
            </Link>
          </div>
        </div>

        <div className="rounded bg-white p-4 shadow">
          <h2 className="font-semibold">Última movimentação</h2>
          <p className="mt-2 text-sm text-gray-700">
            {ultimaMov
              ? `${ultimaMov.tipo} - ${ultimaMov.itemNome} (${ultimaMov.quantidade})`
              : "Nenhuma movimentação ainda."}
          </p>
        </div>
      </div>
    </main>
  );
}
