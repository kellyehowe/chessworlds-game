// server/routes/support.js

const express = require("express");
const multer = require("multer");
const sgMail = require("@sendgrid/mail");

const router = express.Router();

// ---------- SendGrid setup ----------
if (!process.env.SENDGRID_API_KEY) {
  console.warn(
    "[support] SENDGRID_API_KEY is not set. Support emails will fail."
  );
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ---------- Multer setup for multiple attachments ----------
const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file (safety net)
const MAX_TOTAL_SIZE = 8 * 1024 * 1024; // 8 MB across all files

const ALLOWED_MIME_PREFIX = "image/"; // only images

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith(ALLOWED_MIME_PREFIX)) {
      return cb(
        new Error("Only image uploads are allowed for support attachments.")
      );
    }
    cb(null, true);
  }
});

// Wrap Multer so we can catch its errors and respond nicely
const uploadMiddleware = (req, res, next) => {
  upload.array("attachments", MAX_FILES)(req, res, (err) => {
    if (!err) return next();

    console.error("[support] Multer error:", err);

    if (err instanceof multer.MulterError) {
      // Known Multer limit errors
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "One of the images is too large (max 5 MB each)." });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res
          .status(400)
          .json({ error: `You can attach up to ${MAX_FILES} images.` });
      }
      return res.status(400).json({ error: "There was a problem with the upload." });
    }

    // Our custom fileFilter error or other issues
    return res.status(400).json({
      error: err.message || "Invalid attachment. Only images are allowed."
    });
  });
};

// POST /api/support
router.post("/", uploadMiddleware, async (req, res) => {
  try {
    const {
      worldTitle = "",
      levelTitle = "",
      message = "",
      userEmail = "",
      sendCopy = "false"
    } = req.body;

    const files = Array.isArray(req.files) ? req.files : [];

    if (!message.trim() && files.length === 0) {
      return res
        .status(400)
        .json({ error: "Please include a message or at least one screenshot." });
    }

    // Enforce total size cap
    const totalBytes = files.reduce((sum, f) => sum + (f.size || 0), 0);
    if (totalBytes > MAX_TOTAL_SIZE) {
      return res.status(400).json({
        error:
          "Attachments are too large in total. Please send fewer or smaller images."
      });
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
      message
    ];

    const text = lines.filter(Boolean).join("\n");

    let subject = "[Chess Worlds] Feedback";
    if (worldTitle || levelTitle) {
      subject += " – " + [worldTitle, levelTitle].filter(Boolean).join(" / ");
    }

    const attachments = files.map((file) => ({
      filename: file.originalname || "attachment.jpg",
      type: file.mimetype || "image/jpeg",
      content: file.buffer.toString("base64"), // SendGrid requires base64
      disposition: "attachment"
    }));

    const msg = {
      to: toEmail,
      from: {
        email: fromEmail,
        name: "Chess Worlds Support"
      },
      subject,
      text,
      attachments
    };

    if (sendCopy === "true" && userEmail) {
      msg.cc = userEmail;
    }

    console.log("[support] Sending email via SendGrid…");
    await sgMail.send(msg);
    console.log("[support] Email sent OK");

    return res.json({ ok: true });
  } catch (err) {
    console.error("[support] Error sending support email:", err);

    if (err.response && err.response.body) {
      console.error("[support] SendGrid response body:", err.response.body);
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
