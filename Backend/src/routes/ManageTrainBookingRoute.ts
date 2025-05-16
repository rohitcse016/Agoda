import express from "express";
import { manageTrainBookings } from "../controllers/ManageTrainBookings";

const router = express.Router();

router.post("/", manageTrainBookings);

export default router;