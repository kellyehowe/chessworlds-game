const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

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

    const text = [
      "Chess Worlds Feedback",
      "",
      worldTitle ? `World: ${worldTitle}` : "",
      levelTitle ? `Level: ${levelTitle}` : "",
      "",
      userEmail ? `From: ${userEmail}` : "",
      "",
      "Message:",
      message
    ]
      .filter(Boolean)
      .join("\n");

    const mailOptions = {
      from: `"Chess Worlds Support" <support@chessworldsgame.com>`,
      to: "support@chessworldsgame.com",
      subject:
        `[Chess Worlds] Feedback` +
        (worldTitle || levelTitle
          ? ` – ${worldTitle || ""} ${levelTitle || ""}`
          : ""),
      text,
      attachments: []
    };

    if (req.file) {
      mailOptions.attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer
      });
    }

    if (sendCopy === "true" && userEmail) {
      mailOptions.cc = userEmail;
    }

    await transporter.sendMail(mailOptions);

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error sending support email:", err);
    return res
      .status(500)
      .json({ error: "Failed to send feedback. Please try again later." });
  }
});

module.exports = router;
