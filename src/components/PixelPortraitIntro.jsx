// src/components/PixelPortraitIntro.jsx
import React, { useEffect, useMemo, useRef } from "react";

/**
 * PixelPortraitIntro (random pixel reveal / hold / hide)
 * - Keeps original colors.
 * - Reveal: random pixel-blocks appear rapidly until full image.
 * - Hold briefly.
 * - Hide: random pixel-blocks disappear rapidly.
 *
 * Props:
 *  - src: string (e.g. "/portraits/player-morphy.png")
 *  - durationMs: total time (default 2400)
 *  - onDone: called after animation completes
 */
export default function PixelPortraitIntro({ src, durationMs = 2400, onDone }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const runIdRef = useRef(0);
  const doneRef = useRef(false);

  const config = useMemo(() => {
    const logicalSize = 128; // lower = chunkier
    const block = 4; // higher = chunkier

    const revealMs = Math.max(250, Math.round(durationMs * 0.35));
    const hideMs = Math.max(350, Math.round(durationMs * 0.35));
    const holdMs = Math.max(250, durationMs - revealMs - hideMs);

    return { logicalSize, block, revealMs, holdMs, hideMs };
  }, [durationMs]);

  useEffect(() => {
    if (!src) return;

    doneRef.current = false;
    const runId = ++runIdRef.current;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const cancel = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      cancel();
      onDone?.();
    };

    const size = config.logicalSize;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

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

    const img = new Image();
    img.decoding = "async";
    img.src = src;

    img.onload = () => {
      if (runIdRef.current !== runId) return;

      // Offscreen buffer
      const off = document.createElement("canvas");
      off.width = size;
      off.height = size;
      const offCtx = off.getContext("2d", { willReadFrequently: true });
      if (!offCtx) {
        finish();
        return;
      }

      drawCover(offCtx, img, size, size);

      const srcData = offCtx.getImageData(0, 0, size, size);
      const outData = offCtx.createImageData(size, size); // transparent

      const block = config.block;

      // Block coords (top-left per block)
      const blocks = [];
      for (let y = 0; y < size; y += block) {
        for (let x = 0; x < size; x += block) {
          blocks.push([x, y]);
        }
      }

      const revealOrder = shuffle(blocks.slice());
      const hideOrder = shuffle(blocks.slice());
      const totalBlocks = revealOrder.length;

      const copyBlock = (x0, y0) => {
        for (let y = 0; y < block; y++) {
          for (let x = 0; x < block; x++) {
            const px = x0 + x;
            const py = y0 + y;
            if (px >= size || py >= size) continue;
            const i = (py * size + px) * 4;
            outData.data[i + 0] = srcData.data[i + 0];
            outData.data[i + 1] = srcData.data[i + 1];
            outData.data[i + 2] = srcData.data[i + 2];
            outData.data[i + 3] = 255;
          }
        }
      };

      const clearBlock = (x0, y0) => {
        for (let y = 0; y < block; y++) {
          for (let x = 0; x < block; x++) {
            const px = x0 + x;
            const py = y0 + y;
            if (px >= size || py >= size) continue;
            const i = (py * size + px) * 4;
            outData.data[i + 3] = 0;
          }
        }
      };

      // Start transparent
      ctx.putImageData(outData, 0, 0);

      const t0 = performance.now();
      let revealed = 0;
      let hidden = 0;

      const tick = (now) => {
        if (runIdRef.current !== runId) return;

        const dt = now - t0;
        const { revealMs, holdMs, hideMs } = config;

        if (dt < revealMs) {
          const target = Math.floor((dt / revealMs) * totalBlocks);
          while (revealed < target && revealed < totalBlocks) {
            const [x0, y0] = revealOrder[revealed++];
            copyBlock(x0, y0);
          }
          ctx.putImageData(outData, 0, 0);
        } else if (dt < revealMs + holdMs) {
          if (revealed < totalBlocks) {
            while (revealed < totalBlocks) {
              const [x0, y0] = revealOrder[revealed++];
              copyBlock(x0, y0);
            }
            ctx.putImageData(outData, 0, 0);
          }
        } else if (dt < revealMs + holdMs + hideMs) {
          const tHide = dt - (revealMs + holdMs);
          const target = Math.floor((tHide / hideMs) * totalBlocks);
          while (hidden < target && hidden < totalBlocks) {
            const [x0, y0] = hideOrder[hidden++];
            clearBlock(x0, y0);
          }
          ctx.putImageData(outData, 0, 0);
        } else {
          ctx.clearRect(0, 0, size, size);
          finish();
          return;
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      cancel();
      rafRef.current = requestAnimationFrame(tick);
    };

    img.onerror = () => {
      if (runIdRef.current !== runId) return;
      finish();
    };

    return () => {
      ++runIdRef.current; // invalidate loop
      cancel();
    };
  }, [src, durationMs, onDone, config]);

  if (!src) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
