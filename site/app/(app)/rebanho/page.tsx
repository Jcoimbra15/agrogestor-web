"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  addAnimal,
  addPesagem,
  deleteAnimal,
  loadDB,
  Categoria,
  Sexo,
} from "../lib/agroStore";

function fmtData(iso?: string) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("pt-BR");
  } catch {
    return "-";
  }
}

function todayISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function RebanhoPage() {
  const [db, setDB] = useState(loadDB());

  // Form animal
  const [brinco, setBrinco] = useState("");
  const [sexo, setSexo] = useState<Sexo>("M");
  const [categoria, setCategoria] = useState<Categoria>("OUTRO");
  const [lote, setLote] = useState("");
  const [nascimento, setNascimento] = useState("");

  // Form pesagem
  const [animalId, setAnimalId] = useState("");
  const [peso, setPeso] = useState<number>(0);
  const [dataPesagem, setDataPesagem] = useState(todayISODate());
  const [obs, setObs] = useState("");

  function refresh() {
    setDB(loadDB());
  }

  useEffect(() => {
    refresh();
  }, []);

  const animais = db.rebanho;

  const categorias: Categoria[] = useMemo(
    () => ["BEZERRO", "BEZERRA", "NOVILHO", "NOVILHA", "TOURO", "VACA", "OUTRO"],
    []
  );

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rebanho</h1>
          <p className="text-gray-600 text-sm">
            Cadastre animais e registre pesagens (fica salvo no navegador).
          </p>
        </div>

        <Link href="/dashboard" className="border px-3 py-2 rounded">
          Voltar
        </Link>
      </div>

      {/* CADASTRAR ANIMAL */}
      <section className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-gray-900">Cadastrar animal</h2>

        <div className="grid md:grid-cols-4 gap-3 mt-3">
          <div>
            <label className="text-sm text-gray-700">Brinco/ID</label>
            <input
              value={brinco}
              onChange={(e) => setBrinco(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Ex: 1023"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Sexo</label>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value as Sexo)}
              className="border p-2 w-full rounded"
            >
              <option value="M">Macho</option>
              <option value="F">Fêmea</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-700">Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
              className="border p-2 w-full rounded"
            >
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-700">Lote/Pasto</label>
            <input
              value={lote}
              onChange={(e) => setLote(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Ex: Lote 3"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Nascimento (opcional)</label>
            <input
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (!brinco.trim()) return;
            addAnimal({
              brinco,
              sexo,
              categoria,
              lote,
              nascimento: nascimento ? new Date(nascimento).toISOString() : "",
            });
            setBrinco("");
            setLote("");
            setNascimento("");
            refresh();
          }}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Adicionar animal
        </button>
      </section>

      {/* PESAGEM */}
      <section className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-gray-900">Registrar pesagem</h2>

        <div className="grid md:grid-cols-4 gap-3 mt-3">
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Animal</label>
            <select
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              className="border p-2 w-full rounded"
            >
              <option value="">Selecione...</option>
              {animais.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.brinco} — {a.categoria} ({a.sexo}) {a.lote ? `— ${a.lote}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-700">Peso (kg)</label>
            <input
              type="number"
              value={peso}
              onChange={(e) => setPeso(Number(e.target.value))}
              className="border p-2 w-full rounded"
              min={0}
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Data</label>
            <input
              type="date"
              value={dataPesagem}
              onChange={(e) => setDataPesagem(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="md:col-span-4">
            <label className="text-sm text-gray-700">Obs (opcional)</label>
            <input
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Ex: Pesagem após apartação"
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (!animalId) return;
            if (!peso || peso <= 0) return;

            const iso = new Date(`${dataPesagem}T12:00:00`).toISOString();
            addPesagem(animalId, peso, iso, obs);
            setPeso(0);
            setObs("");
            refresh();
          }}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Salvar pesagem
        </button>

        <p className="mt-2 text-xs text-gray-500">
          Observação: as pesagens ficam salvas no sistema e não somem ao atualizar.
        </p>
      </section>

      {/* LISTA */}
      <section className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-gray-900 mb-3">Animais cadastrados</h2>

        {animais.length === 0 ? (
          <p className="text-gray-600 text-sm">Nenhum animal cadastrado ainda.</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Brinco</th>
                  <th>Sexo</th>
                  <th>Categoria</th>
                  <th>Lote</th>
                  <th>Nascimento</th>
                  <th>Última pesagem</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {animais.map((a) => {
                  const ultima = a.pesagens?.[0];
                  return (
                    <tr key={a.id} className="border-b">
                      <td className="py-2 font-medium">{a.brinco}</td>
                      <td>{a.sexo}</td>
                      <td>{a.categoria}</td>
                      <td>{a.lote || "-"}</td>
                      <td>{fmtData(a.nascimento)}</td>
                      <td>
                        {ultima ? (
                          <>
                            {ultima.pesoKg} kg — {fmtData(ultima.data)}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            deleteAnimal(a.id);
                            refresh();
                          }}
                          className="border px-3 py-1 rounded"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
// Remove um animal e apaga também as pesagens dele (para não ficar “lixo” no sistema)
export function deleteAnimal(id: string) {
  const db = loadDB();

  // Remove o animal
  db.rebanho = (db.rebanho ?? []).filter((a: any) => a.id !== id);

  // Remove pesagens desse animal
  db.pesagens = (db.pesagens ?? []).filter((p: any) => p.animalId !== id);

  saveDB(db);
}
