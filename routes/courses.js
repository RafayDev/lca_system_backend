import express from 'express';
import { getCourse, getCourses, addCourse, updateCourse, deleteCourse } from '../controllers/courses.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/add', addCourse);
router.patch('/update/:id', updateCourse);
router.delete('/delete/:id', deleteCourse);

export default router