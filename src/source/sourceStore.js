// src/source/sourceStore.js
// import { gamesSource as defaultGamesSource } from "./gamesSource";
// import { playersSource as defaultPlayersSource } from "./playersSource";

import defaultBundle from "./defaultSourceBundle.json";

const STORAGE_KEY = "cw_source_bundle_v1";
const SCHEMA_VERSION = 1;

let listeners = new Set();

function notify() {
  for (const fn of listeners) {
    try {
      fn();
    } catch (e) {
      console.error("sourceStore listener error", e);
    }
  }
}

// Call this anywhere you want UI to refresh when source changes
export function subscribeSourceChanges(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function hasWindow() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParse(json) {
  try {
    return { ok: true, value: JSON.parse(json) };
  } catch {
    return { ok: false, value: null };
  }
}

function deepClone(x) {
  // avoids accidentally mutating your imported "defaults" arrays
  if (typeof structuredClone === "function") return structuredClone(x);
  return JSON.parse(JSON.stringify(x));
}

// function makeDefaultBundle() {
//   return {
//     schemaVersion: SCHEMA_VERSION,
//     exportedAt: new Date().toISOString(),
//     gamesSource: deepClone(defaultGamesSource),
//     playersSource: deepClone(defaultPlayersSource),
//   };
// }
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
  const gamesOk = Array.isArray(b.gamesSource);
  const playersOk = Array.isArray(b.playersSource);

  if (b.schemaVersion !== SCHEMA_VERSION || !gamesOk || !playersOk) {
    return makeDefaultBundle();
  }

  return b;
}

export function saveBundle(bundle) {
  if (!hasWindow()) return;

  const toSave = {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    gamesSource: Array.isArray(bundle.gamesSource) ? deepClone(bundle.gamesSource) : deepClone(defaultGamesSource),
    playersSource: Array.isArray(bundle.playersSource) ? deepClone(bundle.playersSource) : deepClone(defaultPlayersSource),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  notify();
}

export function resetBundleToDefaults() {
  if (!hasWindow()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  notify();
}

export function getEffectiveGames() {
  return loadBundle().gamesSource;
}

export function getEffectivePlayers() {
  return loadBundle().playersSource;
}

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

export function exportBundleObject() {
  return loadBundle();
}

export function importBundleObject(obj) {
  if (Array.isArray(obj)) {
    return { ok: false, error: "Import failed: expected an object, got an array." };
  }

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
