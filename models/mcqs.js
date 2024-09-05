import mongoose from "mongoose";

const mcqsSchema = mongoose.Schema({
    question: { type: String, required: true },
    option1: { type: String, required: true },
    option2: { type: String, required: true },
    option3: { type: String, required: true },
    option4: { type: String, required: true },
    correct_option: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});


const Mcqs = mongoose.model("Mcqs", mcqsSchema);
export default Mcqs;

