import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const attendenceSchema = mongoose.Schema({
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    date:{
        type:String,
        default:Date.now
    },
    status:{
        type:String
    }
});

attendenceSchema.plugin(mongoosePaginate);

const Attendence = mongoose.model("Attendence", attendenceSchema);

export default Attendence;