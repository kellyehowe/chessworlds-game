// src/ChessLevel.jsx

import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import LevelRunner from "./core/LevelRunner.js";

// --- board geometry + helpers ---
const BOARD_SIZE = 520;
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"];

// === ICY HIGHLIGHT + OVERLAY THEME ===========================

// Base style for big overlay characters (files, ranks, move text)
const OVERLAY_BASE = {
  position: "absolute",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontWeight: 900,
  // no textTransform here so SAN like "Nf3" looks official
};

// Icy teal origin square (where you start the move)
const ORIGIN_HIGHLIGHT = {
  background:
    "radial-gradient(circle, rgba(56,189,248,0.85) 0%, rgba(37,99,235,0.45) 55%, transparent 70%)",
  boxShadow: "inset 0 0 0 3px rgba(191,219,254,1)",
};

// Slightly softer destination squares
const DEST_HIGHLIGHT = {
  background:
    "radial-gradient(circle, rgba(59,130,246,0.65) 0%, rgba(37,99,235,0.35) 55%, transparent 70%)",
  boxShadow: "inset 0 0 0 2px rgba(191,219,254,0.9)",
};

// Icy file/rank sweep for Show Me
const FLASH_HIGHLIGHT = {
  background: "rgba(191,219,254,0.28)", // pale icy blue
  boxShadow: "inset 0 0 0 3px rgba(129,199,255,0.95)",
};

