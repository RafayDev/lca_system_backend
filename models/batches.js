import mongoose from "mongoose";

const batchesSchema = mongoose.Schema({
    name: String,
    description: String,
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
    });
const Batch = mongoose.model('Batch', batchesSchema);
export default Batch;

