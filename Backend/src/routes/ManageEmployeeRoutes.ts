import express from "express";
import { manageEmployee } from "../controllers/ManageEmployee";

const router = express.Router();

// Route for managing employee
router.post("/", manageEmployee);

export default router;
