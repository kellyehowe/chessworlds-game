// server/index.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const supportRouter = require("./routes/support");

const app = express();

// Production domains you want to allow explicitly
const allowedOrigins = [
  "https://chessworldsgame.com",
  "https://www.chessworldsgame.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header)
      if (!origin) return callback(null, true);

      // Allow your production domains
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow localhost & 127.0.0.1 (any port)
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Allow private LAN / WSL-style IPs (10.x, 172.16–31.x, 192.168.x)
      if (
        /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin) ||
        /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) ||
        /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      // Anything else: blocked
      return callback(new Error("Not allowed by CORS"));
    }
  })
);

app.use(express.json());

app.use("/api/support", supportRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Chess Worlds support server running on port ${PORT}`);
});
