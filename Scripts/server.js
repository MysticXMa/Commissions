require("dotenv").config();

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const FormData = require("form-data");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

app.post("/submit", upload.array("file"), async (req, res) => {
  try {
    const {
      name,
      description,
      style,
      clothing,
      "custom-base": customBase,
      "discord-id": discordId,
      pack,
    } = req.body;

    console.log("Received submission:");
    console.log("Body:", req.body);
    console.log(
      "Files:",
      req.files?.map((f) => f.originalname)
    );

    if (!name || !description || !style || !discordId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const baseUsed = style === "Other" ? customBase || "Unspecified" : style;

    const embed = {
      title: "📝 New Commission Submission",
      fields: [
        { name: "Character Name", value: name },
        { name: "Description", value: description },
        { name: "Avatar Base", value: baseUsed },
        { name: "Clothing", value: clothing || "N/A" },
        { name: "Discord", value: discordId },
        { name: "Selected Pack", value: pack || "Not specified" },
      ],
      color: 0x00ffff,
      timestamp: new Date().toISOString(),
    };

    const formData = new FormData();
    formData.append("payload_json", JSON.stringify({ embeds: [embed] }));

    if (req.files && req.files.length > 0) {
      req.files.forEach((file, i) => {
        formData.append(`files[${i}]`, file.buffer, file.originalname);
      });
    }

    await axios.post(WEBHOOK_URL, formData, {
      headers: formData.getHeaders(),
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error in /submit:", err);
    res.status(500).json({ error: "Failed to submit order." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
