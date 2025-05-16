import express from "express";
import { manageHotelBookings } from "../controllers/ManageHotelBookings";

const router = express.Router();

router.post("/", manageHotelBookings);

export default router;