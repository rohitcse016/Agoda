import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const manageEmployeeWorkingHours = async (req: Request, res: Response) => {
  const {type, WorkID,EmployeeID,WorkingDate,StartTime,EndTime,TotalHours} = req.body;
  try {
    
    const pool = await getDbConnection();
    const result = await pool.request()
      .input("Type", type || null)
      .input("WorkID", WorkID || null)
      .input("EmployeeID", EmployeeID || null)
      .input("WorkingDate", WorkingDate || null)
      .input("StartTime", StartTime || null)
      .input("EndTime", EndTime || null)
      .input("TotalHours", TotalHours || null)
      .execute("ManageEmployeeWorkingHours");

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
    console.error("Error executing ManageEmployeeWorkingHours procedure:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
