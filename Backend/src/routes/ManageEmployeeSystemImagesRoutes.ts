import express from "express";
import { manageEmployeeSystemImages } from "../controllers/ManageEmployeeSystemImages";

const router = express.Router();

// Route for managing employee system images
router.post("/", manageEmployeeSystemImages);

export default router;
