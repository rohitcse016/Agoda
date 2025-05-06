import express from "express";
import { manageRooms } from "../controllers/ManageHotelRoom";

const router = express.Router();

router.post("/", manageRooms);

export default router;