import { Request, Response } from "express";
import { getDbConnection } from "../config/db";

export const manageEmployee = async (req: Request, res: Response) => {
  const {
    action_type,
    user_id,
    username,
    email,
    password_hash,
    full_name,
    phone,
    gender,
    dob,        // expected in 'YYYY-MM-DD' format
    address,
    role   ,
    is_Active ,
    is_Deleted
  } = req.body;

  try {
    const pool = await getDbConnection();

    const [results]:any = await pool.query(
      `CALL sp_manage_users(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`,
      [
        action_type,
        user_id || null,
        username || null,
        email || null,
        password_hash || null,
        full_name || null,
        phone || null,
        gender || null,
        dob || null,
        address || null,
        role || null,
        is_Active || null,
        is_Deleted || null
      ]
    );

    let resultSet = results;
    if(action_type=='GET' || action_type=='GET_BY_USER')
    {
      resultSet=results[0]
    }

    res.status(200).json({
      success: true,
      data: resultSet,
      message: "Stored procedure executed successfully",
    });
  } catch (error) {
    console.error("Error executing sp_manage_users:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
