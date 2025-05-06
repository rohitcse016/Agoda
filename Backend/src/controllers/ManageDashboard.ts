import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const manageDasboard= async (req: Request, res: Response) => {
  console.log(req.body)
  // console.log(res.body)
  const { 
    type, 
    InputValue1 ,
    InputValue2 
  } = req.body;

  try {
    const pool = await getDbConnection();
    console.log(pool)
    const result :any = await pool.request()
      .input("Type", type)
      .input("InputValue1", InputValue1  || null)
      .input("InputValue2", InputValue2 || null)
      .execute("ManageDashboard");

      // console.log("result", result?.recordsets[1])

    const { IsSuccess, Message } =  result?.recordsets[0][0];

    let responseData = [];

    if (type == 2 || type == 3 || type ==1) {

      responseData =  result?.recordsets[1];
    }

    res.status(200).json({
      success: IsSuccess,
      message: Message,
      data: responseData,
    });

  } catch (error) {
    console.error("Error executing sp_ManageDepartment procedure:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
