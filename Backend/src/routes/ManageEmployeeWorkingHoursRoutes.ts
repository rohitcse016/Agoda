import express from "express";
import {manageEmployeeWorkingHours} from "../controllers/ManageEmployeeWorkingHours";

const router = express.Router();

// Route for managing employee working hours
router.post("/", manageEmployeeWorkingHours);

export default router;
