"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  addEstoqueItem,
  addMovimentacao,
  deleteEstoqueItem,
  EstoqueItem,
  loadDB,
  MovTipo,
} from "../lib/agroStore";

function badgeStatus(it: EstoqueItem) {
  const ok = (it.saldo ?? 0) > (it.minimo ?? 0);
  return ok
    ? "inline-flex rounded-full bg-emerald-500/15 px-2 py-1 text-xs text-emerald-300 border border-emerald-500/30"
    : "inline-flex rounded-full bg-red-500/15 px-2 py-1 text-xs text-red-300 border border-red-500/30";
}

export default function EstoquePage() {
  const [nome, setNome] = useState("");
  const [saldo, setSaldo] = useState<number>(0);
  const [minimo, setMinimo] = useState<number>(0);

  const [itemId, setItemId] = useState<string>("");
  const [tipo, setTipo] = useState<MovTipo>("Entrada");
  const [qtd, setQtd] = useState<number>(0);
  const [obs, setObs] = useState("");

  const [db, setDb] = useState(() => loadDB());

  function refresh() {
    setDb(loadDB());
  }

  useEffect(() => {
    refresh();
  }, []);

  const items = db.estoque ?? [];

  const itensOrdenados = useMemo(() => {
    return [...items].sort((a, b) => a.nome.localeCompare(b.nome));
  }, [items]);

  function onAddItem() {
    if (!nome.trim()) return;
    addEstoqueItem(nome, saldo, minimo);
    setNome("");
    setSaldo(0);
    setMinimo(0);
    refresh();
  }

  function onAddMov() {
    if (!itemId) return;
    addMovimentacao(itemId, tipo, qtd, obs);
    setQtd(0);
    setObs("");
    refresh();
  }

  function onDelete(id: string) {
    deleteEstoqueItem(id);
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Estoque</h1>
          <p className="text-sm text-slate-300">
            Cadastre produtos/insumos e registre entradas/saídas.
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
        <h2 className="text-lg font-bold">Cadastrar item</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="text-xs text-slate-400">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Ex: Sal mineral, Milho, Vacina..."
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Saldo</label>
            <input
              value={saldo}
              onChange={(e) => setSaldo(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="number"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Mínimo</label>
            <input
              value={minimo}
              onChange={(e) => setMinimo(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="number"
            />
          </div>
        </div>

        <button
          onClick={onAddItem}
          className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Adicionar
        </button>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 shadow">
        <h2 className="text-lg font-bold">Registrar movimentação</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="text-xs text-slate-400">Item</label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="">Selecione...</option>
              {itensOrdenados.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as MovTipo)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="Entrada">Entrada</option>
              <option value="Saida">Saída</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400">Quantidade</label>
            <input
              value={qtd}
              onChange={(e) => setQtd(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="number"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-xs text-slate-400">Obs (opcional)</label>
          <input
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Ex: Entrada por compra / Saída para curral..."
          />
        </div>

        <button
          onClick={onAddMov}
          className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Registrar
        </button>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 shadow">
        <h2 className="text-lg font-bold">Itens cadastrados</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-300">
              <tr className="border-b border-slate-800">
                <th className="py-2 text-left">Nome</th>
                <th className="py-2 text-left">Saldo</th>
                <th className="py-2 text-left">Mínimo</th>
                <th className="py-2 text-left">Alerta</th>
                <th className="py-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {itensOrdenados.map((it) => (
                <tr key={it.id} className="border-b border-slate-900">
                  <td className="py-2">{it.nome}</td>
                  <td className="py-2">{it.saldo}</td>
                  <td className="py-2">{it.minimo}</td>
                  <td className="py-2">
                    <span className={badgeStatus(it)}>
                      {(it.saldo ?? 0) <= (it.minimo ?? 0) ? "Abaixo do mínimo" : "OK"}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => onDelete(it.id)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 hover:bg-slate-800"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {itensOrdenados.length === 0 && (
                <tr>
                  <td className="py-3 text-slate-400" colSpan={5}>
                    Nenhum item cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Dica: se você atualizar a página, os dados continuam salvos (localStorage).
        </p>
      </section>
    </div>
  );
}
