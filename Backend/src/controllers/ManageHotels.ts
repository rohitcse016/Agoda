import { Request, Response } from "express";
import { getDbConnection } from "../config/db";
import fs from "fs";
import path from "path";

export const manageHotels = async (req: Request, res: Response) => {
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
    facilitiesJson // array
  } = req.body;

  try {
    const conn = await getDbConnection();

    let facilitiesArray: any[] = facilitiesJson ? JSON.parse(facilitiesJson) : [];

    const uploadDir = path.join(__dirname, "../uploads/hotel_images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Process each facility in array
    facilitiesArray = facilitiesArray.map((facility, index) => {
      if (facility.image_base64) {
        const base64Data = facility.image_base64.replace(/^data:image\/\w+;base64,/, "");
        const filename = `hotel_${hotel_id ?? "new"}_${Date.now()}_${index}.png`;
        const imagePath = `/uploads/hotel_images/${filename}`;

        fs.writeFileSync(path.join(uploadDir, filename), base64Data, { encoding: "base64" });

        // Replace image_base64 with image_path
        delete facility.image_base64;
        facility.image_path = imagePath;
      }

      return facility;
    });

    const updatedFacilitiesJson = JSON.stringify(facilitiesArray);

    const [results]: any = await conn.query(
      `CALL ManageHotels(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        updatedFacilitiesJson // JSON string passed to procedure
      ]
    );

    let data = [];

    if (action === "GET") {
      data = results[0];
    }

    res.status(200).json({
      success: true,
      message: `Hotel ${action} operation successful.`,
      data
    });
  } catch (error) {
    console.error(`Error executing ManageHotels procedure:`, error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
