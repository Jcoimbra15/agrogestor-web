"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadDB, type EstoqueItem } from "../lib/agroStore";

/**
 * Dashboard integrado ao Estoque (agroStore.ts)
 * - Itens cadastrados
 * - Alertas (saldo <= mínimo)
 * Mantém o visual claro e legível.
 */

export default function DashboardPage() {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [busca, setBusca] = useState("");

  function refresh() {
    const db = loadDB();
    setEstoque(Array.isArray(db?.estoque) ? db.estoque : []);
  }

  useEffect(() => {
    refresh();

    // Atualiza automaticamente quando outra aba/página alterar o localStorage
    const onStorage = (e: StorageEvent) => {
      if (e.key === "agrogestor_db_v1") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const estoqueCount = estoque.length;

  const alertas = useMemo(() => {
    return estoque.filter((i) => (i.saldo ?? 0) <= (i.minimo ?? 0));
  }, [estoque]);

  const alertasCount = alertas.length;

  const alertasTop = useMemo(() => {
    return [...alertas]
      .sort((a, b) => (a.saldo - a.minimo) - (b.saldo - b.minimo))
      .slice(0, 5);
  }, [alertas]);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return estoque;
    return estoque.filter((i) => i.nome.toLowerCase().includes(q));
  }, [estoque, busca]);

  const ultimos = useMemo(() => {
    // Mostra os mais recentemente atualizados (atualizadoEm)
    return [...filtrados]
      .sort((a, b) => (b.atualizadoEm || "").localeCompare(a.atualizadoEm || ""))
      .slice(0, 6);
  }, [filtrados]);

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Visão geral do AgroGestor (dados reais do estoque).
            </p>
          </div>

          <Link
            href="/"
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
          >
            Sair
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-600">Estoque</p>
            <p className="mt-2 text-3xl font-bold">{estoqueCount}</p>
            <p className="mt-1 text-sm text-gray-500">Itens cadastrados</p>
          </div>

          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-600">Alertas</p>
            <p className="mt-2 text-3xl font-bold">{alertasCount}</p>
            <p className="mt-1 text-sm text-gray-500">Saldo ≤ mínimo</p>
          </div>

          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-600">Buscar no estoque</p>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex: sal, arame, ração..."
              className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
            <p className="mt-2 text-xs text-gray-500">
              Mostrando {ultimos.length} de {filtrados.length}
            </p>
          </div>
        </div>

        {/* Ações rápidas + Alertas */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="text-lg font-semibold">Ações rápidas</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/os"
                className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Nova OS
              </Link>

              <Link
                href="/estoque"
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
              >
                Ver estoque
              </Link>

              <Link
                href="/rebanho"
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
              >
                Ver rebanho
              </Link>

              <button
                onClick={refresh}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
              >
                Atualizar
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              * OS e Rebanho serão integrados nos próximos passos.
            </p>
          </div>

          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="text-lg font-semibold">Alertas de estoque</h2>

            {alertasTop.length === 0 ? (
              <div className="mt-3 rounded border bg-gray-50 p-3 text-sm text-gray-700">
                Nenhum item em alerta. ✅
              </div>
            ) : (
              <div className="mt-3 overflow-hidden rounded border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="p-3">Item</th>
                      <th className="p-3">Saldo</th>
                      <th className="p-3">Mínimo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertasTop.map((i) => (
                      <tr key={i.id} className="border-t bg-white">
                        <td className="p-3 font-medium">{i.nome}</td>
                        <td className="p-3">{i.saldo} {i.unidade}</td>
                        <td className="p-3">{i.minimo} {i.unidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-3">
              <Link href="/estoque" className="text-sm text-gray-700 underline hover:no-underline">
                Abrir estoque →
              </Link>
            </div>
          </div>
        </div>

        {/* Últimos itens atualizados */}
        <div className="mt-6 rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Últimos itens atualizados</h2>
            <Link href="/estoque" className="text-sm text-gray-600 hover:underline">
              Ver tudo →
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded border">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3">Saldo</th>
                  <th className="p-3">Mínimo</th>
                  <th className="p-3">Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {ultimos.length === 0 ? (
                  <tr>
                    <td className="p-6 text-center text-gray-600" colSpan={4}>
                      Nenhum item encontrado.
                    </td>
                  </tr>
                ) : (
                  ultimos.map((i) => (
                    <tr key={i.id} className="border-t bg-white">
                      <td className="p-3 font-medium">{i.nome}</td>
                      <td className="p-3">{i.saldo} {i.unidade}</td>
                      <td className="p-3">{i.minimo} {i.unidade}</td>
                      <td className="p-3 text-gray-600">
                        {i.atualizadoEm ? new Date(i.atualizadoEm).toLocaleString("pt-BR") : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Dica: se você atualizar o estoque e voltar aqui, clique em “Atualizar”.
          </p>
        </div>
      </div>
    </main>
  );
}
