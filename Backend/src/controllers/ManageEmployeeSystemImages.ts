import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const manageEmployeeSystemImages = async (req: Request, res: Response) => {
  const { 
    type, // Operation type (1-4)
    ImageID,
    EmployeeID,
    Image,
    CapturedAt
  } = req.body;

  try {
    const pool = await getDbConnection();

    const result :any = await pool.request()
      .input("Type", type)
      .input("ImageID", ImageID || null)
      .input("EmployeeID", EmployeeID || null)
      .input("Image", Image || null)
      .input("CapturedAt", CapturedAt || null)
      .execute("ManageEmployeeSystemImages");

      const { IsSuccess, Message } =  result?.recordsets[0][0];

      let responseData = [];
  
      if (type == 3 || type == 5) {
  
        responseData =  result?.recordsets[1];
      }

    res.status(200).json({
      success: IsSuccess,
      message: Message,
      data:responseData,
    });

  } catch (error) {
    console.error("Error executing ManageEmployeeSystemImages procedure:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
