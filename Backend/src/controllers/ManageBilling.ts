import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const manageBilling = async (req: Request, res: Response) => {
  const {
    action,
    billing_id,
    booking_type,
    booking_id,
    fare,
    taxes,
    discount,
    total,
    payment_method,
    transaction_id,
  } = req.body;

  try {
    const conn = await getDbConnection();

    const [results]: any = await conn.query(
      `CALL ManageBilling(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        action,
        billing_id ?? null,
        booking_type ?? null,
        booking_id ?? null,
        fare ?? 0,
        taxes ?? 0,
        discount ?? 0,
        total ?? 0,
        payment_method ?? null,
        transaction_id ?? null,
      ]
    );

    const data = results[0] || [];

    res.status(200).json({
      success: true,
      message: `Billing ${action.toLowerCase()} operation successful.`,
      data,
    });
  } catch (error) {
    console.error("Error in ManageBilling:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
