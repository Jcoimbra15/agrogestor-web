"use client";

/**
 * AgroGestor - DB localStorage (v1)
 * Objetivo: nunca quebrar por DB undefined/incompleto e manter exports consistentes.
 */

export type MovTipo = "ENTRADA" | "SAIDA";

export type Sexo = "Macho" | "Fêmea" | "Não informado";
export type Categoria = "Bezerro" | "Novilho" | "Vaca" | "Touro" | "Outro";

export type EstoqueItem = {
  id: string;
  nome: string;
  saldo: number;
  minimo: number;
};

export type Movimentacao = {
  id: string;
  itemId: string;
  itemNome: string;
  tipo: MovTipo;
  quantidade: number;
  obs?: string;
  criadoEm: string; // ISO
};

export type Animal = {
  id: string;
  brinco: string;
  sexo: Sexo;
  categoria: Categoria;
  lote?: string;
  nascimento?: string; // yyyy-mm-dd
  criadoEm: string; // ISO
};

export type Pesagem = {
  id: string;
  animalId: string;
  animalBrinco: string;
  pesoKg: number;
  data: string; // yyyy-mm-dd
  obs?: string;
  criadoEm: string; // ISO
};

export type OSStatus = "ABERTA" | "EM_ANDAMENTO" | "FINALIZADA";

export type OS = {
  id: string;
  titulo: string;
  responsavel: string;
  status: OSStatus;
  criadoEm: string; // ISO
  iniciadoEm?: string; // ISO
  finalizadoEm?: string; // ISO
};

export type Meta = {
  version: 1;
  lastUpdated: string; // ISO
};

export type DB = {
  meta: Meta;
  estoque: EstoqueItem[];
  movimentacoes: Movimentacao[];
  animais: Animal[];
  pesagens: Pesagem[];
  os: OS[];
};

const KEY = "agrogestor_db_v1";

function nowISO() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function clampNumber(n: unknown, fallback = 0) {
  const x = typeof n === "number" ? n : Number(n);
  return Number.isFinite(x) ? x : fallback;
}

function safeTrim(s: unknown) {
  return (typeof s === "string" ? s : "").trim();
}

function emptyDB(): DB {
  return {
    meta: { version: 1, lastUpdated: nowISO() },
    estoque: [],
    movimentacoes: [],
    animais: [],
    pesagens: [],
    os: [],
  };
}

