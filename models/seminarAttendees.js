import mongoose from "mongoose";

const attendeeSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    city: String,
    qualification: String,
    attend_type: String,
    seminar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seminar",
    },
});

const Attendee = mongoose.model("Attendee", attendeeSchema);

export default Attendee