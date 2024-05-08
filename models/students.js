import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    cnic:String,
    admission_date:String,
    date_of_birth:String,
    father_name:String,
    father_phone:String,
    latest_degree:String,
    university_name:String,
    city:String,
    completion_year:String,
    marks_cgpa:String,
    cnic_image:String,
    image: String,
    });
const Student = mongoose.model('Student', studentSchema);
export default Student;