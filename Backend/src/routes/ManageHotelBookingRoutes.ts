import express from "express";
import { manageHotels } from "../controllers/ManageHotels";
import { manageHotelBookings } from "../controllers/ManageHotelBookings";

const router = express.Router();

router.post("/", manageHotelBookings);

export default router;