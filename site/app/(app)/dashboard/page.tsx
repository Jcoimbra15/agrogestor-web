"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadDB, Movimentacao } from "../lib/agroStore";

function fmtBR(iso?: string) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export default function DashboardPage() {
  const [movs, setMovs] = useState<Movimentacao[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  function refresh() {
    const db = loadDB();
    setMovs(db.movs ?? []);
    setLastUpdated(db.lastUpdated ?? "");
  }

  useEffect(() => {
    refresh();
  }, []);

  const dbMemo = useMemo(() => loadDB(), [lastUpdated]); // só pra calcular cards quando atualiza

  const estoqueCount = dbMemo.estoque.length;
  const alertasCount = dbMemo.estoque.filter((it) => (it.saldo ?? 0) <= (it.minimo ?? 0)).length;
  const osCount = dbMemo.os.filter((o) => o.status !== "FINALIZADA").length;
  const rebanhoCount = dbMemo.pesagens.length;

  const ultimaMov = movs.length > 0 ? movs[0] : null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-300 mt-1">Visão geral do AgroGestor (dados reais do sistema).</p>
          <p className="text-xs text-slate-400 mt-1">Última atualização: {fmtBR(lastUpdated)}</p>
        </div>

        <button
          onClick={refresh}
          className="rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm hover:bg-slate-800"
        >
          Atualizar
        </button>
      </div>

      {/* Cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <div className="text-sm text-slate-300">Estoque</div>
          <div className="text-3xl font-bold">{estoqueCount}</div>
          <div className="text-xs text-slate-400">Itens cadastrados</div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <div className="text-sm text-slate-300">Alertas</div>
          <div className="text-3xl font-bold">{alertasCount}</div>
          <div className="text-xs text-slate-400">Abaixo do mínimo</div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <div className="text-sm text-slate-300">Ordens de Serviço</div>
          <div className="text-3xl font-bold">{osCount}</div>
          <div className="text-xs text-slate-400">Abertas / em andamento</div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <div className="text-sm text-slate-300">Rebanho</div>
          <div className="text-3xl font-bold">{rebanhoCount}</div>
          <div className="text-xs text-slate-400">Pesagens registradas</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Ações rápidas */}
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h2 className="text-lg font-semibold">Ações rápidas</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-700" href="/estoque">
              Estoque
            </Link>
            <Link className="rounded-md border border-slate-700 bg-slate-950 px-4 py-2 text-sm hover:bg-slate-800" href="/os">
              OS
            </Link>
            <Link className="rounded-md border border-slate-700 bg-slate-950 px-4 py-2 text-sm hover:bg-slate-800" href="/rebanho">
              Rebanho
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Dica: se você atualizar qualquer tela e voltar aqui, clique em “Atualizar”.
          </p>
        </div>

        {/* Última movimentação */}
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h2 className="text-lg font-semibold">Última movimentação</h2>
          <div className="mt-3 text-sm text-slate-200">
            {ultimaMov ? (
              <div className="space-y-1">
                <div>
                  <span className="text-slate-400">Tipo:</span> {ultimaMov.tipo}
                </div>
                <div>
                  <span className="text-slate-400">Item:</span> {ultimaMov.itemNome}
                </div>
                <div>
                  <span className="text-slate-400">Qtd:</span> {ultimaMov.quantidade}
                </div>
                <div>
                  <span className="text-slate-400">Data:</span> {fmtBR(ultimaMov.data)}
                </div>
              </div>
            ) : (
              "Nenhuma movimentação ainda."
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
