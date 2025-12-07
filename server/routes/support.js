// server/routes/support.js

const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");

const router = express.Router();

// Multer setup: store file in memory, limit size to 5MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

/**
 * Create a Nodemailer transporter using environment variables.
 *
 * For SendGrid, configure Render like:
 *   SMTP_HOST   = smtp.sendgrid.net
 *   SMTP_PORT   = 587
 *   SMTP_SECURE = false
 *   SMTP_USER   = apikey
 *   SMTP_PASS   = <your SendGrid API key>
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true", // false for TLS on 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// POST /api/support
router.post("/", upload.single("screenshot"), async (req, res) => {
  try {
    const {
      worldTitle = "",
      levelTitle = "",
      message = "",
      userEmail = "",
      sendCopy = "false"
    } = req.body;

    if (!message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const transporter = createTransporter();

    const lines = [
      "Chess Worlds Feedback",
      "",
      worldTitle ? `World: ${worldTitle}` : "",
      levelTitle ? `Level: ${levelTitle}` : "",
      "",
      userEmail ? `From: ${userEmail}` : "",
      "",
      "Message:",
      message
    ].filter(Boolean);

    const mailOptions = {
      from: `"Chess Worlds Support" <support@chessworldsgame.com>`,
      // NOTE: "to" must be a verified sender or a domain allowed by SendGrid
      to: "support@chessworldsgame.com",
      subject:
        "[Chess Worlds] Feedback" +
        (worldTitle || levelTitle
          ? ` – ${worldTitle || ""} ${levelTitle || ""}`
          : ""),
      text: lines.join("\n"),
      attachments: []
    };

    // Optional screenshot
    if (req.file) {
      mailOptions.attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer
      });
    }

    // Optional copy to user
    if (sendCopy === "true" && userEmail) {
      mailOptions.cc = userEmail;
    }

    await transporter.sendMail(mailOptions);

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error sending support email:", {
      message: err.message,
      stack: err.stack
    });

    return res
      .status(500)
      .json({ error: "Failed to send feedback. Please try again later." });
  }
});

module.exports = router;
