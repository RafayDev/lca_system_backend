import Attendence from "../models/attendence.js";
import Batch from "../models/batches.js";
import Student from "../models/students.js";
import Course from "../models/courses.js";
import TimeTable from "../models/timeTables.js";
import moment from "moment";

export const createAttendence = async (req, res) => {
    const {student_id} = req.body;
    try{
        const student = await Student.findById(student_id);
        if(!student){
            return res.status(404).json({ message: "Student not found" });
        }

        const currentDate = moment().format("YYYY-MM-DD");
        const currentTime = moment();
        const currentDay = currentTime.format("dddd");
        const batch = await Batch.findById(student.batch);
        if(!batch){
            return res.status(404).json({ message: "Batch not found" });
        }
        const timeTable = await TimeTable.findOne({
            batch: batch._id,
            start_time: { $lte: currentTime.toDate() }, // Convert moment object to Date
            end_time: { $gte: currentTime.toDate() },
            day: currentDay
        });

        if (!timeTable) {
            return res.status(404).json({ message: "Time table not found" });
        }

        const newAttendence = new Attendence({
            batch: batch._id,
            student: student._id,
            course: timeTable.course,
            date: currentDate,
            status : "present"
        });
        await newAttendence.save();

        res.status(200).json({ message: "Attendence created successfully" });

    } catch(error){
        res.status(500).json({ message: error.message });
    }
}