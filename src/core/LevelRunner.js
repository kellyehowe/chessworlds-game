// src/core/LevelRunner.js
// Encapsulates historical-move logic for a single level.

import { Chess } from "chess.js";

export default class LevelRunner {
  constructor(level) {
    this.level = level;
    this.playerColor = level.playerColor === "white" ? "w" : "b";

    // Parse full move list from PGN
    this.fullMoves = [];

    const temp = new Chess();
    try {
      const loaded = temp.loadPgn(level.pgn, { sloppy: true });
      if (!loaded) {
        console.warn("Failed to load PGN for level:", level.id);
      }
      this.fullMoves = temp.history({ verbose: true }) || [];
    } catch (err) {
      console.error("Error loading PGN for level:", level.id, err);
      this.fullMoves = [];
    }

    this.chess = new Chess();
    this.plyIndex = 0;
    this.failed = false;

    this._advanceToPlayerTurnStart();
  }

  // Fast-forward through the PGN until it's the player's turn
  _advanceToPlayerTurnStart() {
    if (!this.fullMoves || this.fullMoves.length === 0) {
      console.warn(
        "No moves loaded for level; starting from initial position."
      );
      this.chess.reset();
      this.plyIndex = 0;
      return;
    }

    this.chess.reset();
    this.plyIndex = 0;

    while (
      this.fullMoves[this.plyIndex] &&
      this.fullMoves[this.plyIndex].color !== this.playerColor
    ) {
      const m = this.fullMoves[this.plyIndex];
      this.chess.move({
        from: m.from,
        to: m.to,
        promotion: m.promotion || "q",
      });
      this.plyIndex++;
    }
  }

  reset() {
    this.failed = false;
    this._advanceToPlayerTurnStart();
  }

  playerMoveCount() {
    if (!this.fullMoves) return 0;
    return this.fullMoves.filter((m) => m.color === this.playerColor).length;
  }

  getExpectedMove() {
    if (!this.fullMoves) return undefined;
    return this.fullMoves[this.plyIndex];
  }

  /**
   * Handles a move attempted by the player.
   * Returns { ok, failed, completed, expected, fen }.
   */
  handlePlayerMove(from, to) {
    const expected = this.getExpectedMove();

    if (!expected) {
      // no more moves in the sequence
      return { ok: false, completed: true };
    }

    if (expected.color !== this.playerColor) {
      console.warn("It is not the player's turn in the historical sequence.");
      this.failed = true;
      return { ok: false, failed: true, expected };
    }

    const tempBoard = new Chess(this.chess.fen());
    const move = tempBoard.move({ from, to, promotion: "q" });

    if (!move) {
      this.failed = true;
      return { ok: false, failed: true, expected };
    }

    const correct =
      move.from === expected.from &&
      move.to === expected.to &&
      (move.promotion || null) === (expected.promotion || null);

    if (!correct) {
      this.failed = true;
      return { ok: false, failed: true, expected };
    }

    // Advance to next ply
    this.plyIndex++;

    // If the next move in the PGN is the opponent's, auto-play it
    const next = this.fullMoves[this.plyIndex];
    if (next && next.color !== this.playerColor) {
      tempBoard.move({
        from: next.from,
        to: next.to,
        promotion: next.promotion || "q",
      });
      this.plyIndex++;
    }

    this.chess = tempBoard;

    const completed = this.plyIndex >= this.fullMoves.length;
    const fen = this.chess.fen();

    return { ok: true, fen, completed };
  }
}
