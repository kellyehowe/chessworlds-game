// src/hooks/useMoveSelection.js
import { useState } from "react";
import {
  ORIGIN_HIGHLIGHT,
  DEST_HIGHLIGHT,
} from "../core/chessVisuals.js";

/**
 * Manages piece selection + drag highlights.
 * - selectionSquares: origin + legal targets when clicking
 * - dragSquares: origin + legal targets when dragging
 */
export function useMoveSelection({
  levelRunnerRef,
  wrongDialogVisible,
  onAttemptMove,
}) {
  const [selection, setSelection] = useState({
    from: null,
    legalTargets: [],
  });
  const [selectionSquares, setSelectionSquares] = useState({});
  const [dragSquares, setDragSquares] = useState({});

  const clearDrag = () => setDragSquares({});

  const resetSelection = () => {
    setSelection({ from: null, legalTargets: [] });
    setSelectionSquares({});
    clearDrag();
  };

  // Click-select / click-move
  const handleSquareClick = (square) => {
    const runner = levelRunnerRef.current;
    if (!runner || wrongDialogVisible) return;

    const chess = runner.chess;
    const playerColor = runner.playerColor;

    if (selection.from) {
      if (square === selection.from) {
        resetSelection();
        return;
      }

      if (selection.legalTargets.includes(square)) {
        onAttemptMove(selection.from, square);
        resetSelection();
        return;
      }

      resetSelection();
    }

    const piece = chess.get(square);
    if (!piece || piece.color !== playerColor) {
      resetSelection();
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
  const handlePieceDragBegin = (sourceSquare) => {
    const runner = levelRunnerRef.current;
    if (!runner || wrongDialogVisible) return;

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

  return {
    selectionSquares,
    dragSquares,
    handleSquareClick,
    handlePieceDragBegin,
    handlePieceDragEnd,
    resetSelection,
    clearDrag,
  };
}
