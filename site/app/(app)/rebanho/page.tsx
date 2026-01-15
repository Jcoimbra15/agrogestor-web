// site/app/(app)/rebanho/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Animal, loadDB } from "../lib/agroStore";

export default function RebanhoPage() {
  const [list, setList] = useState<Animal[]>([]);

  useEffect(() => {
    const db = loadDB();
    setList(db.rebanho ?? []);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <h1 className="text-3xl font-bold">Rebanho</h1>
      <p className="mt-2 text-sm text-gray-600">
        Aqui vamos cadastrar animais, ver lote/pasto, pesagens e histórico.
      </p>

      <div className="mt-6 rounded-lg bg-white p-4 shadow">
        {list.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum animal cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-700">
                <tr className="border-b">
                  <th className="py-2">Brinco</th>
                  <th className="py-2">Lote</th>
                  <th className="py-2">Peso</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id} className="border-b last:border-b-0">
                    <td className="py-2 font-medium">{a.brinco}</td>
                    <td className="py-2 text-gray-600">{a.lote}</td>
                    <td className="py-2 text-gray-600">{a.peso ?? "-"}</td>
                    <td className="py-2 text-gray-600">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Link href="/dashboard" className="mt-4 inline-block text-sm text-gray-700 hover:underline">
        ← Voltar para o Dashboard
      </Link>
    </main>
  );
}
