// src/source/PlayersSourcePage.jsx
import React, { useMemo, useRef, useState } from "react";
import { gamesSource } from "./gamesSource";
import {
  exportBundleObject,
  getEffectivePlayers,
  importBundleObject,
  resetBundleToDefaults,
  setEffectivePlayers,
} from "./sourceStore";

function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function normalizeName(s) {
  return String(s || "").trim();
}

function nameMatchesPlayer(gameName, player) {
  const n = normalizeName(gameName).toLowerCase();
  if (!n) return false;

  const main = normalizeName(player.name).toLowerCase();
  if (n === main) return true;

  const aliases = Array.isArray(player.aliases) ? player.aliases : [];
  for (const a of aliases) {
    const aa = normalizeName(a).toLowerCase();
    if (aa && n === aa) return true;
  }
  return false;
}

function computeStatsForPlayer(player) {
  let total = 0;
  let asWhite = 0;
  let asBlack = 0;
  const eras = new Set();

  for (const g of gamesSource) {
    if (nameMatchesPlayer(g.white, player)) {
      total += 1;
      asWhite += 1;
      if (g.era) eras.add(g.era);
    } else if (nameMatchesPlayer(g.black, player)) {
      total += 1;
      asBlack += 1;
      if (g.era) eras.add(g.era);
    }
  }

  return {
    total,
    asWhite,
    asBlack,
    eras: Array.from(eras).sort((a, b) => a.localeCompare(b)),
  };
}

export default function PlayersSourcePage({ onBack, permissions }) {
  const canEdit = !!permissions?.canEditSource;
  const canImport = !!permissions?.canImportSource;
  const canReset = !!permissions?.canResetSource;

  const [viewMode, setViewMode] = useState("human");
  const [players, setPlayers] = useState(() => getEffectivePlayers());
  const fileRef = useRef(null);

  const orderedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      const ao = Number.isFinite(a.worldOrder) ? a.worldOrder : 9999;
      const bo = Number.isFinite(b.worldOrder) ? b.worldOrder : 9999;
      if (ao !== bo) return ao - bo;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
  }, [players]);

  const playersWithDerived = useMemo(() => {
    return orderedPlayers.map((p) => ({ ...p, _derived: computeStatsForPlayer(p) }));
  }, [orderedPlayers]);

  const tocItems = useMemo(
    () =>
      playersWithDerived.map((p) => ({
        id: p.id,
        label: `${p.worldOrder ? `${p.worldOrder}. ` : ""}${p.name} (${p._derived.total})`,
      })),
    [playersWithDerived]
  );

  function saveToBrowser(nextPlayers) {
    setEffectivePlayers(nextPlayers);
  }

  function handleDownloadBundle() {
    const bundle = exportBundleObject();
    downloadJson("chessworlds-source-bundle.json", bundle);
  }

  function handleImportClick() {
    fileRef.current?.click();
  }

  async function handleImportFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const text = await file.text();
    let obj;
    try {
      obj = JSON.parse(text);
    } catch {
      alert("Import failed: file is not valid JSON.");
      return;
    }

    const res = importBundleObject(obj);
    if (!res.ok) {
      alert(res.error || "Import failed.");
      return;
    }

    setPlayers(getEffectivePlayers());
    alert("Imported! Reloading source data from this browser.");
  }

  function handleResetDefaults() {
    if (!confirm("Reset source data to defaults for THIS browser?")) return;
    resetBundleToDefaults();
    setPlayers(getEffectivePlayers());
  }

  const renderHuman = () => (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <aside style={{ width: 320, position: "sticky", top: 16 }}>
        <div style={{ opacity: 0.8, marginBottom: 8 }}>Table of Contents</div>
        <div style={{ maxHeight: "70vh", overflow: "auto", paddingRight: 8 }}>
          {tocItems.map((t) => (
            <div key={t.id} style={{ marginBottom: 10, lineHeight: 1.2 }}>
              <a href={`#${t.id}`} style={{ fontSize: 13 }}>
                {t.label}
              </a>
            </div>
          ))}
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        {playersWithDerived.map((p) => {
          const stats = p._derived;
          const showInGameplay = p.show !== false;

          return (
            <section key={p.id} id={p.id} style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <h2 style={{ marginBottom: 6 }}>{p.worldName || p.name}</h2>
                {!showInGameplay ? (
                  <span style={{ fontSize: 12, opacity: 0.7 }}>(hidden from gameplay)</span>
                ) : null}
              </div>

              <div style={{ opacity: 0.8, marginBottom: 8 }}>
                <strong>{p.name}</strong>
                {Number.isFinite(p.worldOrder) ? (
                  <span style={{ opacity: 0.7 }}> • worldOrder: {p.worldOrder}</span>
                ) : null}
              </div>

              {p.description ? <div style={{ opacity: 0.85, marginBottom: 10 }}>{p.description}</div> : null}

              <div style={{ opacity: 0.8, marginBottom: 10 }}>
                Games: <strong>{stats.total}</strong> • as White: <strong>{stats.asWhite}</strong> • as Black:{" "}
                <strong>{stats.asBlack}</strong>
              </div>

              {stats.eras.length ? (
                <div style={{ opacity: 0.7, marginBottom: 10 }}>Eras: {stats.eras.join(", ")}</div>
              ) : null}

              {p.aliases?.length ? (
                <div style={{ opacity: 0.7, marginBottom: 10 }}>Aliases: {p.aliases.join(", ")}</div>
              ) : null}

              {p.notes ? (
                <div style={{ opacity: 0.85, marginBottom: 12 }}>{p.notes}</div>
              ) : (
                <div style={{ opacity: 0.5, marginBottom: 12 }}>(notes empty)</div>
              )}

              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.65 }}>
                id: {p.id} • show: {String(p.show)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );

  const renderStructured = () => (
    <textarea
      style={{ width: "100%", minHeight: "60vh" }}
      readOnly={!canEdit}
      value={JSON.stringify(players, null, 2)}
      onChange={(e) => {
        if (!canEdit) return;
        try {
          const next = JSON.parse(e.target.value);
          setPlayers(next);
          saveToBrowser(next);
        } catch {
          // ignore while typing
        }
      }}
    />
  );

  const renderString = () => (
    <textarea style={{ width: "100%", minHeight: "60vh" }} readOnly value={JSON.stringify(players)} />
  );

  return (
    <main style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <button onClick={onBack}>← Back</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 16 }}>
        <h1 style={{ margin: 0 }}>Players — Source</h1>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={handleDownloadBundle}>
            Download JSON
          </button>

          {canImport ? (
            <>
              <button type="button" onClick={handleImportClick}>
                Import JSON
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                style={{ display: "none" }}
                onChange={handleImportFile}
              />
            </>
          ) : null}

          {canReset ? (
            <button type="button" onClick={handleResetDefaults} style={{ opacity: 0.85 }}>
              Reset Defaults
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ margin: "1rem 0" }}>
        <button onClick={() => setViewMode("human")}>Human</button>{" "}
        <button onClick={() => setViewMode("structured")}>JSON Structured</button>{" "}
        <button onClick={() => setViewMode("string")}>JSON String</button>
      </div>

      {viewMode === "human" && renderHuman()}
      {viewMode === "structured" && renderStructured()}
      {viewMode === "string" && renderString()}
    </main>
  );
}
