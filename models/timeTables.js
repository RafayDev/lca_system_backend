import mongoose from "mongoose";

const timetableSchema = mongoose.Schema({
    batch_name: String,
    course_name: String,
    start_time: String,
    end_time: String,
    day: String,
    teacher_name: String,
});
const TimeTable = mongoose.model('TimeTable', timetableSchema);
export default TimeTable;