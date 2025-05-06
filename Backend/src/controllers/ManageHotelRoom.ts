import { Request, Response } from 'express';
import { getDbConnection } from '../config/db'; // assuming this returns a mysql2/promise connection

export const manageRooms = async (req: Request, res: Response) => {
  const {
    action,
    room_id,
    hotel_id,
    room_name,
    room_slug,
    room_type,
    room_price,
    room_size,
    room_capacity,
    room_description,
    allow_pets,
    provide_breakfast,
    featured_room
  } = req.body;

  try {
    const conn = await getDbConnection();

    const [results]: any = await conn.query(
      `CALL Sp_ManageRooms(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        action,
        room_id ?? null,
        hotel_id ?? null,
        room_name ?? null,
        room_slug ?? null,
        room_type ?? null,
        room_price ?? null,
        room_size ?? null,
        room_capacity ?? null,
        room_description ?? null,
        allow_pets ?? 0,
        provide_breakfast ?? 0,
        featured_room ?? 0
      ]
    );

    let data = [];

    if (action === 'GET') {
      data = results[0]; // first result set contains the rows
    }

    res.status(200).json({
      success: true,
      message: `Room ${action} operation successful.`,
      data
    });
  } catch (error) {
    console.error(`Error executing ManageRooms procedure:`, error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
