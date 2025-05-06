import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const manageLiveStreamingSetup = async (req: Request, res: Response) => {
  const { 
    type, 
    SetupID,
    EmployeeID,
    Status
  } = req.body;

  try {
    const pool = await getDbConnection();

    const result = await pool.request()
      .input("Type", type)
      .input("SetupID", SetupID || null)
      .input("EmployeeID", EmployeeID || null)
      .input("Status", Status || null)
      .execute("ManageLiveStreamingSetup");

    const { IsSuccess, Message } = result.recordset[0];
    let responseData = null;

    if (type === 3) {
      responseData = result.recordset;
    }

    res.status(200).json({
      success: IsSuccess,
      message: Message,
      data: responseData,
    });

  } catch (error) {
    console.error("Error executing ManageLiveStreamingSetup procedure:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
