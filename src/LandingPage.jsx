// src/LandingPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./LandingPage.css";
import FireworksOverlay from "./components/FireworksOverlay";

const CODE_KNIGHT = "KNIGHT";
const CODE_KNIGHT69 = "KNIGHT69";
// Future-ready (not “used” yet, but supported by the registry design)
const CODE_KNIGHTMARE = "KNIGHTMARE";

// Fireworks timing (Mario-ish cadence)
const BURST_INTERVAL_MS = 160;
const BURST_LIFETIME_MS = 700;

// Fireworks policy:
// - Start on step 2
// - Step2 => 1 burst
// - Step3 => 3 bursts
// - Step4 => 6 bursts
// - Step5 => 9 bursts
function burstsForStep(stepNumber) {
  if (stepNumber < 2) return 0;
  if (stepNumber === 2) return 1;
  return 3 * (stepNumber - 2);
}

function randomSafePoint() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Safe rectangle: centered-ish so it’s usually visible
  const xMin = w * 0.2;
  const xMax = w * 0.8;
  const yMin = h * 0.25;
  const yMax = h * 0.75;

  const x = xMin + Math.random() * (xMax - xMin);
  const y = yMin + Math.random() * (yMax - yMin);

  return { x, y };
}

export default function LandingPage({ onUnlock, onEnter }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isPortal, setIsPortal] = useState(false);

  // progress through non-O sequence only
  const [seqStep, setSeqStep] = useState(0);

  // Click feedback (glimmer)
  const [glimmerIndex, setGlimmerIndex] = useState(-1);
  const glimmerTimerRef = useRef(null);

  // Fireworks overlay bursts
  const [bursts, setBursts] = useState([]);
  const burstTimersRef = useRef([]);

  const normalizedCode = code.trim().toUpperCase();

  const triggerGlimmer = (index) => {
    setGlimmerIndex(-1);
    requestAnimationFrame(() => {
      setGlimmerIndex(index);
      if (glimmerTimerRef.current) clearTimeout(glimmerTimerRef.current);
      glimmerTimerRef.current = setTimeout(() => setGlimmerIndex(-1), 520);
    });
  };

  const clearBurstTimers = () => {
    burstTimersRef.current.forEach((t) => clearTimeout(t));
    burstTimersRef.current = [];
  };

  const spawnBurst = () => {
    const { x, y } = randomSafePoint();
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const seed = (Date.now() ^ (Math.random() * 1e9)) >>> 0;

    const burst = {
      id,
      x,
      y,
      seed,
      particleCount: 12, // same size always (per your request)
    };

    setBursts((prev) => [...prev, burst]);

    // Remove after lifetime
    const kill = setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, BURST_LIFETIME_MS);

    burstTimersRef.current.push(kill);
  };

  const spawnBursts = (count) => {
    if (count <= 0) return;
    for (let i = 0; i < count; i++) {
      const t = setTimeout(() => {
        // If portal started, stop spawning
        if (isPortal) return;
        spawnBurst();
      }, i * BURST_INTERVAL_MS);
      burstTimersRef.current.push(t);
    }
  };

  useEffect(() => {
    return () => {
      if (glimmerTimerRef.current) clearTimeout(glimmerTimerRef.current);
      clearBurstTimers();
    };
  }, []);

  const title = "CHESS WORLDS";

  // Locate indices for special letters in the title
  const indices = useMemo(() => {
    const chars = title.split("");
    const pos = {
      O: -1,
      C: -1,
      R: -1,
      E: -1,
      D: -1,
      S_LEFT: -1,
      S_RIGHT: -1,
      S_MID: -1,
    };

    const sIdxs = [];
    chars.forEach((ch, i) => {
      const up = ch.toUpperCase();
      if (up === "O") pos.O = i;
      if (up === "C" && pos.C === -1) pos.C = i;
      if (up === "R" && pos.R === -1) pos.R = i;
      if (up === "E" && pos.E === -1) pos.E = i;
      if (up === "D" && pos.D === -1) pos.D = i;
      if (up === "S") sIdxs.push(i);
    });

    // For "CHESS WORLDS": S indices are usually [3,4,11]
    pos.S_LEFT = sIdxs[0] ?? -1;
    pos.S_RIGHT = sIdxs[1] ?? -1;
    pos.S_MID = sIdxs[2] ?? -1;

    return pos;
  }, [title]);

  // Secret registry (future-proof)
  // Note: O is always the final “portal trigger” and never spawns fireworks.
  const secrets = useMemo(() => {
    return {
      [CODE_KNIGHT]: {
        steps: [], // no non-O steps
        unlock: {
          canEditSource: false,
          canImportSource: false,
          canResetSource: false,
        },
      },
      [CODE_KNIGHT69]: {
        // RIGHT S -> MID S -> LEFT S -> O
        steps: ["S_RIGHT", "S_MID", "S_LEFT"],
        unlock: {
          canEditSource: true,
          canImportSource: true,
          canResetSource: true,
        },
      },
      [CODE_KNIGHTMARE]: {
        // Future: C -> R -> E -> D -> O
        steps: ["C", "R", "E", "D"],
        unlock: {
          canEditSource: false,
          canImportSource: false,
          canResetSource: false,
          nightmare: true,
        },
      },
    };
  }, []);

  const activeSecret = secrets[normalizedCode] || null;
  const activeSteps = activeSecret?.steps ?? [];
  const stepsRequired = activeSteps.length;

  const isSequenceSatisfied = !!activeSecret && seqStep === stepsRequired;

  const handleChange = (e) => {
    const next = e.target.value.toUpperCase();
    setCode(next);
    if (error) setError("");

    // If they change away from the active code, reset sequence
    if (next.trim().toUpperCase() !== normalizedCode && seqStep !== 0) {
      setSeqStep(0);
    }
    // (Even safer: reset whenever they’re not on any recognized code)
    if (!secrets[next.trim().toUpperCase()] && seqStep !== 0) {
      setSeqStep(0);
    }
  };

  // ENTER always goes to Source Library
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    onEnter?.();
  };

  const startPortalToGame = (payload) => {
    setError("");
    setIsPortal(true);
    clearBurstTimers();
    setTimeout(() => onUnlock?.(payload), 750);
  };

  const handleOClick = () => {
    if (!activeSecret) return;
    if (!isSequenceSatisfied) return;

    // No fireworks on O (per your request)
    startPortalToGame(activeSecret.unlock || {});
  };

  const tokenForIndex = (index, chUpper) => {
    if (chUpper === "S") {
      if (index === indices.S_LEFT) return "S_LEFT";
      if (index === indices.S_RIGHT) return "S_RIGHT";
      if (index === indices.S_MID) return "S_MID";
      return "S";
    }
    if (chUpper === "O") return "O";
    if (chUpper === "C") return "C";
    if (chUpper === "R") return "R";
    if (chUpper === "E") return "E";
    if (chUpper === "D") return "D";
    return chUpper;
  };

  const handleNonOClick = (token) => {
    if (!activeSecret) return;

    const expected = activeSteps[seqStep];
    if (!expected) return;

    if (token === expected) {
      const nextStep = seqStep + 1;
      setSeqStep(nextStep);

      // Fireworks start on step 2 (non-O steps)
      const burstCount = burstsForStep(nextStep);
      spawnBursts(burstCount);
      return;
    }

    // Wrong token breaks the sequence
    if (seqStep !== 0) setSeqStep(0);
  };

  return (
    <div className={`cw-root ${isPortal ? "cw-root--portal" : ""}`}>
      <div className="cw-overlay" />

      <FireworksOverlay bursts={bursts} />

      <header className="cw-hero">
        <h1 className="cw-logo" aria-label="Chess Worlds">
          {title.split("").map((ch, index) => {
            if (ch === " ") {
              return (
                <span key={index} className="cw-logo-space">
                  &nbsp;
                </span>
              );
            }

            const up = ch.toUpperCase();
            const isO = index === indices.O && up === "O";
            const portalClass = isPortal && isO ? " cw-logo-letter--portal" : "";
            const glimmerClass = glimmerIndex === index ? " cw-logo-letter--glimmer" : "";
            const className = "cw-logo-letter" + portalClass + glimmerClass;

            const onClick = () => {
              triggerGlimmer(index);
              if (isPortal) return;

              if (!activeSecret) return;

              if (isO) {
                handleOClick();
                return;
              }

              const token = tokenForIndex(index, up);
              handleNonOClick(token);
            };

            return (
              <button
                key={index}
                type="button"
                className={className}
                onClick={onClick}
                aria-hidden="true"
                tabIndex={-1}
              >
                {ch}
              </button>
            );
          })}
        </h1>
      </header>

      <main className="cw-main">
        <section className="cw-form-card">
          <form className="cw-form" onSubmit={handleSubmit}>
            <input
              className="cw-input"
              type="text"
              autoComplete="off"
              spellCheck="false"
              maxLength={16}
              value={code}
              onChange={handleChange}
            />
            <button type="submit" className="cw-button-fake">
              ENTER
            </button>
          </form>

          <p className={`cw-error ${error ? "cw-error--visible" : ""}`}>
            {error || " "}
          </p>
        </section>
      </main>

      <footer className="cw-footer">
        <span>© {new Date().getFullYear()} Chess Worlds</span>
      </footer>
    </div>
  );
}
