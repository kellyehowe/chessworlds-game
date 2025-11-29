// src/ChessLevel.jsx
import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

// --- Level runner: enforces the historical game sequence ---
class LevelRunner {
  constructor(level) {
    this.level = level;
    this.playerColor = level.playerColor === "white" ? "w" : "b";

    // Always initialise so we never hit "undefined"
    this.fullMoves = [];

    // Load the whole historical game into a temp instance
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

    console.log("Full moves for level", level.id, this.fullMoves);

    // This is the board we actually play on
    this.chess = new Chess();
    this.plyIndex = 0; // which move in fullMoves we’re at
    this.failed = false;

    // If you're Black, auto-play White's early moves
    this._advanceToPlayerTurnStart();
  }

  // Advance internal board until the next move to be played
  // in the historical game is by the player's color.
  _advanceToPlayerTurnStart() {
    // No moves loaded → nothing to do
    if (!this.fullMoves || this.fullMoves.length === 0) {
      console.warn(
        "No moves loaded for level; starting from initial position."
      );
      this.chess.reset();
      this.plyIndex = 0;
      return;
    }

    // Start from initial position
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

    console.log(
      "After _advanceToPlayerTurnStart:",
      "plyIndex =",
      this.plyIndex,
      "fen =",
      this.chess.fen()
    );
  }

  reset() {
    this.failed = false;
    // Re-advance to the starting point for the player's first move
    this._advanceToPlayerTurnStart();
  }

  // How many moves the *player* has in this game (used for time limit)
  playerMoveCount() {
    if (!this.fullMoves) return 0;
    return this.fullMoves.filter((m) => m.color === this.playerColor).length;
  }

  getExpectedMove() {
    if (!this.fullMoves) return undefined;
    return this.fullMoves[this.plyIndex];
  }

  // Try to apply the player's move. Returns info about what happened.
  handlePlayerMove(from, to) {
    console.log("handlePlayerMove called with", from, "->", to);

    const expected = this.getExpectedMove();
    console.log("Expected move at ply", this.plyIndex, ":", expected);

    if (!expected) {
      // Game already finished or PGN missing
      return { ok: false, completed: true };
    }

    // It should be the player's turn in the historical game
    if (expected.color !== this.playerColor) {
      console.warn("It is not the player's turn in the historical sequence.");
      this.failed = true;
      return { ok: false, failed: true, expected };
    }

    // Work on a temporary board so we don't mutate the real one on wrong moves
    const tempBoard = new Chess(this.chess.fen());
    const move = tempBoard.move({ from, to, promotion: "q" });
    console.log("chess.js move result:", move);

    if (!move) {
      // Illegal move by chess rules
      this.failed = true;
      return { ok: false, failed: true, expected };
    }

    // Check if it matches the historical move exactly
    const correct =
      move.from === expected.from &&
      move.to === expected.to &&
      (move.promotion || null) === (expected.promotion || null);

    console.log("Is move correct vs historical?", correct);

    if (!correct) {
      this.failed = true;
      return { ok: false, failed: true, expected };
    }

    // Correct move → advance to next ply
    this.plyIndex++;

    // Auto-play the opponent's reply, if any
    const next = this.fullMoves[this.plyIndex];
    if (next && next.color !== this.playerColor) {
      console.log("Auto-playing opponent move:", next);
      tempBoard.move({
        from: next.from,
        to: next.to,
        promotion: next.promotion || "q",
      });
      this.plyIndex++;
    }

    // Commit the temp board as the real one
    this.chess = tempBoard;

    const completed = this.plyIndex >= this.fullMoves.length;
    const fen = this.chess.fen();
    console.log("New FEN after move:", fen);

    return { ok: true, fen, completed };
  }
}

