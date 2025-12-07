// server/index.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const supportRouter = require("./routes/support");

const app = express();

/**
 * TEMP: very permissive CORS so we can see real errors.
 * Once everything works, we can tighten this if you want.
 */
app.use(cors());

// So visiting the root shows something nice instead of "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Chess Worlds support server is running");
});

// Parse JSON (not strictly needed for multipart, but harmless)
app.use(express.json());

// Mount the support API
app.use("/api/support", supportRouter);

// Basic error handler to avoid crashing the process
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Chess Worlds support server running on port ${PORT}`);
});
