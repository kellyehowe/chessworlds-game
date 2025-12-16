// src/source/GamesSourcePage.jsx

import React, { useMemo, useState } from "react";
import { gamesSource as initialGames } from "./gamesSource";

export default function GamesSourcePage({ onBack, isPrivileged }) {
  const [viewMode, setViewMode] = useState("human");
  const [games, setGames] = useState(initialGames);

  const visibleGames = games; // Source page shows ALL games, even show:false

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

  const renderHuman = () => (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      {/* ToC */}
      <aside style={{ width: 320, position: "sticky", top: 16 }}>
        <div style={{ opacity: 0.8, marginBottom: 8 }}>Table of Contents</div>
        <div style={{ maxHeight: "70vh", overflow: "auto", paddingRight: 8 }}>
          {tocItems.map((t) => (
            <div key={t.id} style={{ marginBottom: 10, lineHeight: 1.2 }}>

              <a  href={`#${t.id}`}  style={{    fontSize: 13,    opacity: t.hidden ? 0.6 : 1,  }}>
                 {t.label}
              </a>    
              
            </div>
          ))}
        </div>
      </aside>

      {/* Games */}
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

            {g.description ? (
              <div style={{ opacity: 0.85, marginBottom: 12 }}>{g.description}</div>
            ) : null}

            <pre style={{ whiteSpace: "pre-wrap", opacity: 0.85 }}>
              {g.pgn}
            </pre>

            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.65 }}>
            id: {g.id}
            {g.show === false && (
                <span style={{ marginLeft: 8 }}>
                • hidden - incomplete or incorrect
                </span>
            )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );

  const renderStructured = () => (
    <textarea
      style={{ width: "100%", minHeight: "60vh" }}
      readOnly={!isPrivileged}
      value={JSON.stringify(games, null, 2)}
      onChange={(e) => {
        if (!isPrivileged) return;
        try {
          setGames(JSON.parse(e.target.value));
        } catch {
          // ignore invalid JSON while typing
        }
      }}
    />
  );

  const renderString = () => (
    <textarea
      style={{ width: "100%", minHeight: "60vh" }}
      readOnly
      value={JSON.stringify(games)}
    />
  );

  return (
    <main style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <button onClick={onBack}>← Back</button>

      <h1 style={{ marginTop: 16 }}>Games — Source</h1>

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
