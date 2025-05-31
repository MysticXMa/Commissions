require("dotenv").config();

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const FormData = require("form-data");

const app = express();
const upload = multer();

app.use(cors());

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

app.post("/submit", upload.any(), async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload_json);
    const file = req.files?.[0];

    const formData = new FormData();
    formData.append("payload_json", JSON.stringify(payload));
    if (file) {
      formData.append("file", Buffer.from(file.buffer), file.originalname);
    }

    await axios.post(WEBHOOK_URL, formData, {
      headers: formData.getHeaders(),
    });

    res.status(200).send("Success");
  } catch (err) {
    console.error("Error sending to Discord:", err);
    res.status(500).send("Failed to submit order.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
