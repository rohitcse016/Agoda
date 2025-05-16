import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const manageBusBookings = async (req: Request, res: Response) => {
  const {
    action,
    user_id,
    bus_id,
    boarding_point,
    dropping_point,
    journey_date,
    seat_count,
    total_price,
    status
  } = req.body;

  try {
    const conn = await getDbConnection();

    const [results]: any = await conn.query(
      `CALL ManageBusBooking(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        action,
        user_id ?? null,
        bus_id ?? null,
        boarding_point ?? null,
        dropping_point ?? null,
        journey_date ?? null,
        seat_count ?? null,
        total_price ?? null,
        status ?? null
      ]
    );

    const data = results[0] || [];

    res.status(200).json({
      success: true,
      message: `Bus booking ${action.toLowerCase()} operation successful.`,
      data
    });

  } catch (error) {
    console.error("Error in BusBookingProcedure:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
