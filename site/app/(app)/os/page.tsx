"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addOS, loadDB, OS, updateOS } from "../lib/agroStore";

export default function OSPage() {
  const [db, setDb] = useState(() => loadDB());

  function refresh() {
    setDb(loadDB());
  }

  useEffect(() => {
    refresh();
  }, []);

  const [titulo, setTitulo] = useState("");
  const [responsavel, setResponsavel] = useState("");

  const osList = useMemo(() => db.os ?? [], [db.os]);

  function onCreate() {
    if (!titulo.trim() || !responsavel.trim()) return;
    addOS(titulo, responsavel);
    setTitulo("");
    setResponsavel("");
    refresh();
  }

  function setStatus(os: OS, status: OS["status"]) {
    updateOS(os.id, { status });
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Ordens de Serviço</h1>
          <p className="text-sm text-slate-300">
            Crie OS simples e controle status (salvo no navegador).
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={refresh}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
          >
            Atualizar
          </button>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
          >
            Voltar
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 shadow">
        <h2 className="text-lg font-bold">Nova OS</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Ex: Arrumar cerca do pasto 3"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Responsável</label>
            <input
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Ex: Biru"
            />
          </div>
        </div>

        <button
          onClick={onCreate}
          className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Criar OS
        </button>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 shadow">
        <h2 className="text-lg font-bold">OS cadastradas</h2>

        {osList.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">Nenhuma OS cadastrada.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {osList.map((o) => (
              <div key={o.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-lg font-bold">{o.titulo}</div>
                    <div className="text-sm text-slate-400">Responsável: {o.responsavel}</div>
                    <div className="text-xs text-slate-500">Status: {o.status}</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setStatus(o, "Em andamento")}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800"
                    >
                      Em andamento
                    </button>
                    <button
                      onClick={() => setStatus(o, "Finalizada")}
                      className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                    >
                      Finalizar
                    </button>
                    <button
                      onClick={() => setStatus(o, "Aberta")}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800"
                    >
                      Reabrir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
