import express from "express";
import { manageBilling } from "../controllers/ManageBilling";

const router = express.Router();

router.post("/", manageBilling);

export default router;