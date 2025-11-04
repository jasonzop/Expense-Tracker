import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '../lib/s3.js';

const app = express();

// CORS: allow Vite (localhost:5173) and Codespaces (*.app.github.dev)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://localhost:5173',
    /\.app\.github\.dev$/
  ],
}));

const upload = multer({ storage: multer.memoryStorage() });

// --- tiny dev auth ---
app.use((req, res, next) => {
  const auth = req.headers['authorization'] || '';
  const expected = `Bearer ${process.env.DEV_TOKEN}`;
  if (auth !== expected) return res.status(401).json({ error: 'Unauthorized' });
  next();
});

app.post('/api/upload-receipt', upload.single('receipt'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const timestamp = Date.now();
    const safeName = file.originalname?.replace(/[^a-zA-Z0-9.\-_]/g, '_') || 'receipt.bin';
    const key = `${timestamp}-${safeName}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || 'application/octet-stream',
      ACL: 'public-read',
    }));

    const url = `http://localhost:4566/${BUCKET_NAME}/${key}`;
    return res.status(201).json({ success: true, url, key });
  } catch (e) {
    console.error('Upload error:', e);
    return res.status(500).json({ error: 'Failed to upload receipt' });
  }
});

// health check
app.get('/', (_req, res) => res.json({ ok: true }));

const port = 4000;
app.listen(port, () => console.log(`Upload API running on http://localhost:${port}`));
