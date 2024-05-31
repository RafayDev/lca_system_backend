import Enrollment from "../models/enrollments.js";

export const getEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find();
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createEnrollment = async (req, res) => {
    const {student_id,batch_id, course_ids} = req.body;
    try{
        const old_enrollment = await Enrollment.findOne({student: student_id, batch: batch_id});
        if(old_enrollment){
            await Enrollment.deleteOne({student: student_id, batch: batch_id});
        }
        const new_enrollment = new Enrollment({student: student_id, batch: batch_id, courses: course_ids});
        await new_enrollment.save();
        res.status(200).json(new_enrollment);
    }
    catch(error){
        res.status(409).json({message: error.message});
    }
}

export const getEntrollmentbyStudent = async (req, res) => {
    const {student_id} = req.params;
    try{
        const enrollment = await Enrollment.findOne({student: student_id});
        res.status(200).json(enrollment);
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}