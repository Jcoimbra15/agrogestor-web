export type EstoqueItem = {
  id: string;
  nome: string;
  unidade: string; // ex: kg, un, sc, L
  saldo: number;
  minimo: number;
  atualizadoEm: string; // ISO
};

type DB = {
  estoque: EstoqueItem[];
};

const KEY = "agrogestor_db_v1";

function defaultDB(): DB {
  return { estoque: [] };
}

export function loadDB(): DB {
  if (typeof window === "undefined") return defaultDB();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultDB();
    const parsed = JSON.parse(raw) as DB;
    if (!parsed || !Array.isArray(parsed.estoque)) return defaultDB();
    return parsed;
  } catch {
    return defaultDB();
  }
}

export function saveDB(db: DB) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function addEstoqueItem(item: Omit<EstoqueItem, "id" | "atualizadoEm">) {
  const db = loadDB();
  const novo: EstoqueItem = {
    ...item,
    id: crypto.randomUUID(),
    atualizadoEm: new Date().toISOString(),
  };
  db.estoque.unshift(novo);
  saveDB(db);
  return novo;
}

export function updateEstoqueItem(id: string, patch: Partial<Omit<EstoqueItem, "id">>) {
  const db = loadDB();
  db.estoque = db.estoque.map((it) =>
    it.id === id ? { ...it, ...patch, atualizadoEm: new Date().toISOString() } : it
  );
  saveDB(db);
}

export function deleteEstoqueItem(id: string) {
  const db = loadDB();
  db.estoque = db.estoque.filter((it) => it.id !== id);
  saveDB(db);
}
