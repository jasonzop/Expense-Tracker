import express from "express";
import multer from "multer";
import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "../lib/s3.js";

fs.mkdirSync("uploads", { recursive: true });

const app = express();
const upload = multer({ dest: "uploads/" });

// quick health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/upload-receipt", upload.single("receipt"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    if (!file.mimetype.startsWith("image/")) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: "Only image files are allowed" });
    }

    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${timestamp}-${safeName}`;

    const buffer = fs.readFileSync(file.path);

    // LOG: before S3 call
    console.log("Uploading ->", { bucket: BUCKET_NAME, key, size: buffer.length, type: file.mimetype });

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.mimetype,
      })
    );

    fs.unlinkSync(file.path);

    const url = `http://localhost:4566/${BUCKET_NAME}/${key}`;
    console.log("Uploaded OK:", url);
    return res.status(201).json({ success: true, url, key });
  } catch (err) {
    console.error("Upload error:", err?.name, err?.message);
    console.error(err?.stack || err);
    try { if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); } catch {}
    return res.status(500).json({ error: "Failed to upload receipt" });
  }
});

const PORT = 4000;
// Bind to 0.0.0.0 for Codespaces
app.listen(PORT, "0.0.0.0", () => console.log(`Upload API running on http://localhost:${PORT}`));
