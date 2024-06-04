import express from "express";
import { createTimeTable, updateTimeTable, getTimeTableById, getAllTimeTables, deleteTimeTable, getTimeTableByStudentId, getTodayTimeTables } from "../controllers/timeTables.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post('/add', createTimeTable);
router.put('/update/:id', updateTimeTable);
router.get('/:id', getTimeTableById);
router.get('/', getAllTimeTables);
router.post('/delete/:id',auth,deleteTimeTable);
router.get('/get-time-table-by-student-id/:id', getTimeTableByStudentId);
router.get('/getTodayTimeTables', getTodayTimeTables);

export default router