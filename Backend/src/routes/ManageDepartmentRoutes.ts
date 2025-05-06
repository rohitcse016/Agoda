import express from "express";
import { manageDepartment } from "../controllers/ManageDepartment";

const router = express.Router();

router.post("/", manageDepartment);

export default router;