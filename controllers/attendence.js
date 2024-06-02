import Attendence from "../models/attendence.js";
import Batch from "../models/batches.js";
import Student from "../models/students.js";
import Course from "../models/courses.js";
import TimeTable from "../models/timeTables.js";
import Enrollment from "../models/enrollments.js";
import moment from "moment-timezone";

export const createAttendence = async (req, res) => {
    const {student_id} = req.body;
    try{
        // moment.tz.setDefault('Asia/Karachi');
        const student = await Student.findById(student_id);
        var courses = [];
        if(!student){
            return res.status(404).json({ message: "Student not found" });
        }
        const enrollment = await Enrollment.findOne({student: student._id});
        if(!enrollment){
            return res.status(404).json({ message: "Enrollment not found" });
        }
        courses = enrollment.courses;
        const currentDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
        //start time in like  16:00
        const currentTime = moment().tz("Asia/Karachi").format("HH:mm");
        const batch = await Batch.findById(student.batch);
        if(!batch){
            return res.status(404).json({ message: "Batch not found" });
        }
        // console.log("time",currentTime);
        // console.log('day',currentDate);
        const timeTable = await TimeTable.findOne({
            batch: batch._id,
            start_time: { $lte: currentTime }, // Convert moment object to Date
            end_time: { $gte: currentTime },
            day: currentDate
        });

        if (!timeTable) {
            return res.status(404).json({ message: "Time table not found",time:currentTime,day:currentDate });
        }
        if(courses.includes(timeTable.course)){
            const newAttendence = new Attendence({
                batch: batch._id,
                student: student._id,
                course: timeTable.course,
                date: currentDate,
                status : "present"
            });
            await newAttendence.save();
        } else {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Attendence created successfully" });

    } catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const getAttendences = async (req, res) => {
    const {course_id,batch_id,date} = req.body;
    try{
        const attendences = await Attendence.find({course: course_id, batch: batch_id, day: date});
        if(!attendences){
            return res.status(404).json({ message: "Attendence not found" });
        }
        res.status(200).json(attendences);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}