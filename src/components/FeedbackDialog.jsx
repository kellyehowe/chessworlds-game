// src/components/FeedbackDialog.jsx
import React, { useState } from "react";

// Base URL for the API.
// In dev: comes from VITE_API_BASE_URL in the root .env (falls back to localhost).
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function FeedbackDialog({ isOpen, onClose, world, level }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sendCopy, setSendCopy] = useState(false);
  const [files, setFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please describe the issue or idea first.");
      return;
    }

    setError("");
    setSent(false);
    setIsSending(true);

    try {
      const formData = new FormData();

      // Match backend expectations
      formData.append("message", message);
      formData.append("userEmail", email);
      formData.append("sendCopy", sendCopy ? "true" : "false");

      if (world) {
        formData.append("worldTitle", world.name || `World ${world.id || ""}`);
      }
      if (level) {
        formData.append("levelTitle", level.title || `Level ${level.id || ""}`);
      }

      // Send only the first selected file as "screenshot" (backend expects this)
      if (files.length > 0) {
        formData.append("screenshot", files[0]);
      }

      const res = await fetch(`${API_BASE_URL}/api/support`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        let serverMessage =
          "Sorry, something went wrong. Please try again later.";
        try {
          const data = await res.json();
          if (data && data.error) serverMessage = data.error;
        } catch (_) {
          // ignore JSON parse errors and use default message
        }
        throw new Error(serverMessage);
      }

      setSent(true);
      setMessage("");
      setFiles([]);
      // keep email + sendCopy so user doesn’t have to re-enter them
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Sorry, something went wrong. Please try again later."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="feedback-dialog-backdrop">
      <div className="feedback-dialog">
        <h3>Send feedback</h3>
        <p
          style={{
            fontSize: "0.85rem",
            opacity: 0.8,
            marginBottom: "0.5rem"
          }}
        >
          World: <strong>{world?.name || "N/A"}</strong> · Level:{" "}
          <strong>{level?.title || "N/A"}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Describe the bug, idea, or request..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <input
            type="email"
            placeholder="Your email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              margin: "0.3rem 0",
              padding: "0.45rem 0.55rem",
              borderRadius: 8,
              border: "1px solid #2a2f3d",
              background: "#0c0e14",
              color: "#d0d4e8",
              fontSize: "0.9rem"
            }}
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.85rem",
              marginBottom: "0.4rem"
            }}
          >
            <input
              type="checkbox"
              checked={sendCopy}
              onChange={(e) => setSendCopy(e.target.checked)}
            />
            Email me a copy
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{
              width: "100%",
              margin: "0.3rem 0 0.5rem",
              fontSize: "0.85rem"
            }}
          />

          {error && (
            <p
              style={{
                marginTop: "0.25rem",
                marginBottom: "0.45rem",
                color: "#fecaca",
                fontSize: "0.8rem"
              }}
            >
              {error}
            </p>
          )}

          {sent && !error && (
            <p
              style={{
                marginTop: "0.25rem",
                marginBottom: "0.45rem",
                color: "#bbf7d0",
                fontSize: "0.8rem"
              }}
            >
              Thanks! Your feedback was sent.
            </p>
          )}

          <div className="feedback-actions">
            <button type="button" onClick={onClose} disabled={isSending}>
              Cancel
            </button>
            <button type="submit" className="primary" disabled={isSending}>
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
