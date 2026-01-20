"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DB, loadDB, Movimentacao } from "../lib/agroStore";

function fmtData(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export default function DashboardPage() {
  const [db, setDb] = useState<DB>(() => loadDB());

  function atualizar() {
    setDb(loadDB());
  }

  useEffect(() => {
    // garante que ao entrar a tela já puxe do localStorage
    atualizar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const estoqueCount = db.estoque.length;
  const alertasCount = db.estoque.filter((it) => it.saldo < it.minimo).length;

  const osAbertasHoje = useMemo(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    return db.os.filter((o) => o.criadoEm.slice(0, 10) === hoje && o.status === "ABERTA").length;
  }, [db.os]);

  const movs: Movimentacao[] = db.movimentacoes ?? [];
  const ultimaMov = movs.length > 0 ? movs[0] : null;

  return (
    <div className="appShell">
      {/* Sidebar (links simples – se você já tiver sidebar.tsx pode manter) */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brandTitle">AgroGestor</div>
          <div className="brandSub">Gestão Rural Inteligente</div>
        </div>

        <nav className="nav">
          <Link className="navItem navItemActive" href="/dashboard">Dashboard</Link>
          <Link className="navItem" href="/estoque">Estoque</Link>
          <Link className="navItem" href="/rebanho">Rebanho</Link>
          <Link className="navItem" href="/os">Ordens de Serviço</Link>
        </nav>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <p className="pageSub" style={{ margin: 0 }}>Painel</p>
          </div>
          <div className="row">
            <div style={{ color: "rgba(255,255,255,.75)" }}>Olá, Usuário</div>
            <button className="btn btnDark" type="button">Sair</button>
          </div>
        </div>

        <div className="container">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <h1 className="pageTitle">Dashboard</h1>
              <p className="pageSub">Visão geral do AgroGestor (dados reais do sistema).</p>
              <p className="pageSub">Última atualização: {fmtData(db.updatedAt)}</p>
            </div>

            <div className="row">
              <button className="btn btnDark" type="button" onClick={atualizar}>
                Atualizar
              </button>
              <button className="btn btnDark" type="button">
                Sair
              </button>
            </div>
          </div>

          <div className="cardGrid">
            <div className="card">
              <div className="cardLabel">Estoque</div>
              <div className="cardValue">{estoqueCount}</div>
              <div className="cardHint">Itens cadastrados</div>
            </div>

            <div className="card">
              <div className="cardLabel">Alertas</div>
              <div className="cardValue">{alertasCount}</div>
              <div className="cardHint">Abaixo do mínimo</div>
            </div>

            <div className="card">
              <div className="cardLabel">Ordens de Serviço</div>
              <div className="cardValue">{osAbertasHoje}</div>
              <div className="cardHint">Abertas hoje</div>
            </div>

            <div className="card">
              <div className="cardLabel">Movimentações</div>
              <div className="cardValue">{movs.length}</div>
              <div className="cardHint">Registradas</div>
            </div>
          </div>

          <div className="hr" />

          <div className="row" style={{ gap: 16, alignItems: "stretch" }}>
            <section className="sectionBox" style={{ flex: 1 }}>
              <h2 className="sectionTitle">Ações rápidas</h2>

              <div className="row" style={{ marginTop: 12 }}>
                <Link className="btn btnPrimary" href="/estoque">Estoque</Link>
                <Link className="btn btnDark" href="/os">OS</Link>
                <Link className="btn btnDark" href="/rebanho">Rebanho</Link>
              </div>

              <p className="pageSub" style={{ marginTop: 10 }}>
                Dica: se você atualizar os dados em outra tela e voltar aqui, clique em “Atualizar”.
              </p>
            </section>

            <section className="sectionBox" style={{ flex: 1 }}>
              <h2 className="sectionTitle">Última movimentação</h2>

              <div style={{ marginTop: 12, color: "rgba(255,255,255,.88)" }}>
                {ultimaMov ? (
                  <>
                    <div style={{ fontWeight: 800 }}>
                      {ultimaMov.tipo} - {ultimaMov.itemNome} ({ultimaMov.quantidade})
                    </div>
                    <div className="pageSub">Data: {fmtData(ultimaMov.data)}</div>
                    {ultimaMov.obs ? <div className="pageSub">Obs: {ultimaMov.obs}</div> : null}
                  </>
                ) : (
                  <div className="pageSub">Nenhuma movimentação ainda.</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
