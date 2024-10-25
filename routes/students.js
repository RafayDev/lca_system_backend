import express from 'express';
import { getStudent, getStudents, addStudent, getStudentsContacts, updateStudent, deleteStudent, getQrCode, updateStudentinfo, checkStudentFields, basicStudentUpdate, getStudentsGraph, getStudentsByBatchesGraph, deleteAllStudents } from '../controllers/students.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

//make routes with auth middle ware
router.get('/',auth,getStudents)
router.get('/:id',auth,getStudent)
router.post('/add',auth,addStudent);
router.post('/update/:id',auth,updateStudent);
router.delete('/delete/:id',auth,deleteStudent);
router.get('/qrcode/:id',auth,getQrCode);
router.post('/studentInfoUpdate/:id',auth,updateStudentinfo);
router.get('/checkStudentFields/:id',auth,checkStudentFields);
router.post('/basic-update/:id',auth,basicStudentUpdate);
router.get('/students/graph',getStudentsGraph)
router.get('/students/Batchesgraph',getStudentsByBatchesGraph)
router.get('/students/getStudentsContacts',getStudentsContacts)
router.delete('/deleteAllStudents',auth,deleteAllStudents);


export default router