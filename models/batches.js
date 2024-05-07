import mongoose from "mongoose";

const batchesSchema = mongoose.Schema({
  name: String,
  description: String,
  startdate: String,
  enddate: String,
});
const Batch = mongoose.model("Batch", batchesSchema);
export default Batch;
