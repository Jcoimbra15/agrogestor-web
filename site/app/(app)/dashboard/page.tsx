"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getEstoqueAlertas, loadDB } from "../lib/agroStore";

export default function DashboardPage() {
  const [db, setDb] = useState(() => loadDB());
  const [lastUpdated, setLastUpdated] = useState<string>(() => db?.meta?.lastUpdated ?? "");

  const estoqueCount = useMemo(() => (Array.isArray(db?.estoque) ? db.estoque.length : 0), [db]);
  const osCount = useMemo(() => (Array.isArray(db?.os) ? db.os.length : 0), [db]);
  const rebanhoCount = useMemo(() => (Array.isArray(db?.animais) ? db.animais.length : 0), [db]);
  const alertasCount = useMemo(() => getEstoqueAlertas(db).length, [db]);

  const lastMov = useMemo(() => {
    const list = Array.isArray(db?.movimentacoes) ? db.movimentacoes : [];
    return list.length > 0 ? list[0] : null;
  }, [db]);

  function refresh() {
    const next = loadDB();
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
  }

  return (
    <main className="contentWrap">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Dashboard</h1>
          <p className="pageSubtitle">Visão geral do AgroGestor (dados reais do sistema).</p>
          <p className="pageHint">Última atualização: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "-"}</p>
        </div>

        <div className="pageActions">
          <button className="btnSecondary" onClick={refresh}>Atualizar</button>
          <Link className="btnSecondary" href="/login">Sair</Link>
        </div>
      </div>

      <section className="grid4">
        <div className="statCard">
          <div className="statLabel">Estoque</div>
          <div className="statValue">{estoqueCount}</div>
          <div className="statHint">Itens cadastrados</div>
        </div>

        <div className="statCard">
          <div className="statLabel">Alertas</div>
          <div className="statValue">{alertasCount}</div>
          <div className="statHint">Abaixo do mínimo</div>
        </div>

        <div className="statCard">
          <div className="statLabel">Ordens de Serviço</div>
          <div className="statValue">{osCount}</div>
          <div className="statHint">Registradas</div>
        </div>

        <div className="statCard">
          <div className="statLabel">Rebanho</div>
          <div className="statValue">{rebanhoCount}</div>
          <div className="statHint">Animais cadastrados</div>
        </div>
      </section>

      <section className="grid2">
        <div className="card">
          <h2 className="sectionTitle">Ações rápidas</h2>
          <div className="quickActions">
            <Link className="btnPrimary" href="/estoque">Estoque</Link>
            <Link className="btnSecondary" href="/os">OS</Link>
            <Link className="btnSecondary" href="/rebanho">Rebanho</Link>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            Dica: se você atualizou os dados em outra tela e voltar aqui, clique em “Atualizar”.
          </p>
        </div>

        <div className="card">
          <h2 className="sectionTitle">Última movimentação</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            {lastMov
              ? `${lastMov.tipo} - ${lastMov.itemNome} (${lastMov.quantidade})`
              : "Nenhuma movimentação ainda."}
          </p>
        </div>
      </section>
    </main>
  );
}
