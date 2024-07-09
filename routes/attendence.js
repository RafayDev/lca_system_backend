import express from "express";
import { createAttendence, getAttendences } from "../controllers/attendence.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, getAttendences);
router.post("/create", auth, createAttendence);


export default router