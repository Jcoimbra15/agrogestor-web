"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  addAnimal,
  addPesagem,
  Animal,
  Categoria,
  deleteAnimal,
  loadDB,
  Sexo,
} from "../lib/agroStore";

export default function RebanhoPage() {
  const [db, setDb] = useState(() => loadDB());

  function refresh() {
    setDb(loadDB());
  }

  useEffect(() => {
    refresh();
  }, []);

  // Cadastro animal
  const [id, setId] = useState("");
  const [sexo, setSexo] = useState<Sexo>("Não informado");
  const [categoria, setCategoria] = useState<Categoria>("Outro");
  const [lote, setLote] = useState("");
  const [nascimento, setNascimento] = useState("");

  // Pesagem
  const [animalId, setAnimalId] = useState("");
  const [pesoKg, setPesoKg] = useState<number>(0);
  const [data, setData] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [obs, setObs] = useState("");

  const animais = useMemo(() => {
    return [...(db.animais ?? [])].sort((a, b) => a.id.localeCompare(b.id));
  }, [db.animais]);

  const pesagens = db.pesagens ?? [];

  function onAddAnimal() {
    if (!id.trim()) return;
    try {
      addAnimal({
        id,
        sexo,
        categoria,
        lote: lote.trim() || undefined,
        nascimento: nascimento || undefined,
      });
      setId("");
      setSexo("Não informado");
      setCategoria("Outro");
      setLote("");
      setNascimento("");
      refresh();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  function onAddPesagem() {
    if (!animalId) return;
    addPesagem(animalId, pesoKg, data, obs);
    setPesoKg(0);
    setObs("");
    refresh();
  }

  function onDelete(a: Animal) {
    if (!confirm(`Excluir animal ${a.id} e as pesagens dele?`)) return;
    deleteAnimal(a.id);
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Rebanho</h1>
          <p className="text-sm text-slate-300">
            Cadastre animais e registre pesagens (fica salvo no navegador).
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
        <h2 className="text-lg font-bold">Cadastrar animal</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className="text-xs text-slate-400">Brinco/ID</label>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Ex: 1023"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Sexo</label>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value as Sexo)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option>Não informado</option>
              <option>Macho</option>
              <option>Fêmea</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400">Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option>Bezerro</option>
              <option>Novilho</option>
              <option>Vaca</option>
              <option>Touro</option>
              <option>Outro</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400">Lote/Pasto (opcional)</label>
            <input
              value={lote}
              onChange={(e) => setLote(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Ex: Lote 3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-slate-400">Nascimento (opcional)</label>
            <input
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="date"
            />
          </div>
        </div>

        <button
          onClick={onAddAnimal}
          className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Adicionar animal
        </button>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 shadow">
        <h2 className="text-lg font-bold">Registrar pesagem</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs text-slate-400">Animal</label>
            <select
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="">Selecione...</option>
              {animais.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400">Peso (kg)</label>
            <input
              value={pesoKg}
              onChange={(e) => setPesoKg(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="number"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Data</label>
            <input
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="date"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-xs text-slate-400">Obs (opcional)</label>
          <input
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Ex: Pesagem após apartação..."
          />
        </div>

        <button
          onClick={onAddPesagem}
          className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Registrar pesagem
        </button>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 shadow">
        <h2 className="text-lg font-bold">Animais</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-300">
              <tr className="border-b border-slate-800">
                <th className="py-2 text-left">ID</th>
                <th className="py-2 text-left">Sexo</th>
                <th className="py-2 text-left">Categoria</th>
                <th className="py-2 text-left">Lote</th>
                <th className="py-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {animais.map((a) => (
                <tr key={a.id} className="border-b border-slate-900">
                  <td className="py-2">{a.id}</td>
                  <td className="py-2">{a.sexo}</td>
                  <td className="py-2">{a.categoria}</td>
                  <td className="py-2">{a.lote ?? "-"}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => onDelete(a)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 hover:bg-slate-800"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {animais.length === 0 && (
                <tr>
                  <td className="py-3 text-slate-400" colSpan={5}>
                    Nenhum animal cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-lg font-bold">Pesagens registradas</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-300">
              <tr className="border-b border-slate-800">
                <th className="py-2 text-left">Animal</th>
                <th className="py-2 text-left">Data</th>
                <th className="py-2 text-left">Peso (kg)</th>
                <th className="py-2 text-left">Obs</th>
              </tr>
            </thead>
            <tbody>
              {pesagens.map((p) => (
                <tr key={p.id} className="border-b border-slate-900">
                  <td className="py-2">{p.animalId}</td>
                  <td className="py-2">{p.data}</td>
                  <td className="py-2">{p.pesoKg}</td>
                  <td className="py-2">{p.obs || "-"}</td>
                </tr>
              ))}

              {pesagens.length === 0 && (
                <tr>
                  <td className="py-3 text-slate-400" colSpan={4}>
                    Nenhuma pesagem registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
