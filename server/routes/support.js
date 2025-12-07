// server/routes/support.js

const express = require("express");
const multer = require("multer");
const sgMail = require("@sendgrid/mail");

const router = express.Router();

// ----- SendGrid setup -----
if (!process.env.SENDGRID_API_KEY) {
  console.warn(
    "[support] SENDGRID_API_KEY is not set. Support emails will fail."
  );
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ----- Multer for optional screenshot upload -----
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// POST /api/support
router.post("/", upload.single("screenshot"), async (req, res) => {
  try {
    const {
      worldTitle = "",
      levelTitle = "",
      message = "",
      userEmail = "",
      sendCopy = "false",
    } = req.body;

    if (!message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const toEmail =
      process.env.SUPPORT_TO_EMAIL || "support@chessworldsgame.com";
    const fromEmail =
      process.env.SUPPORT_FROM_EMAIL || "support@chessworldsgame.com";

    const lines = [
      "Chess Worlds Feedback",
      "",
      worldTitle ? `World: ${worldTitle}` : "",
      levelTitle ? `Level: ${levelTitle}` : "",
      "",
      userEmail ? `From: ${userEmail}` : "",
      "",
      "Message:",
      message,
    ];

    const text = lines.filter(Boolean).join("\n");

    let subject = "[Chess Worlds] Feedback";
    if (worldTitle || levelTitle) {
      subject += " – " + [worldTitle, levelTitle].filter(Boolean).join(" / ");
    }

    const attachments = [];

    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        type: req.file.mimetype,
        content: req.file.buffer.toString("base64"), // SendGrid wants base64
        disposition: "attachment",
      });
    }

    const msg = {
      to: toEmail,
      from: {
        email: fromEmail,
        name: "Chess Worlds Support",
      },
      subject,
      text,
      attachments,
    };

    if (sendCopy === "true" && userEmail) {
      msg.cc = userEmail;
    }

    console.log("[support] Sending email via SendGrid…");
    await sgMail.send(msg);
    console.log("[support] Email sent OK");

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error sending support email:", err);
    return res
      .status(500)
      .json({ error: "Failed to send feedback. Please try again later." });
  }
});

module.exports = router;
