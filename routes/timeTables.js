import express from "express";
import { createTimeTable, updateTimeTable, getTimeTableById, getAllTimeTables } from "../controllers/timeTables.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post('/add', createTimeTable);
router.put('/update/:id', updateTimeTable);
router.get('/:id', getTimeTableById);
router.get('/', getAllTimeTables);

export default router