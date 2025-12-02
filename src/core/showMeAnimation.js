// src/core/showMeAnimation.js
import { Chess } from "chess.js";
import {
  FILES,
  RANKS,
  FLASH_HIGHLIGHT,
  ORIGIN_HIGHLIGHT,
  DEST_HIGHLIGHT,
} from "./chessVisuals.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs the "Show Me" animation for the expected move.
 * All UI updates are passed in via the `controls` object.
 */
export async function runShowMeAnimation(runner, expected, controls) {
  const {
    stopTimer,
    resetSelection,
    clearGuide,
    setHintSquares,
    setFen,
    setGuideSquares,
    setFileOverlay,
    setRankOverlay,
    setMoveOverlay,
    setFinalMessage,
    restartLevel,
  } = controls;

  if (!runner || !expected) {
    restartLevel();
    return;
  }

  stopTimer?.();
  resetSelection();
  clearGuide();

  // Base hint on from/to squares
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
      text: f, // keep lowercase "d", "e", etc.
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
}
