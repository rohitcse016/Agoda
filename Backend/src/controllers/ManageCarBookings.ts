import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const manageCarBookings = async (req: Request, res: Response) => {
  const {
    action,
    user_id,
    car_id,
    pickup_location,
    dropoff_location,
    pickup_date,
    dropoff_date,
    total_price,
    status
  } = req.body;

  try {
    const conn = await getDbConnection();

    const [results]: any = await conn.query(
      `CALL ManageCarBookings(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        action,
        user_id ?? null,
        car_id ?? null,
        pickup_location ?? null,
        dropoff_location ?? null,
        pickup_date ?? null,
        dropoff_date ?? null,
        total_price ?? null,
        status ?? null
      ]
    );

    const data = results[0] || [];

    res.status(200).json({
      success: true,
      message: `Car booking ${action.toLowerCase()} operation successful.`,
      data
    });

  } catch (error) {
    console.error("Error in CarBookingProcedure:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
