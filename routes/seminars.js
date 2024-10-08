import express from 'express';
import { getSeminars, getSeminar, addSeminar, updateSeminar, deleteSeminar,getTodaySeminars, getSeminarsWithAttendeeCounts,getallSeminarwithAttendees } from '../controllers/seminar.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

//make routes with auth middle ware
router.get('/',auth,getSeminars)
router.get('/:id',auth,getSeminar)
router.post('/add',auth,addSeminar);
router.post('/update/:id',auth,updateSeminar);
router.delete('/delete/:id',auth,deleteSeminar);
router.get('/seminar/today',getTodaySeminars);
router.get('/seminar/getSeminarAttendees',getSeminarsWithAttendeeCounts);
router.get('/seminar/getallSeminarwithAttendees',getallSeminarwithAttendees);

export default router
