// src/source/sourceStore.js
import { gamesSource as defaultGamesSource } from "./gamesSource";
import { playersSource as defaultPlayersSource } from "./playersSource";

const STORAGE_KEY = "cw_source_bundle_v1";
const SCHEMA_VERSION = 1;

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

function makeDefaultBundle() {
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    gamesSource: defaultGamesSource,
    playersSource: defaultPlayersSource,
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
    gamesSource: Array.isArray(bundle.gamesSource) ? bundle.gamesSource : defaultGamesSource,
    playersSource: Array.isArray(bundle.playersSource) ? bundle.playersSource : defaultPlayersSource,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

export function resetBundleToDefaults() {
  if (!hasWindow()) return;
  window.localStorage.removeItem(STORAGE_KEY);
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
  // Accept either a full bundle OR raw arrays (for convenience)
  let bundle = obj;

  if (Array.isArray(obj)) {
    // ambiguous; reject
    return { ok: false, error: "Import failed: expected an object, got an array." };
  }

  // If user imports {gamesSource:[...], playersSource:[...]} without schemaVersion, accept.
  const games = bundle?.gamesSource;
  const players = bundle?.playersSource;

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
