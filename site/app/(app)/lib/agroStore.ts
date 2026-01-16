export type EstoqueItem = {
  id: string;
  nome: string;
  saldo: number;
  minimo: number;
  criadoEm: string;
  atualizadoEm: string;
};

export type MovTipo = "Entrada" | "Saida";

export type Movimentacao = {
  id: string;
  itemId: string;
  itemNome: string;
  tipo: MovTipo;
  quantidade: number;
  obs?: string;
  data: string; // ISO
};

export type OSStatus = "Aberta" | "Em andamento" | "Finalizada";

export type OS = {
  id: string;
  titulo: string;
  responsavel: string;
  status: OSStatus;
  criadoEm: string;
  atualizadoEm: string;
};

export type Sexo = "Macho" | "Fêmea" | "Não informado";
export type Categoria = "Bezerro" | "Novilho" | "Vaca" | "Touro" | "Outro";

export type Animal = {
  id: string; // brinco/ID
  sexo: Sexo;
  categoria: Categoria;
  lote?: string;
  nascimento?: string; // YYYY-MM-DD
  criadoEm: string;
};

export type Pesagem = {
  id: string;
  animalId: string;
  pesoKg: number;
  data: string; // YYYY-MM-DD
  obs?: string;
  criadoEm: string;
};

export type DB = {
  estoque: EstoqueItem[];
  movimentacoes: Movimentacao[];
  os: OS[];
  animais: Animal[];
  pesagens: Pesagem[];
  atualizadoEm: string; // ISO
};

const KEY = "agrogestor_db_v1";

function nowISO() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function loadDB(): DB {
  if (typeof window === "undefined") {
    return {
      estoque: [],
      movimentacoes: [],
      os: [],
      animais: [],
      pesagens: [],
      atualizadoEm: nowISO(),
    };
  }
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const empty: DB = {
      estoque: [],
      movimentacoes: [],
      os: [],
      animais: [],
      pesagens: [],
      atualizadoEm: nowISO(),
    };
    localStorage.setItem(KEY, JSON.stringify(empty));
    return empty;
  }

  try {
    const parsed = JSON.parse(raw) as DB;
    // Garantir campos (caso tenha DB antigo)
    return {
      estoque: parsed.estoque ?? [],
      movimentacoes: parsed.movimentacoes ?? [],
      os: parsed.os ?? [],
      animais: parsed.animais ?? [],
      pesagens: parsed.pesagens ?? [],
      atualizadoEm: parsed.atualizadoEm ?? nowISO(),
    };
  } catch {
    const empty: DB = {
      estoque: [],
      movimentacoes: [],
      os: [],
      animais: [],
      pesagens: [],
      atualizadoEm: nowISO(),
    };
    localStorage.setItem(KEY, JSON.stringify(empty));
    return empty;
  }
}

export function saveDB(db: DB) {
  const updated: DB = { ...db, atualizadoEm: nowISO() };
  localStorage.setItem(KEY, JSON.stringify(updated));
}

/* =========================
   ESTOQUE
========================= */
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
  return item;
}

export function updateEstoqueItem(id: string, patch: Partial<Omit<EstoqueItem, "id">>) {
  const db = loadDB();
  db.estoque = db.estoque.map((it) =>
    it.id === id ? { ...it, ...patch, atualizadoEm: nowISO() } : it
  );
  saveDB(db);
}

export function deleteEstoqueItem(id: string) {
  const db = loadDB();
  const item = db.estoque.find((x) => x.id === id);
  db.estoque = db.estoque.filter((x) => x.id !== id);
  // também remove movimentações desse item
  if (item) {
    db.movimentacoes = db.movimentacoes.filter((m) => m.itemId !== item.id);
  }
  saveDB(db);
}

export function addMovimentacao(itemId: string, tipo: MovTipo, quantidade: number, obs?: string) {
  const db = loadDB();
  const item = db.estoque.find((x) => x.id === itemId);
  if (!item) throw new Error("Item não encontrado");

  const qtd = Number(quantidade) || 0;
  const mov: Movimentacao = {
    id: uid("mov"),
    itemId,
    itemNome: item.nome,
    tipo,
    quantidade: qtd,
    obs: obs?.trim() || "",
    data: nowISO(),
  };

  // atualiza saldo
  const novoSaldo = tipo === "Entrada" ? item.saldo + qtd : item.saldo - qtd;
  db.estoque = db.estoque.map((x) =>
    x.id === item.id ? { ...x, saldo: novoSaldo, atualizadoEm: nowISO() } : x
  );

  db.movimentacoes = [mov, ...db.movimentacoes];
  saveDB(db);
  return mov;
}

/* =========================
   OS
========================= */
export function addOS(titulo: string, responsavel: string) {
  const db = loadDB();
  const os: OS = {
    id: uid("os"),
    titulo: titulo.trim(),
    responsavel: responsavel.trim(),
    status: "Aberta",
    criadoEm: nowISO(),
    atualizadoEm: nowISO(),
  };
  db.os = [os, ...db.os];
  saveDB(db);
  return os;
}

export function updateOS(id: string, patch: Partial<Omit<OS, "id">>) {
  const db = loadDB();
  db.os = db.os.map((o) => (o.id === id ? { ...o, ...patch, atualizadoEm: nowISO() } : o));
  saveDB(db);
}

/* =========================
   REBANHO
========================= */
export function addAnimal(animal: Omit<Animal, "criadoEm">) {
  const db = loadDB();
  const exists = db.animais.some((a) => a.id === animal.id.trim());
  if (exists) throw new Error("Já existe um animal com esse Brinco/ID");

  const novo: Animal = {
    ...animal,
    id: animal.id.trim(),
    criadoEm: nowISO(),
  };

  db.animais = [novo, ...db.animais];
  saveDB(db);
  return novo;
}

export function deleteAnimal(id: string) {
  const db = loadDB();
  db.animais = db.animais.filter((a) => a.id !== id);
  // remove pesagens do animal
  db.pesagens = db.pesagens.filter((p) => p.animalId !== id);
  saveDB(db);
}

export function addPesagem(animalId: string, pesoKg: number, data: string, obs?: string) {
  const db = loadDB();
  const animal = db.animais.find((a) => a.id === animalId);
  if (!animal) throw new Error("Animal não encontrado");

  const p: Pesagem = {
    id: uid("pes"),
    animalId,
    pesoKg: Number(pesoKg) || 0,
    data,
    obs: obs?.trim() || "",
    criadoEm: nowISO(),
  };

  db.pesagens = [p, ...db.pesagens];
  saveDB(db);
  return p;
}