export default function ChessLevel({ level }) {
  const [fen, setFen] = useState(new Chess().fen());
  const [elapsed, setElapsed] = useState(0);
  const [runStartTime, setRunStartTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(0);

  const [wrongDialog, setWrongDialog] = useState({
    visible: false,
    expectedMove: null,
  });

  const [successDialog, setSuccessDialog] = useState({
    visible: false,
    time: 0,
    score: 0,
  });

  const [hintSquares, setHintSquares] = useState({});

  const [selection, setSelection] = useState({
    from: null,
    legalTargets: [],
  });
  const [selectionSquares, setSelectionSquares] = useState({});

  const [dragSquares, setDragSquares] = useState({});

  const [guideSquares, setGuideSquares] = useState({});
  const [fileOverlay, setFileOverlay] = useState(null); // { text, colIndex, rankIndex }
  const [rankOverlay, setRankOverlay] = useState(null); // { text, colIndex, rankIndex }
  const [moveOverlay, setMoveOverlay] = useState(null); // { text, colIndex, rankIndex }
  const [finalMessage, setFinalMessage] = useState(null);

  const levelRunnerRef = useRef(null);

  const clearDrag = () => setDragSquares({});

  const clearSelection = () => {
    setSelection({ from: null, legalTargets: [] });
    setSelectionSquares({});
    clearDrag();
  };

  const clearGuide = () => {
    setGuideSquares({});
    setFileOverlay(null);
    setRankOverlay(null);
    setMoveOverlay(null);
    setFinalMessage(null);
  };

  const stopTimer = () => setRunStartTime(null);

  // Init / reset when level changes
  useEffect(() => {
    if (!level) return;

    const runner = new LevelRunner(level);
    levelRunnerRef.current = runner;

    setFen(runner.chess.fen());

    const movesForPlayer = runner.playerMoveCount();
    const perMove = level.timePerMoveSeconds || 10;
    setTimeLimit(movesForPlayer * perMove);

    setElapsed(0);
    setRunStartTime(null);
    setWrongDialog({ visible: false, expectedMove: null });
    setSuccessDialog({ visible: false, time: 0, score: 0 });
    setHintSquares({});
    clearSelection();
    clearGuide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // Timer
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
    setSuccessDialog({ visible: false, time: 0, score: 0 });
    setHintSquares({});
    clearSelection();
    clearGuide();
  };

  const handleTryAgain = () => {
    restartLevel();
  };

  const handleSuccessClose = () => {
    setSuccessDialog({ visible: false, time: 0, score: 0 });
  };

  // Core move application used by click + drag
  const attemptMove = (sourceSquare, targetSquare) => {
    const runner = levelRunnerRef.current;
    if (!runner) return { ok: false };

    if (wrongDialog.visible || successDialog.visible) {
      return { ok: false };
    }

    if (runStartTime === null) {
      setRunStartTime(Date.now());
    }

    const result = runner.handlePlayerMove(sourceSquare, targetSquare);

    if (!result.ok) {
      stopTimer();
      setWrongDialog({
        visible: true,
        expectedMove: result.expected || null,
      });
      clearSelection();
      return { ok: false };
    }

    setFen(result.fen);
    clearSelection();
    setHintSquares({});
    clearGuide();

    if (result.completed) {
      const totalSeconds = (Date.now() - runStartTime) / 1000;
      const tl = timeLimit || 1;
      const score = Math.max(
        0,
        Math.round((1000 * (tl - totalSeconds)) / tl)
      );

      setSuccessDialog({
        visible: true,
        time: totalSeconds,
        score,
      });

      stopTimer();
    }

    return { ok: true };
  };

  const handlePieceDrop = (sourceSquare, targetSquare) => {
    const { ok } = attemptMove(sourceSquare, targetSquare);
    clearDrag();
    return ok;
  };

  // Click-select / click-move
  const handleSquareClick = ({ square }) => {
    const runner = levelRunnerRef.current;
    if (!runner || wrongDialog.visible || successDialog.visible) return;

    const chess = runner.chess;
    const playerColor = runner.playerColor;

    if (selection.from) {
      if (square === selection.from) {
        clearSelection();
        return;
      }

      if (selection.legalTargets.includes(square)) {
        attemptMove(selection.from, square);
        return;
      }

      clearSelection();
    }

    const piece = chess.get(square);
    if (!piece || piece.color !== playerColor) {
      clearSelection();
      return;
    }

    const legalMoves = chess
      .moves({ square, verbose: true })
      .filter((m) => m.color === playerColor);

    const targets = legalMoves.map((m) => m.to);

    const sqStyles = {
      [square]: ORIGIN_HIGHLIGHT,
    };
    targets.forEach((t) => {
      sqStyles[t] = DEST_HIGHLIGHT;
    });

    setSelection({ from: square, legalTargets: targets });
    setSelectionSquares(sqStyles);
  };

  // Drag highlights: origin + all legal targets
  const handlePieceDragBegin = ({ sourceSquare }) => {
    const runner = levelRunnerRef.current;
    if (!runner || wrongDialog.visible || successDialog.visible) return;

    const chess = runner.chess;
    const playerColor = runner.playerColor;
    const piece = chess.get(sourceSquare);

    if (!piece || piece.color !== playerColor) {
      clearDrag();
      return;
    }

    const legalMoves = chess
      .moves({ square: sourceSquare, verbose: true })
      .filter((m) => m.color === playerColor);

    const styles = {
      [sourceSquare]: ORIGIN_HIGHLIGHT,
    };
    legalMoves.forEach((m) => {
      styles[m.to] = DEST_HIGHLIGHT;
    });

    setDragSquares(styles);
  };

  const handlePieceDragEnd = () => {
    clearDrag();
  };

  // --- SHOW ME animation (files/ranks + move text) ---
  const runShowMeAnimation = async (runner, expected) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    stopTimer();
    clearSelection();
    clearGuide();

    // Base hint on from/to
    setHintSquares({
      [expected.from]: ORIGIN_HIGHLIGHT,
      [expected.to]: DEST_HIGHLIGHT,
    });

    const temp = new Chess(runner.chess.fen());
    temp.move({
      from: expected.from,
      to: expected.to,
      promotion: expected.promotion || "q",
    });
    setFen(temp.fen());

    const toSquare = expected.to;
    const file = toSquare[0];
    const rank = toSquare[1];
    const fileIndexTarget = FILES.indexOf(file);
    const rankIndexTarget = RANKS.indexOf(rank);

    // SAN text (e.g. "Nf6+" -> "Nf6")
    const sanText = (expected.san || toSquare).replace(/[+#]$/g, "");

    // 1) Flash files a..target
    for (let i = 0; i <= fileIndexTarget; i++) {
      const f = FILES[i];
      const squares = RANKS.map((r) => f + r);
      const sqStyles = squares.reduce((acc, s) => {
        acc[s] = FLASH_HIGHLIGHT;
        return acc;
      }, {});
      setGuideSquares(sqStyles);

      setFileOverlay({
        text: f, // lowercase for file letter
        colIndex: i,
        rankIndex: rankIndexTarget,
      });

      await sleep(260);

      if (i < fileIndexTarget) {
        setGuideSquares({});
        setFileOverlay(null);
        await sleep(90);
      }
    }

    setGuideSquares({});

    // 2) Flash ranks 1..target along target file
    for (let i = 0; i <= rankIndexTarget; i++) {
      const rnk = RANKS[i];
      const squares = FILES.map((f) => f + rnk);
      const sqStyles = squares.reduce((acc, s) => {
        acc[s] = FLASH_HIGHLIGHT;
        return acc;
      }, {});
      setGuideSquares(sqStyles);

      setRankOverlay({
        text: rnk,
        colIndex: fileIndexTarget,
        rankIndex: i,
      });

      await sleep(260);

      if (i < rankIndexTarget) {
        setGuideSquares({});
        setRankOverlay(null);
        await sleep(90);
      }
    }

    setGuideSquares({});

    // Let file + rank sit together briefly
    await sleep(200);

    // 3) Replace with final move text (e.g. "Nf6")
    setFileOverlay(null);
    setRankOverlay(null);
    setMoveOverlay({
      text: sanText,
      colIndex: fileIndexTarget,
      rankIndex: rankIndexTarget,
    });

    setFinalMessage(`The right move was ${sanText}!`);
    await sleep(1300);

    clearGuide();
    setHintSquares({});
    restartLevel();
  };

  const handleShowMe = async () => {
    const runner = levelRunnerRef.current;
    const expected = wrongDialog.expectedMove;
    if (!runner || !expected) {
      restartLevel();
      return;
    }

    setWrongDialog({ visible: false, expectedMove: null });
    await runShowMeAnimation(runner, expected);
  };

  if (!level) return null;

  const boardOrientation =
    level.playerColor === "black" ? "black" : "white";

  // Merge all highlight layers
  const mergedSquareStyles = {
    ...selectionSquares,
    ...dragSquares,
    ...guideSquares,
    ...hintSquares,
  };

  // logical (fileIndex, rankIndex) -> pixel position, respecting orientation
  const squareToPixel = (fileIndex, rankIndex) => {
    let colBoard, rowBoard;

    if (boardOrientation === "white") {
      colBoard = fileIndex;
      rowBoard = 7 - rankIndex;
    } else {
      // black at bottom: h8 bottom-left
      colBoard = 7 - fileIndex;
      rowBoard = rankIndex;
    }

    return {
      left: ((colBoard + 0.5) * BOARD_SIZE) / 8,
      top: ((rowBoard + 0.5) * BOARD_SIZE) / 8,
    };
  };

  // --- Overlay styles (files, ranks, move) with icy theme ---
  let fileOverlayStyle = null;
  if (fileOverlay) {
    const { left, top } = squareToPixel(
      fileOverlay.colIndex,
      fileOverlay.rankIndex
    );
    fileOverlayStyle = {
      ...OVERLAY_BASE,
      left,
      top,
      fontSize: "3rem",
      color: "#e0f2fe", // icy silver-blue
      textShadow:
        "0 0 6px rgba(148,163,184,0.9), 0 0 14px rgba(129,199,255,0.9), 0 0 26px rgba(56,189,248,0.8)",
    };
  }

  let rankOverlayStyle = null;
  if (rankOverlay) {
    const { left, top } = squareToPixel(
      rankOverlay.colIndex,
      rankOverlay.rankIndex
    );
    rankOverlayStyle = {
      ...OVERLAY_BASE,
      left,
      top,
      fontSize: "3rem",
      color: "#f1f5f9", // slightly brighter silver
      textShadow:
        "0 0 6px rgba(148,163,184,0.9), 0 0 16px rgba(129,199,255,0.9), 0 0 28px rgba(59,130,246,0.85)",
    };
  }

  let moveOverlayStyle = null;
  if (moveOverlay) {
    const { left, top } = squareToPixel(
      moveOverlay.colIndex,
      moveOverlay.rankIndex
    );
    moveOverlayStyle = {
      ...OVERLAY_BASE,
      left,
      top,
      fontSize: "3.4rem",
      color: "#ffffff", // chrome-white
      textShadow:
        "0 0 10px rgba(191,219,254,1), 0 0 22px rgba(129,199,255,0.95), 0 0 40px rgba(56,189,248,0.9)",
    };
  }

  const chessboardOptions = {
    id: "main-board",
    boardWidth: BOARD_SIZE,
    position: fen,
    boardOrientation,
    squareStyles: mergedSquareStyles,
    onPieceDrop: ({ sourceSquare, targetSquare }) =>
      handlePieceDrop(sourceSquare, targetSquare),
    onSquareClick: ({ square }) => handleSquareClick({ square }),
    onPieceDragBegin: ({ sourceSquare }) =>
      handlePieceDragBegin({ sourceSquare }),
    onPieceDragEnd: () => handlePieceDragEnd(),
  };

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "2rem",
      }}
    >
      {/* Board + overlays + dialogs */}
      <div style={{ maxWidth: BOARD_SIZE, position: "relative" }}>
        <Chessboard options={chessboardOptions} />
        {fileOverlay && fileOverlayStyle && (
          <div style={fileOverlayStyle}>{fileOverlay.text}</div>
        )}
        {rankOverlay && rankOverlayStyle && (
          <div style={rankOverlayStyle}>{rankOverlay.text}</div>
        )}
        {moveOverlay && moveOverlayStyle && (
          <div style={moveOverlayStyle}>{moveOverlay.text}</div>
        )}

        {/* Wrong-move dialog */}
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

        {/* Success dialog (same style/position) */}
        {successDialog.visible && (
          <div className="wrong-move-backdrop">
            <div className="wrong-move-dialog">
              <h3>Level complete!</h3>
              <p>
                Time: {successDialog.time.toFixed(1)}s
                <br />
                Score: {successDialog.score}
              </p>
              <div className="wrong-move-buttons">
                <button className="primary" onClick={handleSuccessClose}>
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timer */}
      <p style={{ marginTop: "0.75rem" }}>
        <strong>Elapsed:</strong> {elapsed}s&nbsp;&nbsp;
        <strong>Time limit:</strong> {timeLimit}s
      </p>

      {/* Restart button */}
      <button onClick={restartLevel}>Restart level</button>

      {/* Final "right move" message */}
      {finalMessage && (
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#e0f2fe",
            textShadow: "0 0 10px rgba(129,199,255,0.9)",
          }}
        >
          {finalMessage}
        </p>
      )}
    </div>
  );
}
