export type MovTipo = "ENTRADA" | "SAIDA";

export type EstoqueItem = {
  id: string;
  nome: string;
  saldo: number;
  minimo: number;
  atualizadoEm: string;
};

export type Movimentacao = {
  id: string;
  data: string;
  tipo: MovTipo;
  itemId: string;
  itemNome: string;
  quantidade: number;
  obs?: string;
};

export type Animal = {
  id: string;
  brinco: string;
  sexo: "Macho" | "Fêmea";
  categoria: string;
  lote?: string;
  nascimento?: string;
  criadoEm: string;
};

export type Pesagem = {
  id: string;
  animalId: string;
  brinco: string;
  peso: number;
  data: string;
  obs?: string;
};

export type OSStatus = "ABERTA" | "EM_ANDAMENTO" | "FINALIZADA";

export type OS = {
  id: string;
  titulo: string;
  responsavel: string;
  status: OSStatus;
  criadoEm: string;
};

export type DB = {
  lastUpdated: string;
  estoque: EstoqueItem[];
  movs: Movimentacao[];
  animais: Animal[];
  pesagens: Pesagem[];
  os: OS[];
};

const KEY = "AGRO_DB_V1";

function nowISO() {
  return new Date().toISOString();
}
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function loadDB(): DB {
  if (typeof window === "undefined") {
    return {
      lastUpdated: nowISO(),
      estoque: [],
      movs: [],
      animais: [],
      pesagens: [],
      os: [],
    };
  }

  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const fresh: DB = {
      lastUpdated: nowISO(),
      estoque: [],
      movs: [],
      animais: [],
      pesagens: [],
      os: [],
    };
    localStorage.setItem(KEY, JSON.stringify(fresh));
    return fresh;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DB>;
    return {
      lastUpdated: parsed.lastUpdated ?? nowISO(),
      estoque: parsed.estoque ?? [],
      movs: parsed.movs ?? [],
      animais: parsed.animais ?? [],
      pesagens: parsed.pesagens ?? [],
      os: parsed.os ?? [],
    };
  } catch {
    const fresh: DB = {
      lastUpdated: nowISO(),
      estoque: [],
      movs: [],
      animais: [],
      pesagens: [],
      os: [],
    };
    localStorage.setItem(KEY, JSON.stringify(fresh));
    return fresh;
  }
}

export function saveDB(db: DB) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function touchDB() {
  const db = loadDB();
  db.lastUpdated = nowISO();
  saveDB(db);
}

/* ========= ESTOQUE ========= */
export function addEstoqueItem(nome: string, saldo: number, minimo: number) {
  const db = loadDB();
  db.estoque.unshift({
    id: uid(),
    nome: nome.trim(),
    saldo: Number(saldo) || 0,
    minimo: Number(minimo) || 0,
    atualizadoEm: nowISO(),
  });
  db.lastUpdated = nowISO();
  saveDB(db);
}

export function deleteEstoqueItem(id: string) {
  const db = loadDB();
  db.estoque = db.estoque.filter((it) => it.id !== id);
  db.lastUpdated = nowISO();
  saveDB(db);
}

export function addMovimentacao(tipo: MovTipo, itemId: string, quantidade: number, obs?: string) {
  const db = loadDB();
  const it = db.estoque.find((x) => x.id === itemId);
  if (!it) return;

  const q = Number(quantidade) || 0;
  if (q <= 0) return;

  if (tipo === "ENTRADA") it.saldo += q;
  if (tipo === "SAIDA") it.saldo -= q;

  it.atualizadoEm = nowISO();

  db.movs.unshift({
    id: uid(),
    data: nowISO(),
    tipo,
    itemId,
    itemNome: it.nome,
    quantidade: q,
    obs,
  });

  db.lastUpdated = nowISO();
  saveDB(db);
}

/* ========= REBANHO ========= */
export function addAnimal(brinco: string, sexo: "Macho" | "Fêmea", categoria: string, lote?: string, nascimento?: string) {
  const db = loadDB();
  db.animais.unshift({
    id: uid(),
    brinco: brinco.trim(),
    sexo,
    categoria,
    lote: lote?.trim(),
    nascimento: nascimento?.trim(),
    criadoEm: nowISO(),
  });
  db.lastUpdated = nowISO();
  saveDB(db);
}

export function addPesagem(animalId: string, peso: number, dataISO: string, obs?: string) {
  const db = loadDB();
  const a = db.animais.find((x) => x.id === animalId);
  if (!a) return;

  db.pesagens.unshift({
    id: uid(),
    animalId,
    brinco: a.brinco,
    peso: Number(peso) || 0,
    data: dataISO || nowISO(),
    obs,
  });

  db.lastUpdated = nowISO();
  saveDB(db);
}

/* ========= OS ========= */
export function addOS(titulo: string, responsavel: string) {
  const db = loadDB();
  db.os.unshift({
    id: uid(),
    titulo: titulo.trim(),
    responsavel: responsavel.trim(),
    status: "ABERTA",
    criadoEm: nowISO(),
  });
  db.lastUpdated = nowISO();
  saveDB(db);
}

export function setOSStatus(id: string, status: OSStatus) {
  const db = loadDB();
  const o = db.os.find((x) => x.id === id);
  if (!o) return;
  o.status = status;
  db.lastUpdated = nowISO();
  saveDB(db);
}
