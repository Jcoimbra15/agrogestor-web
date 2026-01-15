// site/app/(app)/estoque/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  addEstoqueItem,
  addMovimentacao,
  deleteEstoqueItem,
  EstoqueItem,
  Movimentacao,
  loadDB,
} from "../lib/agroStore";

function fmtData(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export default function EstoquePage() {
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [movs, setMovs] = useState<Movimentacao[]>([]);

  // Form cadastro
  const [nome, setNome] = useState("");
  const [saldo, setSaldo] = useState<number>(0);
  const [minimo, setMinimo] = useState<number>(0);

  // Movimentação
  const [movItemId, setMovItemId] = useState<string>("");
  const [movTipo, setMovTipo] = useState<"ENTRADA" | "SAIDA">("ENTRADA");
  const [movQtd, setMovQtd] = useState<number>(0);
  const [movObs, setMovObs] = useState("");

  // ✅ FUNÇÃO ÚNICA PARA RECARREGAR (o botão Atualizar usa isso)
  function carregar() {
    const db = loadDB();
    setItens(db.estoque);
    setMovs(db.movimentacoes);
    // garante select apontando para algo válido
    if (db.estoque.length > 0 && !db.estoque.some((x) => x.id === movItemId)) {
      setMovItemId(db.estoque[0].id);
    }
    if (db.estoque.length === 0) setMovItemId("");
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itensOrdenados = useMemo(() => {
    return [...itens].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [itens]);

  function alertaTexto(item: EstoqueItem) {
    if ((item.saldo ?? 0) <= (item.minimo ?? 0)) return "Abaixo do mínimo";
    return "OK";
  }

  function alertaClasse(item: EstoqueItem) {
    if ((item.saldo ?? 0) <= (item.minimo ?? 0)) return "bg-red-100 text-red-700";
    return "bg-green-100 text-green-700";
  }

  function onAdicionar() {
    if (!nome.trim()) return;

    addEstoqueItem({
      nome: nome.trim(),
      saldo: Number(saldo) || 0,
      minimo: Number(minimo) || 0,
    });

    setNome("");
    setSaldo(0);
    setMinimo(0);

    // ✅ recarrega depois de salvar
    carregar();
  }

  function onExcluir(id: string) {
    deleteEstoqueItem(id);
    carregar();
  }

  function onMovimentar() {
    if (!movItemId) return;

    addMovimentacao({
      itemId: movItemId,
      tipo: movTipo,
      quantidade: Number(movQtd) || 0,
      observacao: movObs,
    });

    setMovQtd(0);
    setMovObs("");
    carregar();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estoque</h1>
          <p className="mt-2 text-sm text-gray-600">
            Aqui vamos listar produtos/insumos, saldo, mínimo e movimentações.
          </p>
        </div>

        <div className="flex gap-2">
          {/* ✅ BOTÃO ATUALIZAR FUNCIONANDO */}
          <button
            onClick={() => carregar()}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
          >
            Atualizar
          </button>

          <Link
            href="/dashboard"
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
          >
            Voltar
          </Link>
        </div>
      </div>

      {/* CADASTRAR */}
      <section className="mt-6 rounded-lg bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Cadastrar item</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-sm text-gray-700">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="Ex: Sal mineral, Milho, Vacina..."
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Saldo</label>
            <input
              type="number"
              value={saldo}
              onChange={(e) => setSaldo(Number(e.target.value))}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Mínimo</label>
            <input
              type="number"
              value={minimo}
              onChange={(e) => setMinimo(Number(e.target.value))}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          onClick={onAdicionar}
          className="mt-4 rounded bg-green-700 px-6 py-2 text-sm font-semibold text-white hover:bg-green-800"
        >
          Adicionar
        </button>
      </section>

      {/* MOVIMENTAÇÃO */}
      <section className="mt-6 rounded-lg bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Movimentação</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div>
            <label className="text-sm text-gray-700">Item</label>
            <select
              value={movItemId}
              onChange={(e) => setMovItemId(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
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
            <label className="text-sm text-gray-700">Tipo</label>
            <select
              value={movTipo}
              onChange={(e) => setMovTipo(e.target.value as any)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-700">Quantidade</label>
            <input
              type="number"
              value={movQtd}
              onChange={(e) => setMovQtd(Number(e.target.value))}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Obs.</label>
            <input
              value={movObs}
              onChange={(e) => setMovObs(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="Opcional"
            />
          </div>
        </div>

        <button
          onClick={onMovimentar}
          className="mt-4 rounded bg-green-700 px-6 py-2 text-sm font-semibold text-white hover:bg-green-800"
        >
          Salvar movimentação
        </button>
      </section>

      {/* ITENS */}
      <section className="mt-6 rounded-lg bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Itens cadastrados</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left text-gray-700">Nome</th>
                <th className="py-2 text-left text-gray-700">Saldo</th>
                <th className="py-2 text-left text-gray-700">Mínimo</th>
                <th className="py-2 text-left text-gray-700">Alerta</th>
                <th className="py-2 text-left text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {itensOrdenados.map((it) => (
                <tr key={it.id} className="border-b">
                  <td className="py-2 text-gray-900">{it.nome}</td>
                  <td className="py-2 text-gray-900">{it.saldo}</td>
                  <td className="py-2 text-gray-900">{it.minimo}</td>
                  <td className="py-2">
                    <span className={`rounded px-2 py-1 text-xs ${alertaClasse(it)}`}>
                      {alertaTexto(it)}
                    </span>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => onExcluir(it.id)}
                      className="rounded border border-gray-300 bg-white px-3 py-1 text-xs text-gray-800 hover:bg-gray-100"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {itensOrdenados.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-gray-600">
                    Nenhum item cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MOVIMENTAÇÕES */}
      <section className="mt-6 rounded-lg bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Últimas movimentações</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left text-gray-700">Data</th>
                <th className="py-2 text-left text-gray-700">Item</th>
                <th className="py-2 text-left text-gray-700">Tipo</th>
                <th className="py-2 text-left text-gray-700">Qtd</th>
                <th className="py-2 text-left text-gray-700">Obs</th>
              </tr>
            </thead>
            <tbody>
              {movs.slice(0, 20).map((m) => (
                <tr key={m.id} className="border-b">
                  <td className="py-2 text-gray-900">{fmtData(m.data)}</td>
                  <td className="py-2 text-gray-900">{m.itemNome}</td>
                  <td className="py-2 text-gray-900">{m.tipo}</td>
                  <td className="py-2 text-gray-900">{m.quantidade}</td>
                  <td className="py-2 text-gray-900">{m.observacao || "-"}</td>
                </tr>
              ))}

              {movs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-gray-600">
                    Nenhuma movimentação registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
