import express from 'express';
import { getStudent, getStudents, addStudent, updateStudent, deleteStudent, getQrCode } from '../controllers/students.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

//make routes with auth middle ware
router.get('/',auth,getStudents)
router.get('/:id',auth,getStudent)
router.post('/add',auth,addStudent);
router.post('/update/:id',auth,updateStudent);
router.delete('/delete/:id',auth,deleteStudent);
router.get('/qrcode/:id',auth,getQrCode);

export default router