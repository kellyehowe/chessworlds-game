// src/ChessWorldsSource.jsx
import React, { useState } from "react";
import GamesSourcePage from "./source/GamesSourcePage";
import PlayersSourcePage from "./source/PlayersSourcePage";

export default function ChessWorldsSource({ onBack, isPrivileged }) {
  const [page, setPage] = useState("home");
  // pages: home | games | players | systems | gambits | tactics

  if (page === "games") {
    return (
      <GamesSourcePage
        onBack={() => setPage("home")}
        isPrivileged={isPrivileged}
      />
    );
  }

  if (page === "players") {
    return (
      <PlayersSourcePage
        onBack={() => setPage("home")}
        isPrivileged={isPrivileged}
      />
    );
  }

  const ComingSoon = ({ label }) => (
    <button
      type="button"
      onClick={() => alert(`${label} (coming soon)`)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        marginBottom: 8,
        borderRadius: 10,
        border: "1px solid rgba(148,163,184,0.25)",
        background: "rgba(15,23,42,0.5)",
        color: "rgba(226,232,240,0.85)",
        cursor: "pointer",
      }}
    >
      {label}
      <span style={{ opacity: 0.6, marginLeft: 8 }}>(soon)</span>
    </button>
  );

  const NavButton = ({ label, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        marginBottom: 8,
        borderRadius: 10,
        border: "1px solid rgba(148,163,184,0.25)",
        background: "rgba(15,23,42,0.85)",
        color: "rgba(226,232,240,0.92)",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <button onClick={onBack} style={{ marginBottom: "1rem" }}>
        ← Back
      </button>

      <h1>Chess Worlds — Source Library</h1>

      <p style={{ opacity: 0.85 }}>
        Canonical source data for Chess Worlds. This is human-readable and can also
        be exported as JSON.
      </p>

      <h2 style={{ marginTop: "2rem" }}>Game content</h2>
      <div style={{ maxWidth: 520 }}>
        <NavButton label="Games" onClick={() => setPage("games")} />
        <ComingSoon label="Systems" />
        <ComingSoon label="Gambits" />
        <ComingSoon label="Tactics" />
      </div>

      <h2 style={{ marginTop: "2rem" }}>Reference</h2>
      <div style={{ maxWidth: 520 }}>
        <NavButton label="Players" onClick={() => setPage("players")} />
      </div>

      <p style={{ marginTop: "2rem", opacity: 0.55, fontSize: 12 }}>
        Privileged session: {String(!!isPrivileged)}
      </p>
    </main>
  );
}
