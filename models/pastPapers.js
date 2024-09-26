import mongoose from "mongoose";

const pastPapersSchema = mongoose.Schema({
    question: { type: String, required: true },
    year: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});


const pastPapers = mongoose.model("pastPapers", pastPapersSchema);
export default pastPapers;