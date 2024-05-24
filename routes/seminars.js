import express from 'express';
import { getSeminars, getSeminar, addSeminar, updateSeminar, deleteSeminar } from '../controllers/seminar.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

//make routes with auth middle ware
router.get('/',auth,getSeminars)
router.get('/:id',auth,getSeminar)
router.post('/add',auth,addSeminar);
router.post('/update/:id',auth,updateSeminar);
router.delete('/delete/:id',auth,deleteSeminar);

export default router
