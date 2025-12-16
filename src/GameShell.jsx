// src/GameShell.jsx

import React, { useEffect, useMemo, useState } from "react";
import { worlds } from "./data/worlds";
import ChessLevel from "./ChessLevel";
import FeedbackDialog from "./components/FeedbackDialog";
import "./GameShell.css";

// Small helpers to keep logic readable
function firstWorldId() {
  return worlds[0]?.id ?? "";
}

function firstLevelIdForWorld(world) {
  return world?.levels?.[0]?.id ?? "";
}

export default function GameShell() {
  // Guard: no worlds at all


if (!worlds.length) {
  return (
    <div className="app-root">
      <main className="app-main" style={{ padding: 20 }}>
        <h1 className="game-title">Chess Worlds</h1>
        <p style={{ opacity: 0.8 }}>
          No playable worlds yet. (Either no games match any shown players, or all
          matching games are show:false.)
        </p>
      </main>
    </div>
  );
}

  const [selectedWorldId, setSelectedWorldId] = useState(firstWorldId());

  const selectedWorld = useMemo(() => {
    return worlds.find((w) => w.id === selectedWorldId) || worlds[0];
  }, [selectedWorldId]);

  const [selectedLevelId, setSelectedLevelId] = useState(
    firstLevelIdForWorld(selectedWorld)
  );

  // Keep selectedLevelId valid whenever the selectedWorld changes
  useEffect(() => {
    const hasLevel = selectedWorld.levels?.some((lvl) => lvl.id === selectedLevelId);
    if (!hasLevel) {
      setSelectedLevelId(firstLevelIdForWorld(selectedWorld));
    }
  }, [selectedWorldId, selectedWorld, selectedLevelId]);

  const selectedLevel = useMemo(() => {
    if (!selectedWorld.levels?.length) return null;
    return (
      selectedWorld.levels.find((lvl) => lvl.id === selectedLevelId) ||
      selectedWorld.levels[0]
    );
  }, [selectedWorld, selectedLevelId]);

  const [cheatInput, setCheatInput] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  function handleWorldSelect(world) {
    setSelectedWorldId(world.id);
    setSelectedLevelId(world.levels?.[0]?.id ?? "");
  }

  function handleCheatSubmit(e) {
    e.preventDefault();
    const code = cheatInput.trim();
    if (!code) return;
    console.log("Cheat code entered:", code.toUpperCase());
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
                    "list-item" + (world.id === selectedWorldId ? " active" : "")
                  }
                  onClick={() => handleWorldSelect(world)}
                >
                  <div className="item-title">{world.name}</div>
                  <div className="item-sub">{world.description}</div>
                  {world.levels?.length === 0 && (
                    <div className="item-sub" style={{ opacity: 0.7 }}>
                      (no playable levels)
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section style={{ marginTop: "1.5rem" }}>
            <h2>Levels</h2>

            {selectedWorld.levels?.length === 0 ? (
              <div style={{ opacity: 0.8, padding: "0.5rem 0" }}>
                No playable levels for this world.
              </div>
            ) : (
              <div className="list">
                {selectedWorld.levels.map((level) => (
                  <button
                    key={level.id}
                    className={
                      "list-item" + (level.id === selectedLevelId ? " active" : "")
                    }
                    onClick={() => setSelectedLevelId(level.id)}
                  >
                    <div className="item-title">{level.title}</div>
                    <div className="item-sub">{level.subtitle}</div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section style={{ marginTop: "1.5rem" }}>
            <h2>Cheat Code</h2>
            <form onSubmit={handleCheatSubmit}>
              <input
                value={cheatInput}
                onChange={(e) => setCheatInput(e.target.value)}
                placeholder="Enter cheat code..."
                className="cheat-input"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
              />
            </form>
          </section>
        </aside>

        {/* RIGHT COLUMN: title + level info + board + info card */}
        <section className="content">
          <h1 className="game-title">Chess Worlds</h1>

          {!selectedLevel ? (
            <div style={{ opacity: 0.85 }}>
              Select a world with playable levels (or set some games to show:true).
            </div>
          ) : (
            <>
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
            </>
          )}
        </section>
      </main>

      {/* Floating feedback button */}
      <button
        type="button"
        className="feedback-button"
        onClick={() => setIsFeedbackOpen(true)}
        disabled={!selectedWorld}
        title={!selectedWorld ? "No world selected" : "Send feedback"}
      >
        Feedback
      </button>

      {/* Feedback dialog */}
      <FeedbackDialog
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        world={selectedWorld}
        level={selectedLevel}
      />
    </div>
  );
}
