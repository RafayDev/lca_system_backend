import mongoose from "mongoose";

const seminarSchema = mongoose.Schema({
    name: String,
    date: String,
    time: String,
    description:String
    });
const Seminar = mongoose.model('Seminar', seminarSchema);
export default Seminar;