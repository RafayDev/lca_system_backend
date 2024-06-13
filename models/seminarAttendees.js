import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const attendeeSchema = mongoose.Schema({
  name: String,
  phone: String,
  city: String,
  qualification: String,
  attend_type: [String],
  seminar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seminar",
  },
});

attendeeSchema.plugin(mongoosePaginate);

const Attendee = mongoose.model("Attendee", attendeeSchema);
export default Attendee;
