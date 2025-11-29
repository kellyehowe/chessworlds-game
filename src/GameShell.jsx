// src/GameShell.jsx
import React, { useState } from "react";
import { worlds } from "./data/worlds";
import ChessLevel from "./ChessLevel";
import "./styles/GamePage.css";

export default function GameShell() {
  const [selectedWorldId, setSelectedWorldId] = useState(worlds[0].id);
  const selectedWorld = worlds.find((w) => w.id === selectedWorldId);

  const [selectedLevelId, setSelectedLevelId] = useState(
    selectedWorld.levels[0].id
  );

  const selectedLevel =
    selectedWorld.levels.find((lvl) => lvl.id === selectedLevelId) ||
    selectedWorld.levels[0];

  const [cheatInput, setCheatInput] = useState("");

  function handleCheatSubmit(e) {
    e.preventDefault();
    console.log("Cheat code entered:", cheatInput);
    setCheatInput("");
  }

  return (
    <div className="app-root">
      <main className="app-main">
        {/* LEFT COLUMN: worlds + levels + cheat code */}
        <aside className="sidebar">
          <section>
            <h2>Worlds</h2>
            <div className="list">
              {worlds.map((world) => (
                <button
                  key={world.id}
                  className={
                    "list-item" +
                    (world.id === selectedWorldId ? " active" : "")
                  }
                  onClick={() => {
                    setSelectedWorldId(world.id);
                    setSelectedLevelId(world.levels[0].id);
                  }}
                >
                  <div className="item-title">{world.name}</div>
                  <div className="item-sub">{world.description}</div>
                </button>
              ))}
            </div>
          </section>

          <section style={{ marginTop: "1.5rem" }}>
            <h2>Levels</h2>
            <div className="list">
              {selectedWorld.levels.map((level) => (
                <button
                  key={level.id}
                  className={
                    "list-item" +
                    (level.id === selectedLevelId ? " active" : "")
                  }
                  onClick={() => setSelectedLevelId(level.id)}
                >
                  <div className="item-title">{level.title}</div>
                  <div className="item-sub">{level.subtitle}</div>
                </button>
              ))}
            </div>
          </section>

          <section style={{ marginTop: "1.5rem" }}>
            <h2>Cheat Code</h2>
            <form onSubmit={handleCheatSubmit}>
              <input
                value={cheatInput}
                onChange={(e) => setCheatInput(e.target.value)}
                placeholder="Enter cheat code..."
                className="cheat-input"
              />
            </form>
          </section>
        </aside>

        {/* RIGHT COLUMN: title + level info + board + info card */}
        <section className="content">
          <h1 className="game-title">Chess Worlds</h1>

          <h2 className="level-title">{selectedLevel.title}</h2>
          <p className="level-subtitle">{selectedLevel.subtitle}</p>

          <ChessLevel level={selectedLevel} />

          <div className="level-info-card">
            <p>
              <strong>Player color:</strong> {selectedLevel.playerColor}
            </p>
            <p>
              <strong>Time per move:</strong>{" "}
              {selectedLevel.timePerMoveSeconds} seconds
            </p>
            <p>
              Next: Play through the game, one correct move at a time. Wrong
              moves will show a playful message and can demonstrate the correct
              move before restarting the level.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
