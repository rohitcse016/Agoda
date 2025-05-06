import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const ManageDesignation = async (req: Request, res: Response) => {
  // console.log(req)
  // console.log(res)
  const { 
    type, 
    DesignationID ,
    DesignationName ,
    DesignationCode ,
    Status
  } = req.body;

  try {
    const pool = await getDbConnection();

    const result :any = await pool.request()
      .input("Type", type)
      .input("DesignationID", DesignationID  || null)
      .input("DesignationName", DesignationName || null)
      .input("DesignationCode", DesignationCode || null)
      .input("Status", Status === true ? 1 : 0)
      .execute("ManageDesignation");

     //console.log("result", result)

    const { IsSuccess, Message } =  result?.recordsets[0][0];

    let responseData = [];

    if (type == 3 || type == 5) {

      responseData =  result?.recordsets[1];
    }

    res.status(200).json({
      success: IsSuccess,
      message: Message,
      data: responseData,
    });

  } catch (error) {
    // console.error("Error executing sp_ManageDepartment procedure:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
