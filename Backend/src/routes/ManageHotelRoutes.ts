import express from "express";
import { manageHotels } from "../controllers/ManageHotels";

const router = express.Router();

router.post("/", manageHotels);

export default router;