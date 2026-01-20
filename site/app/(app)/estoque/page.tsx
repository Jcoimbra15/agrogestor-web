"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  addEstoqueItem,
  addMovimentacao,
  deleteEstoqueItem,
  getEstoqueAlertas,
  loadDB,
  MovTipo,
} from "../lib/agroStore";

export default function EstoquePage() {
  const [db, setDb] = useState(() => loadDB());
  const [lastUpdated, setLastUpdated] = useState<string>(() => db?.meta?.lastUpdated ?? "");

  // cadastrar item
  const [nome, setNome] = useState("");
  const [saldo, setSaldo] = useState<number>(0);
  const [minimo, setMinimo] = useState<number>(0);

  // movimentacao
  const [itemId, setItemId] = useState("");
  const [tipo, setTipo] = useState<MovTipo>("ENTRADA");
  const [quantidade, setQuantidade] = useState<number>(0);
  const [obs, setObs] = useState("");

  const itens = useMemo(() => (Array.isArray(db?.estoque) ? db.estoque : []), [db]);
  const alertas = useMemo(() => getEstoqueAlertas(db), [db]);
  const movimentos = useMemo(() => (Array.isArray(db?.movimentacoes) ? db.movimentacoes.slice(0, 30) : []), [db]);

  function refresh() {
    const next = loadDB();
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
  }

  function onAddItem() {
    const next = addEstoqueItem((nome ?? "").trim(), Number(saldo) || 0, Number(minimo) || 0);
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
    setNome("");
    setSaldo(0);
    setMinimo(0);
  }

  function onDeleteItem(id: string) {
    const next = deleteEstoqueItem(id);
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
    if (itemId === id) setItemId("");
  }

  function onAddMov() {
    const next = addMovimentacao((itemId ?? "").trim(), tipo, Number(quantidade) || 0, (obs ?? "").trim());
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
    setQuantidade(0);
    setObs("");
  }

  return (
    <main className="contentWrap">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Estoque</h1>
          <p className="pageSubtitle">Cadastre produtos/insumos e registre entradas/saídas.</p>
          <p className="pageHint">Última atualização: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "-"}</p>
        </div>

        <div className="pageActions">
          <button className="btnSecondary" onClick={refresh}>Atualizar</button>
          <Link className="btnSecondary" href="/dashboard">Voltar</Link>
        </div>
      </div>

      <section className="card">
        <h2 className="sectionTitle">Cadastrar item</h2>
        <div className="grid3">
          <div className="field">
            <label>Nome</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Sal mineral, Milho, Vacina..." />
          </div>

          <div className="field">
            <label>Saldo</label>
            <input type="number" value={saldo} onChange={(e) => setSaldo(Number(e.target.value))} min={0} />
          </div>

          <div className="field">
            <label>Mínimo</label>
            <input type="number" value={minimo} onChange={(e) => setMinimo(Number(e.target.value))} min={0} />
          </div>
        </div>

        <div className="rowActions">
          <button className="btnPrimary" onClick={onAddItem} disabled={!nome.trim()}>
            Adicionar
          </button>
        </div>
      </section>

      <section className="card">
        <h2 className="sectionTitle">Registrar movimentação</h2>

        <div className="grid4">
          <div className="field">
            <label>Item</label>
            <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
              <option value="">Selecione...</option>
              {itens.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome} (saldo: {i.saldo})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value as MovTipo)}>
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
            </select>
          </div>

          <div className="field">
            <label>Quantidade</label>
            <input type="number" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} min={0} />
          </div>

          <div className="field">
            <label>Obs (opcional)</label>
            <input value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Ex: NF / local / motivo..." />
          </div>
        </div>

        <div className="rowActions">
          <button className="btnPrimary" onClick={onAddMov} disabled={!itemId || quantidade <= 0}>
            Registrar
          </button>
        </div>
      </section>

      <section className="card">
        <h2 className="sectionTitle">Itens</h2>

        {itens.length === 0 ? (
          <p className="muted">Nenhum item cadastrado.</p>
        ) : (
          <div className="list">
            {itens.map((i) => (
              <div className="listItem" key={i.id}>
                <div>
                  <div className="listTitle">{i.nome}</div>
                  <div className="muted">Saldo: {i.saldo} • Mínimo: {i.minimo}</div>
                </div>
                <button className="btnDanger" onClick={() => onDeleteItem(i.id)}>Excluir</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="sectionTitle">Alertas</h2>
        {alertas.length === 0 ? (
          <p className="muted">Sem alertas.</p>
        ) : (
          <div className="list">
            {alertas.map((a) => (
              <div className="listItem" key={a.id}>
                <div>
                  <div className="listTitle">{a.nome}</div>
                  <div className="muted">Abaixo do mínimo (saldo {a.saldo} / mín {a.minimo})</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="sectionTitle">Últimas movimentações</h2>
        {movimentos.length === 0 ? (
          <p className="muted">Nenhuma movimentação ainda.</p>
        ) : (
          <div className="list">
            {movimentos.map((m) => (
              <div className="listItem" key={m.id}>
                <div>
                  <div className="listTitle">{m.tipo} - {m.itemNome} ({m.quantidade})</div>
                  <div className="muted">{m.obs ? m.obs : "—"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
