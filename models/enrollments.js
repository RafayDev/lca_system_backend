import mongoose from "mongoose";

const enrollmentSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  fees: [
    {
      type: Number,
    },
  ],
});
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
