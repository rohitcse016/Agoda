import { Request, Response } from 'express';
import { getDbConnection } from '../config/db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/hotelRoom_images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'room-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  }
}).array('room_images', 10); // Max 10 files

export const manageRooms = async (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({
        success: false,
        message: err instanceof multer.MulterError
          ? `File upload error: ${err.message}`
          : err.message
      });
    }

    const {
      action,
      room_id,
      hotel_id,
      room_name,
      room_slug,
      room_type,
      room_price,
      room_size,
      room_capacity,
      room_description,
      allow_pets,
      provide_breakfast,
      featured_room,
      is_available
    } = req.body;

    const files = req.files as Express.Multer.File[];
    const imagePaths = files?.map(file =>
      path.relative(path.join(__dirname, './..'), file.path)
    ) || [];

    try {
      const conn = await getDbConnection();

      // 🔥 If deleting, fetch image paths before deletion
      if (action === 'DELETE' && room_id) {
        const [roomResult]: any = await conn.query(
          `SELECT image_path FROM room_images WHERE room_id = ?`,
          [room_id]
        );
        // console.log(roomResult);
        
        
        if (roomResult.length > 0 ) {
          roomResult.forEach((imgPath: any) => {
            const fullPath = path.join(__dirname,'../',imgPath.image_path);
            
            try {
              if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
            } catch (e) {
              console.warn(`Failed to delete file ${imgPath }:`, e);
            }
          });
        }
      }

      const [results]: any = await conn.query(
        `CALL Sp_ManageRooms(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          action,
          room_id ?? null,
          hotel_id ?? null,
          room_name ?? null,
          room_slug ?? null,
          room_type ?? null,
          room_price ?? null,
          room_size ?? null,
          room_capacity ?? null,
          room_description ?? null,
          allow_pets ?? 0,
          provide_breakfast ?? 0,
          featured_room ?? 0,
          is_available ?? 0,
          imagePaths.length > 0 ? JSON.stringify(imagePaths) : null
        ]
      );

      let data = Array.isArray(results[0]) ? results[0] : [results[0]];

      res.status(200).json({
        success: true,
        message: `Room ${action} operation successful`,
        data: action === 'GET' && !room_id ? data : data[0] || null
      });

    } catch (error) {
      console.error('Database error:', error);

      // Clean up newly uploaded files if error occurs
      if (req.files?.length) {
        (req.files as Express.Multer.File[]).forEach(file => {
          try { fs.unlinkSync(file.path); } catch (e) {}
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });
};
