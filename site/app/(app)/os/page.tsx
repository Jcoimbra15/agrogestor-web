// site/app/(app)/os/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadDB, OS } from "../lib/agroStore";

export default function OSPage() {
  const [list, setList] = useState<OS[]>([]);

  useEffect(() => {
    const db = loadDB();
    setList(db.os ?? []);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <h1 className="text-3xl font-bold">Ordens de Serviço</h1>
      <p className="mt-2 text-sm text-gray-600">
        Aqui vamos criar OS com fotos, status, responsável e materiais usados.
      </p>

      <div className="mt-6 rounded-lg bg-white p-4 shadow">
        {list.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma OS cadastrada.</p>
        ) : (
          <ul className="space-y-3">
            {list.map((o) => (
              <li key={o.id} className="rounded border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{o.titulo}</p>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                    {o.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">Responsável: {o.responsavel}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link href="/dashboard" className="mt-4 inline-block text-sm text-gray-700 hover:underline">
        ← Voltar para o Dashboard
      </Link>
    </main>
  );
}
