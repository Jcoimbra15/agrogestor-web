"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  addEstoqueItem,
  deleteEstoqueItem,
  loadDB,
  updateEstoqueItem,
  type EstoqueItem,
} from "../lib/agroStore";

function toNum(v: string) {
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export default function EstoquePage() {
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [busca, setBusca] = useState("");

  // form
  const [nome, setNome] = useState("");
  const [unidade, setUnidade] = useState("un");
  const [saldo, setSaldo] = useState("0");
  const [minimo, setMinimo] = useState("0");

  // edição simples
  const [editId, setEditId] = useState<string | null>(null);
  const [editSaldo, setEditSaldo] = useState("0");
  const [editMinimo, setEditMinimo] = useState("0");

  function refresh() {
    const db = loadDB();
    setItens(db.estoque);
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return itens;
    return itens.filter((i) => i.nome.toLowerCase().includes(q));
  }, [itens, busca]);

  const alertas = useMemo(() => {
    return itens.filter((i) => i.saldo <= i.minimo);
  }, [itens]);

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;

    addEstoqueItem({
      nome: nome.trim(),
      unidade,
      saldo: toNum(saldo),
      minimo: toNum(minimo),
    });

    setNome("");
    setUnidade("un");
    setSaldo("0");
    setMinimo("0");
    refresh();
  }

  function startEdit(item: EstoqueItem) {
    setEditId(item.id);
    setEditSaldo(String(item.saldo));
    setEditMinimo(String(item.minimo));
  }

  function saveEdit() {
    if (!editId) return;
    updateEstoqueItem(editId, { saldo: toNum(editSaldo), minimo: toNum(editMinimo) });
    setEditId(null);
    refresh();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Estoque</h1>
            <p className="mt-2 text-sm text-gray-600">
              Cadastre itens, acompanhe saldo e receba alertas de mínimo.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
          >
            Voltar
          </Link>
        </div>

        {/* topo: alertas */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-600">Itens cadastrados</p>
            <p className="mt-1 text-2xl font-bold">{itens.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-600">Em alerta (≤ mínimo)</p>
            <p className="mt-1 text-2xl font-bold">{alertas.length}</p>
            {alertas.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                Verifique os itens com saldo baixo.
              </p>
            )}
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-600">Buscar item</p>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex: sal mineral"
              className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* cadastro */}
        <div className="mt-6 rounded-lg bg-white p-4 shadow">
          <h2 className="text-lg font-semibold">Cadastrar item</h2>

          <form onSubmit={onAdd} className="mt-4 grid gap-3 md:grid-cols-5">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Sal mineral 25kg"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Unidade</label>
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="un">un</option>
                <option value="kg">kg</option>
                <option value="sc">sc</option>
                <option value="L">L</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Saldo</label>
              <input
                value={saldo}
                onChange={(e) => setSaldo(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Mínimo</label>
              <input
                value={minimo}
                onChange={(e) => setMinimo(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="md:col-span-5">
              <button
                type="submit"
                className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Salvar item
              </button>
              <button
                type="button"
                onClick={refresh}
                className="ml-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
              >
                Atualizar lista
              </button>
            </div>
          </form>
        </div>

        {/* lista */}
        <div className="mt-6 rounded-lg bg-white p-4 shadow">
          <h2 className="text-lg font-semibold">Itens</h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Item</th>
                  <th className="py-2">Un</th>
                  <th className="py-2">Saldo</th>
                  <th className="py-2">Mínimo</th>
                  <th className="py-2">Status</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 && (
                  <tr>
                    <td className="py-4 text-gray-600" colSpan={6}>
                      Nenhum item encontrado.
                    </td>
                  </tr>
                )}

                {filtrados.map((i) => {
                  const emAlerta = i.saldo <= i.minimo;
                  const editando = editId === i.id;

                  return (
                    <tr key={i.id} className="border-b align-middle">
                      <td className="py-3 font-medium">{i.nome}</td>
                      <td className="py-3 text-gray-700">{i.unidade}</td>

                      <td className="py-3">
                        {editando ? (
                          <input
                            value={editSaldo}
                            onChange={(e) => setEditSaldo(e.target.value)}
                            className="w-28 rounded border border-gray-300 px-2 py-1"
                          />
                        ) : (
                          i.saldo
                        )}
                      </td>

                      <td className="py-3">
                        {editando ? (
                          <input
                            value={editMinimo}
                            onChange={(e) => setEditMinimo(e.target.value)}
                            className="w-28 rounded border border-gray-300 px-2 py-1"
                          />
                        ) : (
                          i.minimo
                        )}
                      </td>

                      <td className="py-3">
                        {emAlerta ? (
                          <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                            Em alerta
                          </span>
                        ) : (
                          <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            OK
                          </span>
                        )}
                      </td>

                      <td className="py-3 text-right">
                        {editando ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="ml-2 rounded border border-gray-300 bg-white px-3 py-1 text-xs hover:bg-gray-100"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(i)}
                              className="rounded border border-gray-300 bg-white px-3 py-1 text-xs hover:bg-gray-100"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Excluir este item?")) {
                                  deleteEstoqueItem(i.id);
                                  refresh();
                                }
                              }}
                              className="ml-2 rounded border border-red-300 bg-white px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                            >
                              Excluir
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            * Dados salvos no navegador (localStorage). Depois a gente troca por banco real.
          </p>
        </div>
      </div>
    </main>
  );
}
