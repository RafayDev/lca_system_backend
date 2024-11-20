import dotenv from "dotenv";
import moment from "moment";
import Batch from "../models/batches.js";
import Student from "../models/students.js";
import Fee from "../models/fees.js";
import FeeLogs from "../models/feeLogs.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const getStatistics = async (req, res) => {
  try {
    const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
    const endOfYear = moment().endOf("year").format("YYYY-MM-DD");

    const current_date = moment().format("YYYY-MM-DD");

    // Batches Statistics
    const current_batches_count = await Batch.countDocuments({
      enddate: { $gte: current_date },
    });

    const previous_batches_count = await Batch.countDocuments({
      enddate: { $lt: current_date },
    });

    const total_batches_count = await Batch.countDocuments();

    // Students Statistics
    const enrolled_students_count = await Student.countDocuments({
      batch: { $ne: null },
    });
    const total_students_count = await Student.countDocuments();
    const total_enrolled_students_count = enrolled_students_count + "/" + total_students_count;

    // Fees Statistics
    const total_fee_created_result = await FeeLogs.aggregate([
      { $match: { action_type: "Created" } },
      { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
    ]);
    const total_fee_created = total_fee_created_result.length > 0 ? total_fee_created_result[0].total : 0;

    const total_fee_discounted_result = await FeeLogs.aggregate([
      { $match: { action_type: "Discounted" } },
      { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
    ]);
    const total_fee_discounted = total_fee_discounted_result.length > 0 ? total_fee_discounted_result[0].total : 0;

    const total_fee_deleted_result = await FeeLogs.aggregate([
      { $match: { action_type: "Deleted" } },
      { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
    ]);
    const total_fee_deleted = total_fee_deleted_result.length > 0 ? total_fee_deleted_result[0].total : 0;

    const total_fee_paid_result = await FeeLogs.aggregate([
      { $match: { action_type: "Paid" } },
      { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
    ]);
    const total_fee_paid = total_fee_paid_result.length > 0 ? total_fee_paid_result[0].total : 0;

    const total_fee_record = total_fee_created - total_fee_discounted - total_fee_deleted;

    const total_fee_recovered = total_fee_paid;

    const total_fee_pending = total_fee_record - total_fee_recovered;

    // Fee Defaulters
    const total_fee_defaulters = await Fee.countDocuments({
      status: "Pending",
    });

    res.status(200).json({
      current_batches_count,
      previous_batches_count,
      total_batches_count,
      total_enrolled_students_count,
      total_fee_record,
      total_fee_recovered,
      total_fee_pending,
      total_fee_defaulters,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
