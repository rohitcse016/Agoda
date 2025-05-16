import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const manageTrainBookings = async (req: Request, res: Response) => {
  const {
    action,
    booking_id,
    user_id,
    train_name,
    departure_station,
    arrival_station,
    departure_date,
    return_date,
    total_price,
    status
  } = req.body;

    console.log(req.body);

  try {
    const conn = await getDbConnection();

    const [results]: any = await conn.query(
      `CALL ManageTrainBookings(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        action,
        booking_id ?? null,
        user_id ?? null,
        train_name ?? null,
        departure_station ?? null,
        arrival_station ?? null,
        departure_date ?? null,
        return_date ?? null,
        total_price ?? null,
        status ?? null
      ]
    );

    const data = results[0] || [];

    
    res.status(200).json({
      success: true,
      message: `Train booking ${action.toLowerCase()} operation successful.`,
      data
    });

  } catch (error) {
    console.error("Error in ManageTrainBookings:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
