import mongoose from "mongoose";

const seminarSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    city: String,
    qualification: String,
    will_attend:[{
        type: String
    }]
    });
const Seminar = mongoose.model('Seminar', seminarSchema);
export default Seminar;