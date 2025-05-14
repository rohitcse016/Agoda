import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const manageHotelBookings = async (req: Request, res: Response) => {
  const {
    action,
    booking_id,
    user_id,
    hotel_id,
    room_id,
    check_in_date,
    check_out_date,
    guest_count,
    total_price,
    status
  } = req.body;

  try {
    const conn = await getDbConnection();

    const [results]: any = await conn.query(
      `CALL ManageHotelBookings(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        action,
        booking_id ?? null,
        user_id ?? null,
        hotel_id ?? null,
        room_id ?? null,
        check_in_date ?? null,
        check_out_date ?? null,
        guest_count ?? null,
        total_price ?? null,
        status ?? null
      ]
    );

    let data = [];

    if (action === "GET") {
      data = results[0];
    } else if (action === "GET_BY_USER") {
      // Assuming you might have a separate action to get bookings by user
      data = results[0];
    }

    res.status(200).json({
      success: true,
      message: `Hotel booking ${action.toLowerCase()} operation successful.`,
      data
    });

  } catch (error) {
    console.error("Error executing ManageHotelBookings procedure:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};