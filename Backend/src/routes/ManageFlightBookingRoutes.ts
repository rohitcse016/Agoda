import express from "express";
import { manageFlightBookings } from "../controllers/ManageFlightBookings";

const router = express.Router();

router.post("/", manageFlightBookings);

export default router;