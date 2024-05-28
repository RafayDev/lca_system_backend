import mongoose from "mongoose";

const timetableSchema = mongoose.Schema({
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    start_time: String,
    end_time: String,
    day: String,
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    },
});
const TimeTable = mongoose.model('TimeTable', timetableSchema);
export default TimeTable;