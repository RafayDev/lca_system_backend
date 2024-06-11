import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  name: String,
  description: String,
  fee: Number,
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
