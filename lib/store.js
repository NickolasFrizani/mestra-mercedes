// lib/store.js
// Persistência do cursor/dedupe do copy trading via Vercel Blob.
// Sem token: cai num fallback em memória (válido só dentro de UMA invocação —
// suficiente para dry-run local, NÃO para produção, por isso modo live exige Blob).

import { put, list } from "@vercel/blob";

const PATH = "copy-trade/state.json";
const EMPTY = { cursors: {}, seen: [] };
let memory = null;

export async function loadState(token) {
  if (!token) return memory || { ...EMPTY };
  try {
    const { blobs } = await list({ prefix: PATH, token });
    const b = blobs.find((x) => x.pathname === PATH) || blobs[0];
    if (!b) return { ...EMPTY };
    const res = await fetch(b.url, { cache: "no-store" });
    if (!res.ok) return { ...EMPTY };
    const json = await res.json();
    return { cursors: json.cursors || {}, seen: json.seen || [] };
  } catch {
    return { ...EMPTY };
  }
}

export async function saveState(token, state) {
  if (!token) {
    memory = state;
    return;
  }
  await put(PATH, JSON.stringify(state), {
    access: "public",
    token,
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}
