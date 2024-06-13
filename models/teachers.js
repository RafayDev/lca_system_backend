import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const teacherSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  resume: String,
  image: String,
});

teacherSchema.plugin(mongoosePaginate);

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
