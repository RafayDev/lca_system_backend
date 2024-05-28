import Attendence from "../models/attendence";
import Batch from "../models/batches";
import Student from "../models/students";
import Course from "../models/courses";
import TimeTable from "../models/timeTables";
import moment from "moment";

export const createAttendence = async (req, res) => {
    const {student_id} = req.body;
    try{
        const student = await Student.findById(student_id);
        const batch = await Batch.findById(student.batch);
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
        console.log(error);
    }
}