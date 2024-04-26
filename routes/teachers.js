import express from "express";
import { getTeachers, getTeacher, addTeacher, updateTeacher, deleteTeacher } from '../controllers/teachers.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

//make routes with auth middle ware
router.get('/',auth,getTeachers)
router.get('/:id',auth,getTeacher)
router.post('/add',auth,addTeacher);
router.patch('/update/:id',auth,updateTeacher);
router.delete('/delete/:id',auth,deleteTeacher);

export default router
