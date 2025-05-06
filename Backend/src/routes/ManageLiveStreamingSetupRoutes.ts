import express from "express";
import { manageLiveStreamingSetup } from "../controllers/ManageLiveStreamingSetup";

const router = express.Router();

// Route for managing live streaming setup
router.post("/", manageLiveStreamingSetup);

export default router;
