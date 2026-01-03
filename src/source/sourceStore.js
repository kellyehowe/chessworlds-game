// src/source/sourceStore.js
import defaultBundle from "./defaultSourceBundle.json";

const STORAGE_KEY = "cw_source_bundle_v1";
const SCHEMA_VERSION = 1;

let listeners = new Set();
function notify() {
  for (const fn of listeners) {
    try { fn(); } catch (e) { console.error("sourceStore listener error", e); }
  }
}

export function subscribeSourceChanges(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function hasWindow() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParse(json) {
  try { return { ok: true, value: JSON.parse(json) }; }
  catch { return { ok: false, value: null }; }
}

function deepClone(x) {
  if (typeof structuredClone === "function") return structuredClone(x);
  return JSON.parse(JSON.stringify(x));
}

function makeDefaultBundle() {
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    gamesSource: deepClone(defaultBundle.gamesSource || []),
    playersSource: deepClone(defaultBundle.playersSource || []),
  };
}

export function loadBundle() {
  if (!hasWindow()) return makeDefaultBundle();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return makeDefaultBundle();

  const parsed = safeParse(raw);
  if (!parsed.ok || !parsed.value) return makeDefaultBundle();

  const b = parsed.value;
  if (b.schemaVersion !== SCHEMA_VERSION || !Array.isArray(b.gamesSource) || !Array.isArray(b.playersSource)) {
    return makeDefaultBundle();
  }
  return b;
}

export function saveBundle(bundle) {
  if (!hasWindow()) return;

  const toSave = {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    gamesSource: Array.isArray(bundle.gamesSource)
      ? deepClone(bundle.gamesSource)
      : deepClone(defaultBundle.gamesSource || []),
    playersSource: Array.isArray(bundle.playersSource)
      ? deepClone(bundle.playersSource)
      : deepClone(defaultBundle.playersSource || []),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  notify();
}

export function resetBundleToDefaults() {
  if (!hasWindow()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  notify();
}

export const getEffectiveGames = () => loadBundle().gamesSource;
export const getEffectivePlayers = () => loadBundle().playersSource;

export function setEffectiveGames(games) {
  const b = loadBundle();
  b.gamesSource = games;
  saveBundle(b);
}

export function setEffectivePlayers(players) {
  const b = loadBundle();
  b.playersSource = players;
  saveBundle(b);
}

export const exportBundleObject = () => loadBundle();

export function importBundleObject(obj) {
  if (Array.isArray(obj)) return { ok: false, error: "Import failed: expected an object, got an array." };

  const games = obj?.gamesSource;
  const players = obj?.playersSource;

  if (!Array.isArray(games) || !Array.isArray(players)) {
    return { ok: false, error: "Import failed: file must include gamesSource[] and playersSource[] arrays." };
  }

  saveBundle({
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    gamesSource: games,
    playersSource: players,
  });

  return { ok: true };
}
