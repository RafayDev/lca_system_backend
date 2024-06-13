import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const courseSchema = mongoose.Schema({
  name: String,
  description: String,
  fee: Number,
});

courseSchema.plugin(mongoosePaginate);

const Course = mongoose.model("Course", courseSchema);
export default Course;
