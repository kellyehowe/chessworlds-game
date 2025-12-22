// src/source/GamesSourcePage.jsx
import React, { useMemo, useRef, useState } from "react";
import {
  exportBundleObject,
  getEffectiveGames,
  importBundleObject,
  resetBundleToDefaults,
  setEffectiveGames,
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

export default function GamesSourcePage({ onBack, permissions }) {
  const canEdit = !!permissions?.canEditSource;
  const canImport = !!permissions?.canImportSource;
  const canReset = !!permissions?.canResetSource;

  const [viewMode, setViewMode] = useState("human");
  const [games, setGames] = useState(() => getEffectiveGames());
  const fileRef = useRef(null);

  const visibleGames = games;

  const tocItems = useMemo(
    () =>
      visibleGames.map((g) => ({
        id: g.id,
        label: `${g.nickname || g.officialName || g.id} — ${g.white} vs ${g.black} (${g.year || g.date || "?"})${
          g.show === false ? " ⓘ" : ""
        }`,
        hidden: g.show === false,
      })),
    [visibleGames]
  );

  function saveToBrowser(nextGames) {
    setEffectiveGames(nextGames);
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

    const nextGames = getEffectiveGames();
    setGames(nextGames);
    alert("Imported! Reloading source data from this browser.");
  }

  function handleResetDefaults() {
    if (!confirm("Reset source data to defaults for THIS browser?")) return;
    resetBundleToDefaults();
    setGames(getEffectiveGames());
  }

  const renderHuman = () => (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <aside style={{ width: 320, position: "sticky", top: 16 }}>
        <div style={{ opacity: 0.8, marginBottom: 8 }}>Table of Contents</div>
        <div style={{ maxHeight: "70vh", overflow: "auto", paddingRight: 8 }}>
          {tocItems.map((t) => (
            <div key={t.id} style={{ marginBottom: 10, lineHeight: 1.2 }}>
              <a href={`#${t.id}`} style={{ fontSize: 13, opacity: t.hidden ? 0.6 : 1 }}>
                {t.label}
              </a>
            </div>
          ))}
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        {visibleGames.map((g) => (
          <section key={g.id} id={g.id} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ marginBottom: 6 }}>{g.nickname || g.officialName || g.id}</h2>

            <div style={{ opacity: 0.9, marginBottom: 6 }}>
              <strong>{g.white}</strong> vs <strong>{g.black}</strong>
            </div>

            <div style={{ opacity: 0.75, marginBottom: 10 }}>
              {g.event} — {g.year}
              {g.date ? ` — ${g.date}` : ""}
              {g.result ? ` — ${g.result}` : ""}
              {g.era ? ` — ${g.era}` : ""}
            </div>

            {g.description ? <div style={{ opacity: 0.85, marginBottom: 12 }}>{g.description}</div> : null}

            <pre style={{ whiteSpace: "pre-wrap", opacity: 0.85 }}>{g.pgn}</pre>

            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.65 }}>
              id: {g.id}
              {g.show === false && <span style={{ marginLeft: 8 }}>• hidden - incomplete or incorrect</span>}
            </div>
          </section>
        ))}
      </div>
    </div>
  );

  const renderStructured = () => (
    <textarea
      style={{ width: "100%", minHeight: "60vh" }}
      readOnly={!canEdit}
      value={JSON.stringify(games, null, 2)}
      onChange={(e) => {
        if (!canEdit) return;
        try {
          const next = JSON.parse(e.target.value);
          setGames(next);
          saveToBrowser(next);
        } catch {
          // ignore while typing
        }
      }}
    />
  );

  const renderString = () => (
    <textarea style={{ width: "100%", minHeight: "60vh" }} readOnly value={JSON.stringify(games)} />
  );

  return (
    <main style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <button onClick={onBack}>← Back</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 16 }}>
        <h1 style={{ margin: 0 }}>Games — Source</h1>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={handleDownloadBundle}>
            Download bundle JSON
          </button>

          {canImport ? (
            <>
              <button type="button" onClick={handleImportClick}>
                Import bundle JSON
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
              Reset defaults (this browser)
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
