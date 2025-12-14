// src/components/FeedbackDialog.jsx

import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../core/apiConfig";


// ---- Client-side image compression helper ----
async function compressImage(file, maxWidth = 1280, maxHeight = 1280, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Image compression failed"));

          const compressedFile = new File(
            [blob],
            file.name.replace(/\.(png|jpe?g|webp)?$/i, ".jpg"),
            {
              type: "image/jpeg",
              lastModified: Date.now()
            }
          );
          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default function FeedbackDialog({ isOpen, onClose, world, level }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sendCopy, setSendCopy] = useState(false);
  const [attachments, setAttachments] = useState([]); // {id, file, previewUrl, originalName}
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // If dialog is closed/unmounted, clean up previews & reset state
  useEffect(() => {
    if (!isOpen) {
      attachments.forEach((a) => URL.revokeObjectURL(a.previewUrl));
      setAttachments([]);
      setMessage("");
      setError("");
      setSent(false);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const totalSize = (files) =>
    files.reduce((sum, a) => sum + (a.file?.size || 0), 0);

  // ---- Add files (from input or paste), with compression and limits ----
  const addFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    if (attachments.length + files.length > MAX_FILES) {
      setError(`You can attach up to ${MAX_FILES} images.`);
      return;
    }

    setError("");
    const newAttachments = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" is not an image. Only images are allowed.`);
        continue;
      }

      try {
        const compressed = await compressImage(file);
        const previewUrl = URL.createObjectURL(compressed);

        newAttachments.push({
          id: `${Date.now()}-${Math.random()}`,
          file: compressed,
          previewUrl,
          originalName: file.name
        });
      } catch (err) {
        console.error("Error compressing image", err);
        setError("Failed to process one of the images.");
      }
    }

    const combined = [...attachments, ...newAttachments];

    if (totalSize(combined) > MAX_TOTAL_BYTES) {
      newAttachments.forEach((a) => URL.revokeObjectURL(a.previewUrl));
      setError("Total attachment size is too large. Try fewer/smaller images.");
      return;
    }

    setAttachments(combined);
  };

  const handleFileChange = async (e) => {
    if (!e.target.files?.length) return;
    await addFiles(e.target.files);
    e.target.value = ""; // allow re-selecting same file later
  };

  // ---- Handle image paste into textarea ----
  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const images = [];
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) images.push(file);
      }
    }

    if (images.length) {
      e.preventDefault(); // prevent raw image blob from pasting as text
      await addFiles(images);
    }
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      prev.forEach((a) => {
        if (a.id === id) URL.revokeObjectURL(a.previewUrl);
      });
      return prev.filter((a) => a.id !== id);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() && attachments.length === 0) {
      setError("Please describe the issue or attach at least one screenshot.");
      return;
    }

    setError("");
    setSent(false);
    setIsSending(true);

    try {
      const formData = new FormData();

      formData.append("message", message);
      formData.append("userEmail", email);
      formData.append("sendCopy", sendCopy ? "true" : "false");

      if (world) {
        formData.append("worldTitle", world.name || `World ${world.id || ""}`);
      }
      if (level) {
        formData.append("levelTitle", level.title || `Level ${level.id || ""}`);
      }

      attachments.forEach((a) => {
        formData.append("attachments", a.file, a.originalName || a.file.name);
      });

      console.log("Sending feedback to:", `${API_BASE_URL}/api/support`);

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
          // ignore JSON parse errors
        }
        throw new Error(serverMessage);
      }

      setSent(true);
      setMessage("");

      setAttachments((prev) => {
        prev.forEach((a) => URL.revokeObjectURL(a.previewUrl));
        return [];
      });
      // keep email + sendCopy
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
            ref={textareaRef}
            placeholder="Describe the bug, idea, or request..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPaste={handlePaste}
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem"
            }}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: "0.85rem" }}
            >
              Attach image…
            </button>
            <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
              You can paste screenshots directly into the text box or attach up
              to {MAX_FILES} images.
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {attachments.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: "0.5rem"
              }}
            >
              {attachments.map((a) => (
                <div
                  key={a.id}
                  style={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    borderRadius: 6,
                    overflow: "hidden",
                    border: "1px solid #2a2f3d"
                  }}
                >
                  <img
                    src={a.previewUrl}
                    alt={a.originalName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeAttachment(a.id)}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      borderRadius: "50%",
                      border: "none",
                      width: 18,
                      height: 18,
                      cursor: "pointer",
                      fontSize: 11,
                      lineHeight: "18px",
                      textAlign: "center"
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

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
