// src/components/OverlayMarker.jsx
import React from "react";

export default function OverlayMarker({ overlay, style }) {
  if (!overlay || !style) return null;
  return <div style={style}>{overlay.text}</div>;
}
