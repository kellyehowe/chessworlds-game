import React, { useEffect, useMemo, useRef } from "react";

/**
 * PixelPortraitIntro (instant show, pixel-disappear hide)
 * - Appears immediately in full (covers board).
 * - Holds for a moment.
 * - Then random pixel-blocks disappear until transparent.
 *
 * Props:
 *  - src: string (e.g. "/portraits/player-morphy.png")
 *  - durationMs: total time for HOLD + HIDE (default 2400)
 *  - onDone: called after animation completes
 */
export default function PixelPortraitIntro({ src, durationMs = 2400, onDone }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const runIdRef = useRef(0);

  const config = useMemo(() => {
    // Lower logicalSize + higher block = chunkier pixels when scaled to board size
    const logicalSize = 128; // 96–160 good
    const block = 4; // 3–6 good

    // We only animate HIDE. The image is drawn fully at start.
    const hideMs = Math.max(450, Math.round(durationMs * 0.45)); // ~45% of total
    const holdMs = Math.max(300, durationMs - hideMs); // rest is hold

    return { logicalSize, block, holdMs, hideMs };
  }, [durationMs]);

  useEffect(() => {
    if (!src) return;

    const runId = ++runIdRef.current;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const size = config.logicalSize;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    const img = new Image();
    img.decoding = "async";
    img.src = src;

    const cancel = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const drawCover = (c, image, w, h) => {
      // Center-crop (cover) into a square w x h
      const iw = image.naturalWidth || image.width;
      const ih = image.naturalHeight || image.height;
      if (!iw || !ih) return;

      const scale = Math.max(w / iw, h / ih);
      const sw = w / scale;
      const sh = h / scale;
      const sx = (iw - sw) / 2;
      const sy = (ih - sh) / 2;

      c.clearRect(0, 0, w, h);
      c.imageSmoothingEnabled = true;
      c.drawImage(image, sx, sy, sw, sh, 0, 0, w, h);
    };

    img.onload = () => {
      if (runIdRef.current !== runId) return;

      // Offscreen buffer at logical resolution
      const off = document.createElement("canvas");
      off.width = size;
      off.height = size;
      const offCtx = off.getContext("2d", { willReadFrequently: true });
      if (!offCtx) {
        onDone?.();
        return;
      }

      drawCover(offCtx, img, size, size);

      const srcData = offCtx.getImageData(0, 0, size, size);
      const outData = offCtx.createImageData(size, size);

      // ✅ START FULLY VISIBLE immediately
      for (let i = 0; i < outData.data.length; i += 4) {
        outData.data[i + 0] = srcData.data[i + 0];
        outData.data[i + 1] = srcData.data[i + 1];
        outData.data[i + 2] = srcData.data[i + 2];
        outData.data[i + 3] = 255;
      }
      ctx.putImageData(outData, 0, 0);

      // Build blocks
      const block = config.block;
      const blocks = [];
      for (let y = 0; y < size; y += block) {
        for (let x = 0; x < size; x += block) {
          blocks.push([x, y]);
        }
      }
      const hideOrder = shuffle(blocks);
      const totalBlocks = hideOrder.length;

      const clearBlock = (x0, y0) => {
        for (let y = 0; y < block; y++) {
          for (let x = 0; x < block; x++) {
            const px = x0 + x;
            const py = y0 + y;
            if (px >= size || py >= size) continue;
            const i = (py * size + px) * 4;
            outData.data[i + 3] = 0; // alpha only
          }
        }
      };

      const start = performance.now();
      let hidden = 0;

      const tick = (now) => {
        if (runIdRef.current !== runId) return;

        const dt = now - start;
        const { holdMs, hideMs } = config;

        // Phase 1: HOLD (do nothing; keep full image)
        if (dt < holdMs) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        // Phase 2: HIDE pixels
        const tHide = dt - holdMs;

        if (tHide < hideMs) {
          const target = Math.floor((tHide / hideMs) * totalBlocks);

          while (hidden < target && hidden < totalBlocks) {
            const [x0, y0] = hideOrder[hidden++];
            clearBlock(x0, y0);
          }

          ctx.putImageData(outData, 0, 0);
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        // End
        ctx.clearRect(0, 0, size, size);
        onDone?.();
      };

      cancel();
      rafRef.current = requestAnimationFrame(tick);
    };

    img.onerror = () => {
      if (runIdRef.current !== runId) return;
      onDone?.();
    };

    return () => {
      ++runIdRef.current;
      cancel();
    };
  }, [src, durationMs, onDone, config]);

  if (!src) return null;

  // Covers the board: parent must be position:relative
  const wrapperStyle = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 50,
  };

  const canvasStyle = {
    width: "100%",
    height: "100%",
    display: "block",
    imageRendering: "pixelated",
  };

  return (
    <div style={wrapperStyle} aria-hidden="true">
      <canvas ref={canvasRef} style={canvasStyle} />
    </div>
  );
}
