import express from "express"
import { getEnrollments,createEnrollment,getEntrollmentbyStudent } from "../controllers/enrollments.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

//make routes with auth middle ware
router.get('/',auth,getEnrollments)
router.get('/student/:id',auth,getEntrollmentbyStudent)
router.post('/add',auth,createEnrollment);

export default router