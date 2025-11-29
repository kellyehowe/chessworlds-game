// src/LandingPage.jsx
import React, { useEffect, useState } from "react";
import "./styles/LandingPage.css";

const ACCESS_CODE = "KNIGHT"; // <-- change this whenever you want a new code

function LandingPage({ onUnlock }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isPortal, setIsPortal] = useState(false);

  // When portal animation starts, switch to the game after it finishes
  useEffect(() => {
    let timer;
    if (isPortal) {
      timer = setTimeout(() => {
        onUnlock();
      }, 750); // match CSS animation duration
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPortal, onUnlock]);

  const handleChange = (e) => {
    setCode(e.target.value.toUpperCase());
    if (error) setError("");
  };

  // Fake submit – this button always "fails"
  const handleFakeSubmit = (e) => {
    e.preventDefault();
    setError("Incorrect code.");
  };

  // Secret handler – clicking the O checks the real code
  const handleSecretEnter = () => {
    if (code.trim() === ACCESS_CODE) {
      setError("");
      setIsPortal(true);
    } else {
      setError("Incorrect code.");
    }
  };

  const title = "CHESS WORLDS";

  return (
    <div className={`cw-root ${isPortal ? "cw-root--portal" : ""}`}>
      <div className="cw-overlay" />

      {/* Floating title near top-centre */}
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

            const isO = ch.toUpperCase() === "O";

            return (
              <button
                key={index}
                type="button"
                className={
                  "cw-logo-letter" + (isO ? " cw-logo-letter--portal" : "")
                }
                onClick={isO ? handleSecretEnter : undefined}
                aria-hidden="true"
                tabIndex={-1}
              >
                {ch}
              </button>
            );
          })}
        </h1>
      </header>

      {/* Access card below */}
      <main className="cw-main">
        <section className="cw-form-card">
          <form className="cw-form" onSubmit={handleFakeSubmit}>
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

export default LandingPage;
