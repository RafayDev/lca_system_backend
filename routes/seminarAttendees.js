import express from "express";
import { getAttendees, getAttendee, createAttendee, updateAttendee, deleteAttendee,getAttendeesBySeminar } from "../controllers/seminarAttendees.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

//make routes with auth middle ware
router.get('/',auth,getAttendees)
router.get('/:id',auth,getAttendee)
router.post('/add',auth,createAttendee);
router.post('/update/:id',auth,updateAttendee);
router.delete('/delete/:id',auth,deleteAttendee);
router.get('/seminar/:id',auth,getAttendeesBySeminar)

export default router
