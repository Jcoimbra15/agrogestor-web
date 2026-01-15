// site/app/(app)/lib/agroStore.ts
export type EstoqueItem = {
  id: string;
  nome: string;
  saldo: number;
  minimo: number;
  criadoEm: string; // ISO
  atualizadoEm: string; // ISO
};

export type Movimentacao = {
  id: string;
  itemId: string;
  itemNome: string;
  tipo: "ENTRADA" | "SAIDA";
  quantidade: number;
  observacao?: string;
  data: string; // ISO
};

export type OS = {
  id: string;
  titulo: string;
  status: "ABERTA" | "EM_ANDAMENTO" | "CONCLUIDA";
  data: string; // ISO
};

type AgroDB = {
  estoque: EstoqueItem[];
  movimentacoes: Movimentacao[];
  os: OS[];
};

const KEY = "agrogestor_db_v1";

function safeParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export function loadDB(): AgroDB {
  if (typeof window === "undefined") {
    return { estoque: [], movimentacoes: [], os: [] };
  }

  const raw = window.localStorage.getItem(KEY);
  if (!raw) {
    const inicial: AgroDB = { estoque: [], movimentacoes: [], os: [] };
    window.localStorage.setItem(KEY, JSON.stringify(inicial));
    return inicial;
  }

  const parsed = safeParse<AgroDB>(raw, { estoque: [], movimentacoes: [], os: [] });

  // Garantir shape
  return {
    estoque: Array.isArray(parsed.estoque) ? parsed.estoque : [],
    movimentacoes: Array.isArray(parsed.movimentacoes) ? parsed.movimentacoes : [],
    os: Array.isArray(parsed.os) ? parsed.os : [],
  };
}

export function saveDB(db: AgroDB) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(db));
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function addEstoqueItem(input: { nome: string; saldo: number; minimo: number }) {
  const db = loadDB();

  const now = new Date().toISOString();
  const item: EstoqueItem = {
    id: uid("est"),
    nome: input.nome.trim(),
    saldo: Number.isFinite(input.saldo) ? input.saldo : 0,
    minimo: Number.isFinite(input.minimo) ? input.minimo : 0,
    criadoEm: now,
    atualizadoEm: now,
  };

  db.estoque.push(item);
  saveDB(db);
  return item;
}

export function updateEstoqueItem(id: string, patch: Partial<Omit<EstoqueItem, "id" | "criadoEm">>) {
  const db = loadDB();
  db.estoque = db.estoque.map((it) => {
    if (it.id !== id) return it;
    return {
      ...it,
      ...patch,
      atualizadoEm: new Date().toISOString(),
    };
  });
  saveDB(db);
}

export function deleteEstoqueItem(id: string) {
  const db = loadDB();

  const item = db.estoque.find((it) => it.id === id);
  db.estoque = db.estoque.filter((it) => it.id !== id);

  // Também remove movimentações do item
  db.movimentacoes = db.movimentacoes.filter((m) => m.itemId !== id);

  saveDB(db);
  return item;
}

export function addMovimentacao(input: {
  itemId: string;
  tipo: "ENTRADA" | "SAIDA";
  quantidade: number;
  observacao?: string;
}) {
  const db = loadDB();
  const item = db.estoque.find((it) => it.id === input.itemId);
  if (!item) throw new Error("Item não encontrado");

  const qtd = Math.max(0, Number(input.quantidade) || 0);

  const novoSaldo = input.tipo === "ENTRADA" ? item.saldo + qtd : item.saldo - qtd;

  // Atualiza item
  db.estoque = db.estoque.map((it) =>
    it.id === item.id
      ? { ...it, saldo: novoSaldo, atualizadoEm: new Date().toISOString() }
      : it
  );

  const mov: Movimentacao = {
    id: uid("mov"),
    itemId: item.id,
    itemNome: item.nome,
    tipo: input.tipo,
    quantidade: qtd,
    observacao: input.observacao?.trim() || "",
    data: new Date().toISOString(),
  };

  db.movimentacoes.unshift(mov);
  saveDB(db);
  return mov;
}
