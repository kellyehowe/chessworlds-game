// src/App.jsx
import React, { useState } from "react";
import LandingPage from "./LandingPage";
import GameShell from "./GameShell";

function App() {
  const [unlocked, setUnlocked] = useState(false);

  if (unlocked) {
    return <GameShell />;
  }

  return <LandingPage onUnlock={() => setUnlocked(true)} />;
}

export default App;
