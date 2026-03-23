require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const FormData = require("form-data");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  }),
);

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

app.post("/submit", upload.array("file"), async (req, res) => {
  try {
    const { name, description, style, clothing, pack } = req.body;
    const discordId = req.body["discord-id"];
    const customBase = req.body["custom-base"];

    const baseUsed = style === "Other" ? customBase || "None" : style;

    const formData = new FormData();
    const embeds = [
      {
        title: "🎨 New Commission Request",
        color: 0x00ffff,
        fields: [
          { name: "👤 Name", value: name || "N/A" },
          {
            name: "📝 Description",
            value: (description || "No description").substring(0, 1024),
          },
          { name: "🧍 Base", value: baseUsed, inline: true },
          { name: "📦 Pack", value: pack || "Basic", inline: true },
          { name: "🆔 Discord", value: discordId || "Unknown" },
        ],
      },
    ];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file, i) => {
        formData.append(`file${i}`, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      });
    }

    formData.append("payload_json", JSON.stringify({ embeds }));

    await axios.post(WEBHOOK_URL, formData, {
      headers: formData.getHeaders(),
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: "Failed to submit" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});
