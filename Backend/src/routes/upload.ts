// routes/upload.ts
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config with timestamped filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const uniqueName = `room-${timestamp}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST /upload-room-image
// router.post('/upload-room-image', upload.single('image'), (req: Request, res: Response) => {
//   if (!req.file) {
//     return res.status(400).json({ success: false, message: 'No file uploaded' });
//   }

//   const filePath = `/uploads/${req.file.filename}`;

//   res.status(200).json({
//     success: true,
//     message: 'Image uploaded successfully',
//     path: filePath
//   });
// });

export default upload;