/** Garante formato do DB mesmo se o localStorage estiver "sujo" */
function normalizeDB(raw: any): DB {
  const base = emptyDB();

  if (!raw || typeof raw !== "object") return base;

  const meta: Meta = {
    version: 1,
    lastUpdated: typeof raw?.meta?.lastUpdated === "string" ? raw.meta.lastUpdated : base.meta.lastUpdated,
  };

  const estoque: EstoqueItem[] = Array.isArray(raw?.estoque)
    ? raw.estoque
        .map((it: any) => ({
          id: safeTrim(it?.id) || uid("est"),
          nome: safeTrim(it?.nome),
          saldo: clampNumber(it?.saldo, 0),
          minimo: clampNumber(it?.minimo, 0),
        }))
        .filter((it: EstoqueItem) => it.nome.length > 0)
    : [];

  const movimentacoes: Movimentacao[] = Array.isArray(raw?.movimentacoes)
    ? raw.movimentacoes
        .map((m: any) => ({
          id: safeTrim(m?.id) || uid("mov"),
          itemId: safeTrim(m?.itemId),
          itemNome: safeTrim(m?.itemNome),
          tipo: m?.tipo === "SAIDA" ? "SAIDA" : "ENTRADA",
          quantidade: clampNumber(m?.quantidade, 0),
          obs: safeTrim(m?.obs) || undefined,
          criadoEm: typeof m?.criadoEm === "string" ? m.criadoEm : base.meta.lastUpdated,
        }))
        .filter((m: Movimentacao) => m.itemId.length > 0 && m.itemNome.length > 0 && m.quantidade > 0)
    : [];

  const animais: Animal[] = Array.isArray(raw?.animais)
    ? raw.animais
        .map((a: any) => ({
          id: safeTrim(a?.id) || uid("ani"),
          brinco: safeTrim(a?.brinco),
          sexo: (a?.sexo === "Macho" || a?.sexo === "Fêmea" || a?.sexo === "Não informado") ? a.sexo : "Não informado",
          categoria:
            a?.categoria === "Bezerro" || a?.categoria === "Novilho" || a?.categoria === "Vaca" || a?.categoria === "Touro" || a?.categoria === "Outro"
              ? a.categoria
              : "Outro",
          lote: safeTrim(a?.lote) || undefined,
          nascimento: safeTrim(a?.nascimento) || undefined,
          criadoEm: typeof a?.criadoEm === "string" ? a.criadoEm : base.meta.lastUpdated,
        }))
        .filter((a: Animal) => a.brinco.length > 0)
    : [];

  const pesagens: Pesagem[] = Array.isArray(raw?.pesagens)
    ? raw.pesagens
        .map((p: any) => ({
          id: safeTrim(p?.id) || uid("pes"),
          animalId: safeTrim(p?.animalId),
          animalBrinco: safeTrim(p?.animalBrinco),
          pesoKg: clampNumber(p?.pesoKg, 0),
          data: safeTrim(p?.data),
          obs: safeTrim(p?.obs) || undefined,
          criadoEm: typeof p?.criadoEm === "string" ? p.criadoEm : base.meta.lastUpdated,
        }))
        .filter((p: Pesagem) => p.animalId.length > 0 && p.animalBrinco.length > 0 && p.pesoKg > 0 && p.data.length > 0)
    : [];

  const os: OS[] = Array.isArray(raw?.os)
    ? raw.os
        .map((o: any) => ({
          id: safeTrim(o?.id) || uid("os"),
          titulo: safeTrim(o?.titulo),
          responsavel: safeTrim(o?.responsavel),
          status: o?.status === "EM_ANDAMENTO" ? "EM_ANDAMENTO" : o?.status === "FINALIZADA" ? "FINALIZADA" : "ABERTA",
          criadoEm: typeof o?.criadoEm === "string" ? o.criadoEm : base.meta.lastUpdated,
          iniciadoEm: typeof o?.iniciadoEm === "string" ? o.iniciadoEm : undefined,
          finalizadoEm: typeof o?.finalizadoEm === "string" ? o.finalizadoEm : undefined,
        }))
        .filter((o: OS) => o.titulo.length > 0 && o.responsavel.length > 0)
    : [];

  return { meta, estoque, movimentacoes, animais, pesagens, os };
}

