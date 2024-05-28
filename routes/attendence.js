import express from "express";
import { createAttendence } from "../controllers/attendence";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/create/:student_id", auth, createAttendence);

export default router