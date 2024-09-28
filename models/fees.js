import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const feeSchema = mongoose.Schema({
    amount: Number,
    due_date: Date,
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Paid"]
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
    logs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FeeLog",
        },
    ]
});

feeSchema.plugin(mongoosePaginate);

const Fee = mongoose.model("Fee", feeSchema);
export default Fee;
