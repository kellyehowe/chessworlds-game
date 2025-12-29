// src/source/SourceToolbar.jsx
import React, { useRef, useState } from "react";
import {
  exportBundleObject,
  importBundleObject,
  resetBundleToDefaults,
} from "./sourceStore";

function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function fetchJsonNoCache(url) {
  // cache-bust + no-store to avoid stale beta files
  const bust = `v=${Date.now()}`;
  const fullUrl = url.includes("?") ? `${url}&${bust}` : `${url}?${bust}`;

  const res = await fetch(fullUrl, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export default function SourceToolbar({
  canImport,
  canReset,
  onReload,
  downloadFilename = "chessworlds-source-bundle.json",
  betaUrl = "/beta/beta-source.json",
}) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);

  function handleDownloadBundle() {
    const bundle = exportBundleObject();
    downloadJson(downloadFilename, bundle);
  }

  function handleImportClick() {
    fileRef.current?.click();
  }

  async function handleImportFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    let obj;
    try {
      const text = await file.text();
      obj = JSON.parse(text);
    } catch {
      alert("Import failed: file is not valid JSON.");
      return;
    }

    const res = importBundleObject(obj);
    if (!res.ok) {
      alert(res.error || "Import failed.");
      return;
    }

    onReload?.();
    alert("Imported! Reloading source data from this browser.");
  }

  async function handleImportBeta() {
    setBusy(true);
    try {
      const obj = await fetchJsonNoCache(betaUrl);

      const res = importBundleObject(obj);
      if (!res.ok) {
        alert(res.error || "Import failed.");
        return;
      }

      onReload?.();
      alert("Imported BETA! Reloading source data from this browser.");
    } catch (err) {
      alert(`Import BETA failed. Make sure ${betaUrl} exists and is valid JSON.`);
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  function handleResetDefaults() {
    if (!confirm("Reset source data to defaults for THIS browser?")) return;
    resetBundleToDefaults();
    onReload?.();
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button type="button" onClick={handleDownloadBundle}>
        Download JSON
      </button>

      {canImport ? (
        <>
          <button type="button" onClick={handleImportClick} disabled={busy}>
            Import JSON
          </button>

          <button type="button" onClick={handleImportBeta} disabled={busy} title={betaUrl}>
            Import Beta JSON
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={handleImportFile}
          />
        </>
      ) : null}

      {canReset ? (
        <button type="button" onClick={handleResetDefaults} style={{ opacity: 0.85 }} disabled={busy}>
          Reset Defaults
        </button>
      ) : null}
    </div>
  );
}