// --- React component for one level ---
export default function ChessLevel({ level }) {
  const [fen, setFen] = useState(new Chess().fen());
  const [elapsed, setElapsed] = useState(0);
  const [runStartTime, setRunStartTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(0);

  // For wrong-move dialog & hint
  const [wrongDialog, setWrongDialog] = useState({
    visible: false,
    expectedMove: null,
  });
  const [hintSquares, setHintSquares] = useState({});

  const levelRunnerRef = useRef(null);

  // Create / reset the level runner whenever the level changes
  useEffect(() => {
    if (!level) return;

    const runner = new LevelRunner(level);
    levelRunnerRef.current = runner;

    // Start position (after any auto-played moves for Black)
    setFen(runner.chess.fen());

    // Time limit = moves by player * seconds per move
    const movesForPlayer = runner.playerMoveCount();
    const perMove = level.timePerMoveSeconds || 10;
    setTimeLimit(movesForPlayer * perMove);

    // Reset timer and dialog/hints
    setElapsed(0);
    setRunStartTime(null);
    setWrongDialog({ visible: false, expectedMove: null });
    setHintSquares({});
  }, [level]);

  // Timer effect – runs while runStartTime is set
  useEffect(() => {
    if (runStartTime === null) return;

    const id = setInterval(() => {
      const seconds = (Date.now() - runStartTime) / 1000;
      setElapsed(seconds.toFixed(1));
    }, 100);

    return () => clearInterval(id);
  }, [runStartTime]);

  const restartLevel = () => {
    if (!levelRunnerRef.current) return;
    levelRunnerRef.current.reset();
    setFen(levelRunnerRef.current.chess.fen());
    setElapsed(0);
    setRunStartTime(null);
    setWrongDialog({ visible: false, expectedMove: null });
    setHintSquares({});
  };

  const handleTryAgain = () => {
    restartLevel();
  };

  const handleShowMe = () => {
    const runner = levelRunnerRef.current;
    const expected = wrongDialog.expectedMove;
    if (!runner || !expected) {
      restartLevel();
      return;
    }

    // Close dialog
    setWrongDialog({ visible: false, expectedMove: null });

    // Build a very obvious highlight style
    const highlightStyle = {
      background:
        "radial-gradient(circle, rgba(34,197,94,0.9) 0%, rgba(22,163,74,0.5) 60%, transparent 70%)",
      boxShadow: "inset 0 0 0 3px rgba(34,197,94,1)",
    };

    // Highlight from + to
    setHintSquares({
      [expected.from]: highlightStyle,
      [expected.to]: highlightStyle,
    });

    // Show the correct move on the board
    const temp = new Chess(runner.chess.fen());
    temp.move({
      from: expected.from,
      to: expected.to,
      promotion: expected.promotion || "q",
    });

    setFen(temp.fen());

    // After a short pause, restart the level (restartLevel clears highlights)
    setTimeout(() => {
      restartLevel();
    }, 1500);
  };

  // Drop handler
  const handlePieceDrop = (sourceSquare, targetSquare) => {
    const runner = levelRunnerRef.current;
    if (!runner) return false;

    // If the wrong-move dialog is open, ignore further moves
    if (wrongDialog.visible) {
      return false;
    }

    // Start the timer on the first correct move
    if (runStartTime === null) {
      setRunStartTime(Date.now());
    }

    const result = runner.handlePlayerMove(sourceSquare, targetSquare);

    if (!result.ok) {
      // Wrong / illegal move or PGN already finished
      setRunStartTime(null); // stop timer
      setWrongDialog({
        visible: true,
        expectedMove: result.expected || null,
      });
      // Tell chessboard to snap the piece back
      return false;
    }

    // Correct move → update board
    setFen(result.fen);

    if (result.completed) {
      const totalSeconds = (Date.now() - runStartTime) / 1000;
      const tl = timeLimit || 1;
      const score = Math.max(
        0,
        Math.round((1000 * (tl - totalSeconds)) / tl)
      );

      window.alert(
        `Level complete!\nTime: ${totalSeconds.toFixed(
          1
        )}s\nScore: ${score}`
      );

      // Stop timer; player can hit Restart to try again
      setRunStartTime(null);
    }

    // IMPORTANT: returning true keeps the piece on the new square
    return true;
  };

  if (!level) return null;

  // Determine which side should be at the bottom of the board
  const boardOrientation =
    level.playerColor === "black" ? "black" : "white";

  // v5 API: build an options object
  const chessboardOptions = {
    id: "main-board",
    boardWidth: 520,
    position: fen,
    boardOrientation, // orientation lives inside options
    customSquareStyles: hintSquares,
    squareStyles: hintSquares,
    onPieceDrop: ({ sourceSquare, targetSquare }) => {
      console.log("onPieceDrop", sourceSquare, targetSquare);
      return handlePieceDrop(sourceSquare, targetSquare);
    },
  };

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "2rem",
      }}
    >
      {/* Board, aligned towards top-left of the content area */}
      <div style={{ maxWidth: 520 }}>
        <Chessboard options={chessboardOptions} />
      </div>

      {/* Timer just under the board */}
      <p style={{ marginTop: "0.75rem" }}>
        <strong>Elapsed:</strong> {elapsed}s&nbsp;&nbsp;
        <strong>Time limit:</strong> {timeLimit}s
      </p>

      {/* Restart button below timer */}
      <button onClick={restartLevel}>Restart level</button>

      {/* Wrong-move dialog overlay */}
      {wrongDialog.visible && (
        <div className="wrong-move-backdrop">
          <div className="wrong-move-dialog">
            <h3>Don&apos;t quit your day job!</h3>
            <p>You played the wrong move.</p>
            <div className="wrong-move-buttons">
              <button onClick={handleTryAgain}>Try Again?</button>
              <button className="primary" onClick={handleShowMe}>
                Show me!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
