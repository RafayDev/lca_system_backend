import express from "express";
import { createAttendence, getAttendences, getAttendanceByStudentId,getTodayAttendenceByStudentId } from "../controllers/attendence.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, getAttendences);
router.post("/create", createAttendence);
router.get("/studentAttendence/:student_id",getTodayAttendenceByStudentId);


export default router