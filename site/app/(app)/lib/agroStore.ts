export type MovTipo = "ENTRADA" | "SAIDA";

export type EstoqueItem = {
  id: string;
  nome: string;
  saldo: number;
  minimo: number;
  criadoEm: string;
  atualizadoEm: string;
};

export type Movimentacao = {
  id: string;
  itemId: string;
  itemNome: string;
  tipo: MovTipo;
  quantidade: number;
  obs?: string;
  data: string; // ISO
};

export type Sexo = "MACHO" | "FEMEA" | "NAO_INFORMADO";
export type Categoria = "BEZERRO" | "GARROTE" | "NOVILHA" | "VACA" | "TOURO" | "OUTRO";

export type Animal = {
  id: string;
  brinco: string;
  sexo: Sexo;
  categoria: Categoria;
  lote?: string;
  nascimento?: string; // yyyy-mm-dd
  criadoEm: string;
};

export type Pesagem = {
  id: string;
  animalId: string;
  brinco: string;
  peso: number;
  data: string; // yyyy-mm-dd
  obs?: string;
  criadoEm: string;
};

export type OSStatus = "ABERTA" | "EM_ANDAMENTO" | "FINALIZADA";

export type OSItem = {
  id: string;
  titulo: string;
  responsavel: string;
  status: OSStatus;
  criadoEm: string;
  atualizadoEm: string;
};

export type DB = {
  estoque: EstoqueItem[];
  movimentacoes: Movimentacao[];
  rebanho: Animal[];
  pesagens: Pesagem[];
  os: OSItem[];
  updatedAt: string;
};

const KEY = "AGROGESTOR_DB_V1";

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function nowISO() {
  return new Date().toISOString();
}

export function loadDB(): DB {
  if (typeof window === "undefined") {
    // SSR: retorna vazio
    return {
      estoque: [],
      movimentacoes: [],
      rebanho: [],
      pesagens: [],
      os: [],
      updatedAt: nowISO(),
    };
  }

  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const empty: DB = {
      estoque: [],
      movimentacoes: [],
      rebanho: [],
      pesagens: [],
      os: [],
      updatedAt: nowISO(),
    };
    localStorage.setItem(KEY, JSON.stringify(empty));
    return empty;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DB>;
    return {
      estoque: parsed.estoque ?? [],
      movimentacoes: parsed.movimentacoes ?? [],
      rebanho: parsed.rebanho ?? [],
      pesagens: parsed.pesagens ?? [],
      os: parsed.os ?? [],
      updatedAt: parsed.updatedAt ?? nowISO(),
    };
  } catch {
    const empty: DB = {
      estoque: [],
      movimentacoes: [],
      rebanho: [],
      pesagens: [],
      os: [],
      updatedAt: nowISO(),
    };
    localStorage.setItem(KEY, JSON.stringify(empty));
    return empty;
  }
}

function saveDB(db: DB) {
  db.updatedAt = nowISO();
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(db));
  }
}

/* ===== ESTOQUE ===== */
export function addEstoqueItem(nome: string, saldo: number, minimo: number) {
  const db = loadDB();
  const item: EstoqueItem = {
    id: uid("est"),
    nome: nome.trim(),
    saldo: Number(saldo) || 0,
    minimo: Number(minimo) || 0,
    criadoEm: nowISO(),
    atualizadoEm: nowISO(),
  };
  db.estoque = [item, ...db.estoque];
  saveDB(db);
}

export function updateEstoqueItem(id: string, patch: Partial<Omit<EstoqueItem, "id" | "criadoEm">>) {
  const db = loadDB();
  db.estoque = db.estoque.map((it) =>
    it.id === id ? { ...it, ...patch, atualizadoEm: nowISO() } : it
  );
  saveDB(db);
}

export function deleteEstoqueItem(id: string) {
  const db = loadDB();
  const it = db.estoque.find((x) => x.id === id);
  db.estoque = db.estoque.filter((x) => x.id !== id);

  // também remove movimentações do item
  if (it) {
    db.movimentacoes = db.movimentacoes.filter((m) => m.itemId !== it.id);
  }

  saveDB(db);
}

export function addMovimentacao(itemId: string, tipo: MovTipo, quantidade: number, obs?: string) {
  const db = loadDB();
  const item = db.estoque.find((x) => x.id === itemId);
  if (!item) return;

  const q = Math.max(0, Number(quantidade) || 0);

  // ajusta saldo
  const novoSaldo = tipo === "ENTRADA" ? item.saldo + q : item.saldo - q;

  db.estoque = db.estoque.map((x) =>
    x.id === itemId ? { ...x, saldo: novoSaldo, atualizadoEm: nowISO() } : x
  );

  const mov: Movimentacao = {
    id: uid("mov"),
    itemId,
    itemNome: item.nome,
    tipo,
    quantidade: q,
    obs: obs?.trim() ? obs.trim() : undefined,
    data: nowISO(),
  };

  db.movimentacoes = [mov, ...db.movimentacoes];
  saveDB(db);
}

/* ===== REBANHO ===== */
export function addAnimal(data: {
  brinco: string;
  sexo: Sexo;
  categoria: Categoria;
  lote?: string;
  nascimento?: string;
}) {
  const db = loadDB();
  const animal: Animal = {
    id: uid("ani"),
    brinco: data.brinco.trim(),
    sexo: data.sexo,
    categoria: data.categoria,
    lote: data.lote?.trim() ? data.lote.trim() : undefined,
    nascimento: data.nascimento?.trim() ? data.nascimento.trim() : undefined,
    criadoEm: nowISO(),
  };
  db.rebanho = [animal, ...db.rebanho];
  saveDB(db);
}

export function deleteAnimal(animalId: string) {
  const db = loadDB();
  const ani = db.rebanho.find((a) => a.id === animalId);
  db.rebanho = db.rebanho.filter((a) => a.id !== animalId);

  // remove pesagens do animal
  if (ani) db.pesagens = db.pesagens.filter((p) => p.animalId !== ani.id);

  saveDB(db);
}

export function addPesagem(data: {
  animalId: string;
  peso: number;
  data: string; // yyyy-mm-dd
  obs?: string;
}) {
  const db = loadDB();
  const ani = db.rebanho.find((a) => a.id === data.animalId);
  if (!ani) return;

  const pes: Pesagem = {
    id: uid("pes"),
    animalId: ani.id,
    brinco: ani.brinco,
    peso: Number(data.peso) || 0,
    data: data.data,
    obs: data.obs?.trim() ? data.obs.trim() : undefined,
    criadoEm: nowISO(),
  };

  db.pesagens = [pes, ...db.pesagens];
  saveDB(db);
}

/* ===== OS ===== */
export function addOS(titulo: string, responsavel: string) {
  const db = loadDB();
  const os: OSItem = {
    id: uid("os"),
    titulo: titulo.trim(),
    responsavel: responsavel.trim(),
    status: "ABERTA",
    criadoEm: nowISO(),
    atualizadoEm: nowISO(),
  };
  db.os = [os, ...db.os];
  saveDB(db);
}

export function updateOS(id: string, patch: Partial<Omit<OSItem, "id" | "criadoEm">>) {
  const db = loadDB();
  db.os = db.os.map((o) => (o.id === id ? { ...o, ...patch, atualizadoEm: nowISO() } : o));
  saveDB(db);
}

export function deleteOS(id: string) {
  const db = loadDB();
  db.os = db.os.filter((o) => o.id !== id);
  saveDB(db);
}
