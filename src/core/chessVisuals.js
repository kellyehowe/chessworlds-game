// src/core/chessVisuals.js

// Board geometry
export const BOARD_SIZE = 520;
export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"];

// Base style for overlay text (files, ranks, move text)
export const OVERLAY_BASE = {
  position: "absolute",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontWeight: 900,
  // no textTransform here – we want official-looking notation like "Nf3"
};

// Icy teal origin square (where you start the move)
export const ORIGIN_HIGHLIGHT = {
  background:
    "radial-gradient(circle, rgba(56,189,248,0.85) 0%, rgba(37,99,235,0.45) 55%, transparent 70%)",
  boxShadow: "inset 0 0 0 3px rgba(191,219,254,1)",
};

// Slightly softer destination squares
export const DEST_HIGHLIGHT = {
  background:
    "radial-gradient(circle, rgba(59,130,246,0.65) 0%, rgba(37,99,235,0.35) 55%, transparent 70%)",
  boxShadow: "inset 0 0 0 2px rgba(191,219,254,0.9)",
};

// Icy file/rank sweep for Show Me
export const FLASH_HIGHLIGHT = {
  background: "rgba(191,219,254,0.28)", // pale icy blue
  boxShadow: "inset 0 0 0 3px rgba(129,199,255,0.95)",
};
