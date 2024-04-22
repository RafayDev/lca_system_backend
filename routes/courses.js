import express from 'express';
import { getCourse, getCourses, addCourse, updateCourse, deleteCourse } from '../controllers/courses.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

//make routes with auth middle ware
router.get('/',auth,getCourses)
router.get('/:id',auth,getCourse)
router.post('/add',auth,addCourse);
router.patch('/update/:id',auth,updateCourse);
router.delete('/delete/:id',auth,deleteCourse);

export default router