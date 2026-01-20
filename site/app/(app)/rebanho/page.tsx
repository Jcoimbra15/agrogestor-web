"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  addAnimal,
  addPesagem,
  Categoria,
  deleteAnimal,
  loadDB,
  Sexo,
} from "../lib/agroStore";

function hojeYYYYMMDD() {
  // padrão estável pra input type="date"
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function RebanhoPage() {
  const [db, setDb] = useState(() => loadDB());
  const [lastUpdated, setLastUpdated] = useState<string>(() => db?.meta?.lastUpdated ?? "");

  // Form: animal
  const [brinco, setBrinco] = useState("");
  const [sexo, setSexo] = useState<Sexo>("Não informado");
  const [categoria, setCategoria] = useState<Categoria>("Outro");
  const [lote, setLote] = useState("");
  const [nascimento, setNascimento] = useState("");

  // Form: pesagem
  const [animalId, setAnimalId] = useState("");
  const [pesoKg, setPesoKg] = useState<number>(0);
  const [dataPesagem, setDataPesagem] = useState<string>(hojeYYYYMMDD());
  const [obsPesagem, setObsPesagem] = useState("");

  const animais = useMemo(() => (Array.isArray(db?.animais) ? db.animais : []), [db]);
  const pesagens = useMemo(() => (Array.isArray(db?.pesagens) ? db.pesagens : []), [db]);

  function refresh() {
    const next = loadDB();
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
  }

  function onAddAnimal() {
    const next = addAnimal({
      brinco: (brinco ?? "").trim(),
      sexo,
      categoria,
      lote: (lote ?? "").trim(),
      nascimento: (nascimento ?? "").trim(),
    });
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
    setBrinco("");
    setLote("");
    setNascimento("");
  }

  function onDeleteAnimal(id: string) {
    const next = deleteAnimal(id);
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
    if (animalId === id) setAnimalId("");
  }

  function onAddPesagem() {
    const next = addPesagem({
      animalId: (animalId ?? "").trim(),
      pesoKg: Number(pesoKg) || 0,
      data: (dataPesagem ?? "").trim(),
      obs: (obsPesagem ?? "").trim(),
    });
    setDb(next);
    setLastUpdated(next?.meta?.lastUpdated ?? "");
    setPesoKg(0);
    setObsPesagem("");
  }

  return (
    <main className="contentWrap">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Rebanho</h1>
          <p className="pageSubtitle">Cadastre animais e registre pesagens (fica salvo no navegador).</p>
          <p className="pageHint">Última atualização: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "-"}</p>
        </div>

        <div className="pageActions">
          <button className="btnSecondary" onClick={refresh}>Atualizar</button>
          <Link className="btnSecondary" href="/dashboard">Voltar</Link>
        </div>
      </div>

      <section className="card">
        <h2 className="sectionTitle">Cadastrar animal</h2>

        <div className="grid4">
          <div className="field">
            <label>Brinco/ID</label>
            <input value={brinco} onChange={(e) => setBrinco(e.target.value)} placeholder="Ex: 1023" />
          </div>

          <div className="field">
            <label>Sexo</label>
            <select value={sexo} onChange={(e) => setSexo(e.target.value as Sexo)}>
              <option>Não informado</option>
              <option>Macho</option>
              <option>Fêmea</option>
            </select>
          </div>

          <div className="field">
            <label>Categoria</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
              <option>Bezerro</option>
              <option>Novilho</option>
              <option>Vaca</option>
              <option>Touro</option>
              <option>Outro</option>
            </select>
          </div>

          <div className="field">
            <label>Lote/Pasto (opcional)</label>
            <input value={lote} onChange={(e) => setLote(e.target.value)} placeholder="Ex: Lote 3" />
          </div>

          <div className="field">
            <label>Nascimento (opcional)</label>
            <input type="date" value={nascimento} onChange={(e) => setNascimento(e.target.value)} />
          </div>
        </div>

        <div className="rowActions">
          <button className="btnPrimary" onClick={onAddAnimal}>Adicionar animal</button>
        </div>
      </section>

      <section className="card">
        <h2 className="sectionTitle">Registrar pesagem</h2>

        <div className="grid4">
          <div className="field">
            <label>Animal</label>
            <select value={animalId} onChange={(e) => setAnimalId(e.target.value)}>
              <option value="">Selecione...</option>
              {animais.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.brinco} • {a.categoria} • {a.sexo}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Peso (kg)</label>
            <input
              type="number"
              value={pesoKg}
              onChange={(e) => setPesoKg(Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="field">
            <label>Data</label>
            <input type="date" value={dataPesagem} onChange={(e) => setDataPesagem(e.target.value)} />
          </div>

          <div className="field">
            <label>Obs (opcional)</label>
            <input value={obsPesagem} onChange={(e) => setObsPesagem(e.target.value)} placeholder="Ex: Jejum/observação" />
          </div>
        </div>

        <div className="rowActions">
          <button className="btnPrimary" onClick={onAddPesagem} disabled={!animalId || pesoKg <= 0 || !dataPesagem}>
            Adicionar pesagem
          </button>
        </div>
      </section>

      <section className="card">
        <h2 className="sectionTitle">Animais cadastrados</h2>

        {animais.length === 0 ? (
          <p className="muted">Nenhum animal cadastrado.</p>
        ) : (
          <div className="list">
            {animais.map((a) => (
              <div className="listItem" key={a.id}>
                <div>
                  <div className="listTitle">{a.brinco}</div>
                  <div className="muted">{a.categoria} • {a.sexo}{a.lote ? ` • ${a.lote}` : ""}</div>
                </div>
                <button className="btnDanger" onClick={() => onDeleteAnimal(a.id)}>Excluir</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="sectionTitle">Pesagens registradas</h2>

        {pesagens.length === 0 ? (
          <p className="muted">Nenhuma pesagem registrada.</p>
        ) : (
          <div className="list">
            {pesagens.slice(0, 30).map((p) => (
              <div className="listItem" key={p.id}>
                <div>
                  <div className="listTitle">{p.animalBrinco} • {p.pesoKg} kg</div>
                  <div className="muted">{p.data}{p.obs ? ` • ${p.obs}` : ""}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
