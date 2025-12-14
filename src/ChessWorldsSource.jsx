// src/ChessWorldsSource.jsx

import React from "react";

export default function ChessWorldsSource({ onBack }) {
  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={onBack} style={{ marginBottom: "1rem" }}>
        ← Back
      </button>

      <h1>Chess Worlds — Source Library</h1>

      <p>
        This library contains the canonical source data used by the Chess Worlds
        game. These pages are human-readable and structured so they can also be
        used to generate or rebuild game data programmatically.
      </p>

      <h2>Source Pages</h2>
      <ul>
        <li>
          <a href="/chessworlds-source/games">Games & Levels</a>
        </li>
        <li>
          <a href="/chessworlds-source/players">Players</a>
        </li>
      </ul>

      <p style={{ marginTop: "2rem", opacity: 0.7 }}>
        More source pages may be added over time.
      </p>
    </main>
  );
}
