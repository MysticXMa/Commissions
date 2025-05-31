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

    if (!name || !description || !style || !discordId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const baseUsed = style === "Other" ? customBase || "Unspecified" : style;

    const mainEmbed = {
      title: "🎨 New VRChat Avatar Commission Request",
      color: 0x00ffff,
      timestamp: new Date().toISOString(),
      fields: [
        { name: "👤 Character Name", value: `\`${name}\`` },
        {
          name: "📝 Description",
          value:
            description.length > 1024
              ? description.substring(0, 1021) + "..."
              : description,
        },
        { name: "🧍 Avatar Base", value: `\`${baseUsed}\``, inline: true },
        {
          name: "🧢 Clothing",
          value: clothing ? `\`${clothing}\`` : "*Not specified*",
          inline: true,
        },
        {
          name: "📦 Selected Pack",
          value: pack ? `\`${pack}\`` : "*Not selected*",
          inline: true,
        },
        { name: "🆔 Discord ID", value: `\`${discordId}\`` },
      ],
    };

    const formData = new FormData();

    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        formData.append(`files[${index}]`, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      });
    }

    const imageEmbeds = (req.files || []).map((file, index) => ({
      title: `🖼️ Preview Image ${index + 1}`,
      color: 0x00ffff,
      image: { url: `attachment://${file.originalname}` },
    }));

    formData.append(
      "payload_json",
      JSON.stringify({ embeds: [mainEmbed, ...imageEmbeds] })
    );

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
