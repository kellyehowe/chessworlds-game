// src/App.jsx

import React, { useState } from "react";
import LandingPage from "./LandingPage";
import GameShell from "./GameShell";
import ChessWorldsSource from "./ChessWorldsSource";

function App() {
  const [mode, setMode] = useState("landing");
  // modes: "landing" | "game" | "source"

  const [isPrivilegedSession, setIsPrivilegedSession] = useState(false);

  if (mode === "game") {
    return <GameShell />;
  }

  if (mode === "source") {
    return <ChessWorldsSource onBack={() => setMode("landing")} />;
  }

  return (
    <LandingPage
      onUnlock={({ isPrivileged } = {}) => {
        setIsPrivilegedSession(!!isPrivileged);
        setMode("game");
      }}
      onWrongCode={() => setMode("source")}
    />
  );
}

export default App;