export function loadDB(): DB {
  try {
    if (typeof window === "undefined") return emptyDB();
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const fresh = emptyDB();
      window.localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    const parsed = JSON.parse(raw);
    const normalized = normalizeDB(parsed);

    // salva normalizado (corrige DB antigo/bugado)
    window.localStorage.setItem(KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    const fresh = emptyDB();
    try {
      window.localStorage.setItem(KEY, JSON.stringify(fresh));
    } catch {}
    return fresh;
  }
}

export function saveDB(db: DB): DB {
  const next: DB = {
    ...db,
    meta: { version: 1, lastUpdated: nowISO() },
    estoque: Array.isArray(db.estoque) ? db.estoque : [],
    movimentacoes: Array.isArray(db.movimentacoes) ? db.movimentacoes : [],
    animais: Array.isArray(db.animais) ? db.animais : [],
    pesagens: Array.isArray(db.pesagens) ? db.pesagens : [],
    os: Array.isArray(db.os) ? db.os : [],
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  return next;
}

/* ---------------------- ESTOQUE ---------------------- */

export function addEstoqueItem(nome: string, saldo: number, minimo: number): DB {
  const db = loadDB();
  const n = safeTrim(nome);
  if (!n) return db;

  const item: EstoqueItem = {
    id: uid("est"),
    nome: n,
    saldo: clampNumber(saldo, 0),
    minimo: clampNumber(minimo, 0),
  };

  const next = { ...db, estoque: [item, ...db.estoque] };
  return saveDB(next);
}

export function deleteEstoqueItem(itemId: string): DB {
  const db = loadDB();
  const id = safeTrim(itemId);
  if (!id) return db;

  const next = {
    ...db,
    estoque: db.estoque.filter((i) => i.id !== id),
    movimentacoes: db.movimentacoes.filter((m) => m.itemId !== id),
  };
  return saveDB(next);
}

export function addMovimentacao(itemId: string, tipo: MovTipo, quantidade: number, obs?: string): DB {
  const db = loadDB();
  const id = safeTrim(itemId);
  const qty = clampNumber(quantidade, 0);
  if (!id || qty <= 0) return db;

  const item = db.estoque.find((i) => i.id === id);
  if (!item) return db;

  const t: MovTipo = tipo === "SAIDA" ? "SAIDA" : "ENTRADA";

  const mov: Movimentacao = {
    id: uid("mov"),
    itemId: item.id,
    itemNome: item.nome,
    tipo: t,
    quantidade: qty,
    obs: safeTrim(obs) || undefined,
    criadoEm: nowISO(),
  };

  const estoqueAtualizado = db.estoque.map((i) => {
    if (i.id !== item.id) return i;
    const novoSaldo = t === "ENTRADA" ? i.saldo + qty : Math.max(0, i.saldo - qty);
    return { ...i, saldo: novoSaldo };
  });

  const next = {
    ...db,
    estoque: estoqueAtualizado,
    movimentacoes: [mov, ...db.movimentacoes],
  };

  return saveDB(next);
}

export function getEstoqueAlertas(db: DB): EstoqueItem[] {
  const safe = normalizeDB(db);
  return safe.estoque.filter((i) => i.saldo <= i.minimo);
}

/* ---------------------- REBANHO ---------------------- */

export function addAnimal(params: {
  brinco: string;
  sexo: Sexo;
  categoria: Categoria;
  lote?: string;
  nascimento?: string;
}): DB {
  const db = loadDB();
  const brinco = safeTrim(params.brinco);
  if (!brinco) return db;

  const animal: Animal = {
    id: uid("ani"),
    brinco,
    sexo: params.sexo ?? "Não informado",
    categoria: params.categoria ?? "Outro",
    lote: safeTrim(params.lote) || undefined,
    nascimento: safeTrim(params.nascimento) || undefined,
    criadoEm: nowISO(),
  };

  const next = { ...db, animais: [animal, ...db.animais] };
  return saveDB(next);
}

export function deleteAnimal(animalId: string): DB {
  const db = loadDB();
  const id = safeTrim(animalId);
  if (!id) return db;

  const next = {
    ...db,
    animais: db.animais.filter((a) => a.id !== id),
    pesagens: db.pesagens.filter((p) => p.animalId !== id),
  };
  return saveDB(next);
}

export function addPesagem(params: {
  animalId: string;
  pesoKg: number;
  data: string; // yyyy-mm-dd
  obs?: string;
}): DB {
  const db = loadDB();
  const animalId = safeTrim(params.animalId);
  const peso = clampNumber(params.pesoKg, 0);
  const data = safeTrim(params.data);
  if (!animalId || peso <= 0 || !data) return db;

  const animal = db.animais.find((a) => a.id === animalId);
  if (!animal) return db;

  const pesagem: Pesagem = {
    id: uid("pes"),
    animalId: animal.id,
    animalBrinco: animal.brinco,
    pesoKg: peso,
    data,
    obs: safeTrim(params.obs) || undefined,
    criadoEm: nowISO(),
  };

  const next = { ...db, pesagens: [pesagem, ...db.pesagens] };
  return saveDB(next);
}

/* ---------------------- OS ---------------------- */

export function addOS(titulo: string, responsavel: string): DB {
  const db = loadDB();
  const t = safeTrim(titulo);
  const r = safeTrim(responsavel);
  if (!t || !r) return db;

  const os: OS = {
    id: uid("os"),
    titulo: t,
    responsavel: r,
    status: "ABERTA",
    criadoEm: nowISO(),
  };

  const next = { ...db, os: [os, ...db.os] };
  return saveDB(next);
}

export function iniciarOS(id: string): DB {
  return updateOS(id, { status: "EM_ANDAMENTO", iniciadoEm: nowISO() });
}

export function finalizarOS(id: string): DB {
  return updateOS(id, { status: "FINALIZADA", finalizadoEm: nowISO() });
}

export function deleteOS(id: string): DB {
  const db = loadDB();
  const osId = safeTrim(id);
  if (!osId) return db;

  const next = { ...db, os: db.os.filter((o) => o.id !== osId) };
  return saveDB(next);
}

/**
 * Atualiza OS (export que as telas podem usar)
 * Nota: aqui o status é tipado, então nada de string solta quebrando o TS.
 */
export function updateOS(id: string, patch: Partial<OS>): DB {
  const db = loadDB();
  const osId = safeTrim(id);
  if (!osId) return db;

  const nextOS = db.os.map((o) => {
    if (o.id !== osId) return o;

    const merged: OS = {
      ...o,
      ...patch,
      status:
        patch.status === "ABERTA" || patch.status === "EM_ANDAMENTO" || patch.status === "FINALIZADA"
          ? patch.status
          : o.status,
    };
    return merged;
  });

  return saveDB({ ...db, os: nextOS });
}
