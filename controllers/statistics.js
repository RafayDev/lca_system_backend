import dotenv from "dotenv";
import moment from "moment";
import Batch from "../models/batches.js";
import Student from "../models/students.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const getStatistics = async (req, res) => {
  try {
    const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
    const endOfYear = moment().endOf("year").format("YYYY-MM-DD");

    // Batches Statistics
    const current_batches_count = await Batch.countDocuments({
      startdate: { $gte: startOfYear },
    });

    const previous_batches_count = await Batch.countDocuments({
      startdate: { $lt: startOfYear },
    });

    const total_batches_count = await Batch.countDocuments();

    // Students Statistics
    const total_enrolled_students_count = await Student.countDocuments();

    // Fees Statistics
    const total_fee_record_result = await Student.aggregate([
      {
        $group: {
          _id: null,
          totalFeeRecord: {
            $sum: { $toDouble: "$total_fee" },
          },
        },
      },
    ]);
    const total_fee_record =
      total_fee_record_result.length > 0
        ? total_fee_record_result[0].totalFeeRecord
        : 0;

    const total_fee_recovered_result = await Student.aggregate([
      {
        $group: {
          _id: null,
          totalFeeRecovered: {
            $sum: { $toDouble: "$paid_fee" },
          },
        },
      },
    ]);
    const total_fee_recovered1 =
      total_fee_recovered_result.length > 0
        ? total_fee_recovered_result[0].totalFeeRecovered
        : 0;

    const total_fee_pending = total_fee_record - total_fee_recovered1;

    
    const total_fee_recovered = total_fee_record - total_fee_pending;

    res.status(200).json({
      current_batches_count,
      previous_batches_count,
      total_batches_count,
      total_enrolled_students_count,
      total_fee_record,
      total_fee_recovered,
      total_fee_pending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
