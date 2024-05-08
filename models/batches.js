import mongoose from "mongoose";

const batchesSchema = mongoose.Schema({
  name: String,
  description: String,
  startdate: String,
  enddate: String,
  courses:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    }
  ],
  teachers:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    }
  ],

});
const Batch = mongoose.model("Batch", batchesSchema);
export default Batch;
