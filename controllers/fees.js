import Fee from "../models/fees.js";
import FeeLog from "../models/feeLogs.js";
import User from "../models/users.js";
import Student from "../models/students.js";
import Batch from "../models/batches.js";
import dotenv from "dotenv";
import moment from "moment-timezone";
dotenv.config();

export const getFees = async (req, res) => {
    const { query, status, date } = req.query;

    try {
        const searchQuery = query ? query : '';

        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (date) {
            var fileter_date = moment(date).tz("Asia/Karachi").format("YYYY-MM-DD");
            console.log(fileter_date);
            filter.due_date = fileter_date;
        }

        const options = {
            page: parseInt(req.query.page, 10) || 1,
            limit: parseInt(req.query.limit, 10) || 10,
            sort: { due_date: -1 },
            populate: [
                {
                    path: "student",
                    match: {
                        name: { $regex: searchQuery, $options: "i" },
                    },
                },
                { path: "batch" },
            ],
        };

        const fees = await Fee.paginate(filter, options);

        // Filter out fees with null students when search query is applied
        fees.docs = fees.docs.filter(fee => fee.student !== null);

        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getFeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const fee = await Fee.findById(id).populate("student");
        if (!fee) {
            return res.status(404).json({ message: "Fee not found" });
        }
        res.status(200).json(fee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createFee = async (req, res) => {
    const { student_id, batch_id, amount } = req.body;
    try {
        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0" });
        }

        const student = await Student.findById(student_id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const fee = await Fee.findOne({ student: student_id, batch: batch_id });
        if (fee) {
            return res.status(400).json({ message: "Fee already exists" });
        }

        const newFee = new Fee({
            student: student_id,
            batch: batch_id,
            amount,
            due_date: moment().tz("Asia/Karachi").format("YYYY-MM-DD"),
        });

        const actionUser = await User.findById(req.user.user.id);

        const feeLog = new FeeLog({
            amount,
            action_amount: amount,
            action_date: new Date(),
            action_type: "Created",
            action_by: actionUser._id,
            fee: newFee._id,
        });

        await newFee.save();
        await feeLog.save();
        res.status(201).json(newFee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const payFee = async (req, res) => {
    const { id } = req.params;
    const { student_id, amount } = req.body;
    try {
        let fee = await Fee.findById(id);
        if (!fee) {
            const response = await createFee(req, res);
            if (response.status === 201) {
                fee = await Fee.findById(id);
            } else {
                return res.status(404).json({ message: "Something went wrong while creating a new fee record" });
            }
        }

        if (amount > fee.amount) {
            return res.status(400).json({ message: "Amount exceeds the fee amount" });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0" });
        }

        if (amount > fee.amount) {
            return res.status(400).json({ message: "Amount exceeds the fee amount" });
        }

        if (fee.status === "Paid") {
            return res.status(400).json({ message: "Fee already paid" });
        }

        const orignalAmount = fee.amount;
        fee.amount -= amount;

        if (fee.amount <= 0) {
            fee.status = "Paid";
        }

        const actionUser = await User.findById(req.user.user.id);

        const feeLog = new FeeLog({
            amount: orignalAmount,
            action_amount: amount,
            action_date: new Date(),
            action_type: "Paid",
            action_by: actionUser._id,
            fee: id,
        });

        await feeLog.save();
        await fee.save();

        res.status(200).json(fee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const discountFee = async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        let fee = await Fee.findById(id);
        if (!fee) {
            const response = await createFee(req, res);
            if (response.status === 201) {
                fee = await Fee.findById(id);
            } else {
                return res.status(404).json({ message: "Something went wrong while creating a new fee record" });
            }
        }

        if (amount > fee.amount) {
            return res.status(400).json({ message: "Amount exceeds the fee amount" });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0" });
        }

        if (amount > fee.amount) {
            return res.status(400).json({ message: "Amount exceeds the fee amount" });
        }

        if (fee.status === "Paid") {
            return res.status(400).json({ message: "Fee already paid" });
        }

        const orignalAmount = fee.amount;
        fee.amount -= amount;

        if (fee.amount <= 0) {
            fee.status = "Paid";
        }

        const actionUser = await User.findById(req.user.user.id);

        const feeLog = new FeeLog({
            amount: orignalAmount,
            action_amount: amount,
            action_date: new Date(),
            action_type: "Discounted",
            action_by: actionUser._id,
            fee: id,
        });

        await feeLog.save();
        await fee.save();

        res.status(200).json(fee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteFee = async (req, res) => {
    const { id } = req.params;
    try {
        const fee = await Fee.findById(id);
        if (!fee) {
            return res.status(404).json({ message: "Fee not found" });
        }
        await Fee.findByIdAndDelete(id);

        const actionUser = await User.findById(req.user.user.id);

        const feeLog = new FeeLog({
            amount: fee.amount,
            action_amount: fee.amount,
            action_date: new Date(),
            action_type: "Deleted",
            action_by: actionUser._id,
            fee: id,
        });

        await feeLog.save();

        res.status(200).json("Fee deleted successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getFeeLogs = async (req, res) => {
    const { id } = req.params;
    try {
        const feeLogs = await FeeLog.find({ fee: id }).populate("action_by").populate("fee").populate("student");
        res.status(200).json(feeLogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getFeesByStudentId = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const fees = await Fee.find({ student: id }).populate("student").populate("batch");

        if (!fees || fees.length === 0) {
            return res.status(404).json({ message: "No fees found for the student" });
        }

        const uniqueBatchIds = [...new Set(fees.map(fee => fee.batch._id))];

        const feeLogs = await Promise.all(uniqueBatchIds.map(async (batchId) => {
            const batchFeeLogs = await FeeLog.find({ fee: { $in: fees.filter(fee => fee.batch._id === batchId) } });
            const batch = await Batch.findById(batchId);
            return { batch, feeLogs: batchFeeLogs };
        }));

        // total fee amount in feeLogs where action_type is "Paid"
        const totalPaidFeeAmount = feeLogs.reduce((acc, curr) => {
            const paidFeeLogs = curr.feeLogs.filter(log => log.action_type === "Paid");
            return acc + paidFeeLogs.reduce((acc, curr) => acc + curr.action_amount, 0);
        }, 0);

        // total fee amount in feeLogs where action_type is "Discounted"
        const totalDiscountedFeeAmount = feeLogs.reduce((acc, curr) => {
            const discountedFeeLogs = curr.feeLogs.filter(log => log.action_type === "Discounted");
            return acc + discountedFeeLogs.reduce((acc, curr) => acc + curr.action_amount, 0);
        }, 0);

        // total fee amount in feeLogs where action_type is "Created"
        const totalCreatedFeeAmount = feeLogs.reduce((acc, curr) => {
            const createdFeeLogs = curr.feeLogs.filter(log => log.action_type === "Created");
            return acc + createdFeeLogs.reduce((acc, curr) => acc + curr.amount, 0);
        }, 0);

        // total pending fee amount
        const totalPendingFeeAmount = fees.reduce((acc, curr) => {
            if (curr.status === "Pending") {
                return acc + curr.amount;
            }
            return acc;
        }, 0);

        const overallFeeStatistics = {
            totalPaidFeeAmount,
            totalDiscountedFeeAmount,
            totalCreatedFeeAmount,
            totalPendingFeeAmount
        };

        const batchWiseFeeStatistics = [];

        for (const fee of fees) {
            const batchFeeLogs = feeLogs.find(log => log.batch.toString() === fee.batch.toString());
            if (batchFeeLogs) {
                batchWiseFeeStatistics.push({
                    batch: {
                        _id: fee.batch._id,
                        name: fee.batch.name
                    },
                    totalPaidFeeAmount: batchFeeLogs.feeLogs.filter(log => log.action_type === "Paid").reduce((acc, curr) => acc + curr.action_amount, 0),
                    totalDiscountedFeeAmount: batchFeeLogs.feeLogs.filter(log => log.action_type === "Discounted").reduce((acc, curr) => acc + curr.action_amount, 0),
                    totalCreatedFeeAmount: batchFeeLogs.feeLogs.filter(log => log.action_type === "Created").reduce((acc, curr) => acc + curr.amount, 0),
                    totalPendingFeeAmount: batchFeeLogs.feeLogs.filter(log => log.action_type === "Pending").reduce((acc, curr) => acc + curr.amount, 0),
                });
            }
        }

        res.status(200).json({ overallFeeStatistics, batchWiseFeeStatistics });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}