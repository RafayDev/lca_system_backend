import express from "express";
import { createTimeTable, updateTimeTable, getTimeTableById, getAllTimeTables } from "../controllers/timeTables.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post('/timetable', createTimeTable);
router.put('/timetable/:id', updateTimeTable);
router.get('/timetable/:id', getTimeTableById);
router.get('/timetables', getAllTimeTables);

export default router