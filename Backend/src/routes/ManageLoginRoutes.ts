import express from "express";
import { manageLogin } from "../controllers/Managelogin";

const router = express.Router();

router.post("/", manageLogin);

export default router;