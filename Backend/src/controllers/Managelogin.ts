import { Request, Response } from "express";
import { getDbConnection } from "../config/db";  // should return mysql2/promise connection
const jwt = require('jsonwebtoken');

export const manageLogin = async (req: Request, res: Response) => {
  const { Username, Password } = req.body;

  try {
    const conn = await getDbConnection();

    // Call stored procedure with parameters
    const [results] = await conn.query(`CALL UserLogin(?, ?)`, [Username, Password]);
    
    
    // MySQL returns an array of result sets → results[0] = first SELECT, results[1] = second SELECT
    const statusRow:any = results; // first row of first SELECT
    const userDetails = statusRow[1] || []; // second SELECT (user details)
    
    const { IsSuccess, Message } = statusRow[0][0];
    const access_token = jwt.sign(
      { userDetails },
      'rftgyh',
      { expiresIn: '12h' }
    );
    const refresh_token = jwt.sign(
      { user: userDetails[0] },
      'refresh_secret_key', // use different secret for refresh
      { expiresIn: '7d' }  // refresh token valid for longer
    );
    
    res.status(200).json({
      success: IsSuccess,
      message: Message,
      data: userDetails,
      access_token,
      refresh_token
    });
    
  } catch (error) {
    console.error("Error executing UserLogin procedure:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
