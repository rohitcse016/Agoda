import { Request, Response } from "express";
import { getDbConnection } from "../config/db";
import fs from "fs";
import path from "path";
import multer from "multer";

// Set upload directory
const hotelUploadDir = path.join(__dirname, "../uploads/hotel_images");
if (!fs.existsSync(hotelUploadDir)) {
  fs.mkdirSync(hotelUploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, hotelUploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `hotel-${Date.now()}-${Math.round(Math.random() * 1e9)}.${file.mimetype.split('/')[1]}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, and WEBP are allowed."));
  }
}).array("hotel_images", 10); // Accept up to 10 images

export const manageHotels = async (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }

    const {
      action,
      hotel_id,
      name,
      description,
      city,
      state,
      country,
      address,
      star_rating,
      hotel_price,
      facilitiesJson
    } = req.body;

    const files = req.files as Express.Multer.File[];

    // Build array of image paths
    const imagePaths = files?.map(file =>
      path.relative(path.join(__dirname, './..'), file.path)
    ) || [];
    console.log(facilitiesJson);
    

    try {
      const conn = await getDbConnection();

      const [results]: any = await conn.query(
        `CALL ManageHotels(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
        [
          action,
          hotel_id ?? null,
          name ?? null,
          description ?? null,
          city ?? null,
          state ?? null,
          country ?? null,
          address ?? null,
          star_rating ?? null,
          hotel_price ?? 0,
          facilitiesJson ? JSON.stringify(facilitiesJson) : null,
          imagePaths.length ? JSON.stringify(imagePaths) : null
        ]
      );

      const data = action === "GET" ? results[0] : [];

      res.status(200).json({
        success: true,
        message: `Hotel ${action} operation successful.`,
        data
      });
    } catch (error) {
      console.error("ManageHotels DB error:", error);

      // Delete uploaded images if DB fails
      files?.forEach((file) => {
        try { fs.unlinkSync(file.path); } catch (e) {}
      });

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });
};
