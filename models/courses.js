import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const courseSchema = mongoose.Schema({
    name: String,
    description: String,
    });
const Course = mongoose.model('Course', courseSchema);
export default Course;
