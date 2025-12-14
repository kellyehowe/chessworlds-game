// src/components/FireworksOverlay.jsx

import React, { useEffect, useMemo } from "react";

function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function makeParticles(seed, count = 12) {
  const rnd = mulberry32(seed);
  const particles = [];

  for (let i = 0; i < count; i++) {
    const angle = rnd() * Math.PI * 2;
    const dist = 40 + rnd() * 70; // px travel
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    // A few slightly brighter “stars”
    const kind = rnd() < 0.25 ? "star" : "dot";

    // size 2–4 px (Mario-ish spark dots)
    const size = 2 + Math.floor(rnd() * 3);

    // slight stagger within a burst, but still “same timing”
    const delay = Math.floor(rnd() * 40); // ms

    particles.push({ dx, dy, kind, size, delay });
  }

  return particles;
}

export default function FireworksOverlay({ bursts }) {
  return (
    <div className="cw-fireworks" aria-hidden="true">
      {bursts.map((b) => (
        <Burst key={b.id} burst={b} />
      ))}
    </div>
  );
}

function Burst({ burst }) {
  const particles = useMemo(
    () => makeParticles(burst.seed, burst.particleCount),
    [burst.seed, burst.particleCount]
  );

  return (
    <div
      className="cw-burst"
      style={{
        left: `${burst.x}px`,
        top: `${burst.y}px`,
      }}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className={`cw-spark ${p.kind === "star" ? "cw-spark--star" : ""}`}
          style={{
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
            "--sz": `${p.size}px`,
            "--delay": `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
