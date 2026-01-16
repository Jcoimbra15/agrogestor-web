"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadDB,
  addOS,
  addMaterialOS,
  updateOSStatus,
} from "../lib/agroStore";

export default function OSPage() {
  const [db, setDB] = useState(loadDB());
  const [titulo, setTitulo] = useState("");
  const [resp, setResp] = useState("");

  function refresh() {
    setDB(loadDB());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Ordens de Serviço</h1>
        <Link href="/dashboard" className="border px-3 py-2 rounded">
          Voltar
        </Link>
      </div>

      {/* Criar OS */}
      <section className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold">Nova OS</h2>
        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border p-2 mt-2 w-full"
        />
        <input
          placeholder="Responsável"
          value={resp}
          onChange={(e) => setResp(e.target.value)}
          className="border p-2 mt-2 w-full"
        />
        <button
          onClick={() => {
            addOS(titulo, resp);
            setTitulo("");
            setResp("");
            refresh();
          }}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
        >
          Criar OS
        </button>
      </section>

      {/* Lista OS */}
      <section className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">OS Cadastradas</h2>

        {db.os.map((os) => (
          <div key={os.id} className="border-b py-3">
            <p className="font-semibold">
              {os.titulo} — {os.status}
            </p>
            <p className="text-sm text-gray-600">
              Responsável: {os.responsavel}
            </p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  updateOSStatus(os.id, "EM_ANDAMENTO");
                  refresh();
                }}
                className="border px-2 py-1"
              >
                Em andamento
              </button>
              <button
                onClick={() => {
                  updateOSStatus(os.id, "FINALIZADA");
                  refresh();
                }}
                className="border px-2 py-1"
              >
                Finalizar
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
