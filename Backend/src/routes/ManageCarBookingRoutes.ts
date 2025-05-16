import express from "express";
import { manageCarBookings } from "../controllers/ManageCarBookings";

const router = express.Router();

router.post("/", manageCarBookings);

export default router;