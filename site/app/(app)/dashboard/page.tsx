"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadDB, EstoqueItem, Movimentacao, OS } from "../lib/agroStore";

function fmtDataHora(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function DashboardPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(() =>
    new Date().toISOString()
  );

  // Carrega sempre do localStorage (db "real")
  const db = useMemo(() => loadDB(), [lastUpdated]);

  const estoqueCount = db.estoque?.length ?? 0;

  const alertasCount =
    db.estoque?.filter((i: EstoqueItem) => (i.saldo ?? 0) <= (i.minimo ?? 0))
      .length ?? 0;

  const osHojeCount = db.os?.filter((o: OS) => isToday(o.data)).length ?? 0;

  // Última movimentação (mais recente)
  const ultimaMov: Movimentacao | null = useMemo(() => {
    const movs = (db.movimentacoes ?? []).slice();
    movs.sort((a, b) => {
      const ta = new Date(a.data).getTime();
      const tb = new Date(b.data).getTime();
      return tb - ta;
    });
    return movs[0] ?? null;
  }, [db.movimentacoes]);

  const onAtualizar = () => setLastUpdated(new Date().toISOString());

  return (
    <main className="min-h-screen">
      {/* topo simples (mantém seu layout geral) */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Visão geral do AgroGestor (dados reais do sistema).
          </p>
          <p className="mt-1 text-xs text-white/50">
            Última atualização: {fmtDataHora(lastUpdated)}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onAtualizar}
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Atualizar
          </button>
          <Link
            href="/login"
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Sair
          </Link>
        </div>
      </div>

      {/* CARD PRINCIPAL (agora azul, alinhado com a sidebar) */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1e3a]/80 via-[#0b1e3a]/65 to-white/10 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-sm text-white/70">Estoque</p>
            <p className="mt-1 text-3xl font-extrabold text-white">
              {estoqueCount}
            </p>
            <p className="text-xs text-white/50">Itens cadastrados</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-sm text-white/70">Alertas</p>
            <p className="mt-1 text-3xl font-extrabold text-white">
              {alertasCount}
            </p>
            <p className="text-xs text-white/50">Abaixo do mínimo</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-sm text-white/70">Ordens de Serviço</p>
            <p className="mt-1 text-3xl font-extrabold text-white">
              {osHojeCount}
            </p>
            <p className="text-xs text-white/50">Registradas hoje</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-sm text-white/70">Movimentações</p>
            <p className="mt-1 text-3xl font-extrabold text-white">
              {db.movimentacoes?.length ?? 0}
            </p>
            <p className="text-xs text-white/50">Registradas</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <p className="text-lg font-bold text-white">Ações rápidas</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/estoque"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-black hover:bg-emerald-400"
              >
                Estoque
              </Link>
              <Link
                href="/os"
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                OS
              </Link>
              <Link
                href="/rebanho"
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Rebanho
              </Link>
            </div>

            <p className="mt-3 text-xs text-white/50">
              Dica: se você atualizar os dados em outra tela e voltar aqui, clique
              em “Atualizar”.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <p className="text-lg font-bold text-white">Última movimentação</p>

            <p className="mt-2 text-sm text-white/80">
              {ultimaMov ? (
                <>
                  <span className="font-semibold">{ultimaMov.tipo}</span> —{" "}
                  {ultimaMov.itemNome} ({ultimaMov.quantidade})
                  <span className="block mt-1 text-xs text-white/50">
                    {fmtDataHora(ultimaMov.data)}
                  </span>
                </>
              ) : (
                "Nenhuma movimentação ainda."
              )}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
