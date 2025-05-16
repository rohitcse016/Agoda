import express from "express";
import { manageBusBookings } from "../controllers/ManageBusBookings";

const router = express.Router();

router.post("/", manageBusBookings);

export default router;