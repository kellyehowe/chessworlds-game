// src/App.jsx
import React, { useMemo, useState } from "react";
import LandingPage from "./LandingPage";
import GameShell from "./GameShell";
import ChessWorldsSource from "./ChessWorldsSource";

const PUBLIC_PERMS = {
  canEditSource: false,
  canImportSource: false,
  canResetSource: false,
};

export default function App() {
  const [mode, setMode] = useState("landing"); // "landing" | "game" | "source"

  // “Session” created only by the landing secret unlock path
  const [sessionPerms, setSessionPerms] = useState(PUBLIC_PERMS);

  // Where to go when leaving Source
  const [sourceReturnTo, setSourceReturnTo] = useState("landing"); // "landing" | "game"

  const openSourceFromLanding = () => {
    setSourceReturnTo("landing");
    setMode("source");
  };

  const openSourceFromGame = () => {
    setSourceReturnTo("game");
    setMode("source");
  };

  const permsForSource = useMemo(() => {
    // If you came from gameplay, use session perms.
    // If you came from landing, always public perms (view-only).
    return sourceReturnTo === "game" ? sessionPerms : PUBLIC_PERMS;
  }, [sourceReturnTo, sessionPerms]);

  if (mode === "game") {
    return (
      <GameShell
        onOpenSource={openSourceFromGame}
        sessionPerms={sessionPerms}
      />
    );
  }

  if (mode === "source") {
    return (
      <ChessWorldsSource
        returnTo={sourceReturnTo}
        onExit={() => setMode(sourceReturnTo)}
        permissions={permsForSource}
      />
    );
  }

  // landing
  return (
    <LandingPage
      // Secret unlock goes to gameplay
      onUnlock={({ canEditSource, canImportSource, canResetSource } = {}) => {
        setSessionPerms({
          canEditSource: !!canEditSource,
          canImportSource: !!canImportSource,
          canResetSource: !!canResetSource,
        });
        setMode("game");
      }}
      // ENTER always goes to Source Library (public view-only)
      onEnter={openSourceFromLanding}
    />
  );
}
