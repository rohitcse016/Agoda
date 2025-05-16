import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const manageFlightBookings = async (req: Request, res: Response) => {
  const {
    action,
    user_id,
    flight_id,
    departure_location,
    arrival_location,
    departure_date,
    return_date,
    total_price,
    passenger_count,
    status
  } = req.body;

  try {
    const conn = await getDbConnection();

    const [results]: any = await conn.query(
      `CALL ManageFlightBookings(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        action,
        user_id ?? null,
        flight_id ?? null,
        departure_location ?? null,
        arrival_location ?? null,
        departure_date ?? null,
        return_date ?? null,
        total_price ?? null,
        passenger_count ?? null,
        status ?? null
      ]
    );

    const data = results[0] || [];

    res.status(200).json({
      success: true,
      message: `Flight booking ${action.toLowerCase()} operation successful.`,
      data
    });

  } catch (error) {
    console.error("Error in FlightBookingProcedure:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
