import mongoose from "mongoose";

const teacherSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    resume: String,
    image: String,
    });
const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;