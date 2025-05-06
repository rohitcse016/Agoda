import express from "express";
import { manageDasboard } from "../controllers/ManageDashboard";

const router = express.Router();

router.post("/", manageDasboard);

export default router;