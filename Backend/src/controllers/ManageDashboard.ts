import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const manageDasboard = async (req: Request, res: Response) => {
  try {
    const conn = await getDbConnection();

    const [results]: any = await conn.query(
      `CALL sp_dashboard()`
    );

    let data = [];

    data = results[0];
    res.status(200).json({
      success: true,
      message: `Fetch Data successful.`,
      data
    });

  } catch (error) {
    console.error("Error executing ManageHotelBookings procedure:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
