import express from "express";
import { ManageDesignation } from "../controllers/ManageDesignation";

const router = express.Router();

router.post("/", ManageDesignation);

export default router;