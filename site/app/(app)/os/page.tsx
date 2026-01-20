"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  addOS,
  deleteOS,
  finalizarOS,
  iniciarOS,
  loadDB,
} from "../lib/agroStore";

export default function OSPage() {
  const [db, setDb] = useState(() => loadDB());
  const [lastUpdated, setLastUpdated] = useState<string>(() => db?.meta?.lastUpdated ?? "");

  const [titulo, setTitulo] = useState("");
  const [responsavel, setResponsavel] = useState("");

  const osList = useMemo(() => (Array.isArray(db?.os) ? db.os : []), [db]);

  function refresh() {
    const next = loadDB();
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
  }

  function onAdd() {
    const next = addOS((titulo ?? "").trim(), (responsavel ?? "").trim());
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
    setTitulo("");
    setResponsavel("");
  }

  function onIniciar(id: string) {
    const next = iniciarOS(id);
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
  }

  function onFinalizar(id: string) {
    const next = finalizarOS(id);
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
  }

  function onDelete(id: string) {
    const next = deleteOS(id);
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
  }

  return (
    <main className="contentWrap">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Ordens de Serviço</h1>
          <p className="pageSubtitle">Crie OS simples e controle status (salvo no navegador).</p>
          <p className="pageHint">Última atualização: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "-"}</p>
        </div>

        <div className="pageActions">
          <button className="btnSecondary" onClick={refresh}>Atualizar</button>
          <Link className="btnSecondary" href="/dashboard">Voltar</Link>
        </div>
      </div>

      <section className="card">
        <h2 className="sectionTitle">Nova OS</h2>

        <div className="grid2">
          <div className="field">
            <label>Título</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Arrumar cerca do pasto 3" />
          </div>

          <div className="field">
            <label>Responsável</label>
            <input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} placeholder="Ex: Biru" />
          </div>
        </div>

        <div className="rowActions">
          <button className="btnPrimary" onClick={onAdd} disabled={!titulo.trim() || !responsavel.trim()}>
            Criar OS
          </button>
        </div>
      </section>

      <section className="card">
        <h2 className="sectionTitle">OS cadastradas</h2>

        {osList.length === 0 ? (
          <p className="muted">Nenhuma OS cadastrada.</p>
        ) : (
          <div className="list">
            {osList.map((o) => (
              <div className="listItem" key={o.id}>
                <div>
                  <div className="listTitle">
                    {o.titulo} <span className="muted">({o.status})</span>
                  </div>
                  <div className="muted">Responsável: {o.responsavel}</div>
                  {o.iniciadoEm ? <div className="muted">Início: {new Date(o.iniciadoEm).toLocaleString()}</div> : null}
                  {o.finalizadoEm ? <div className="muted">Fim: {new Date(o.finalizadoEm).toLocaleString()}</div> : null}
                </div>

                <div className="btnGroup">
                  {o.status === "ABERTA" ? (
                    <button className="btnSecondary" onClick={() => onIniciar(o.id)}>Em andamento</button>
                  ) : null}
                  {o.status !== "FINALIZADA" ? (
                    <button className="btnSecondary" onClick={() => onFinalizar(o.id)}>Finalizar</button>
                  ) : null}
                  <button className="btnDanger" onClick={() => onDelete(o.id)}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
