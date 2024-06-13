import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const batchesSchema = mongoose.Schema({
  name: String,
  description: String,
  startdate: String,
  enddate: String,
  batch_fee: String,
  batch_type: String,
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
});

batchesSchema.plugin(mongoosePaginate);

const Batch = mongoose.model("Batch", batchesSchema);
export default Batch;
