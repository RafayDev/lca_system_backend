import express from "express";
import { createTimeTable, updateTimeTable, getTimeTableById, getAllTimeTables, deleteTimeTable } from "../controllers/timeTables.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post('/add', createTimeTable);
router.put('/update/:id', updateTimeTable);
router.get('/:id', getTimeTableById);
router.get('/', getAllTimeTables);
router.post('/delete/:id',auth,deleteTimeTable);

export default router