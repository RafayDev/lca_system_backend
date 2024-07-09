import Attendence from "../models/attendence.js";
import Batch from "../models/batches.js";
import Student from "../models/students.js";
import Course from "../models/courses.js";
import TimeTable from "../models/timeTables.js";
import Enrollment from "../models/enrollments.js";
import moment from "moment-timezone";
import mongoose from "mongoose";

export const createAttendence = async (req, res) => {
  const { student_id } = req.body;
  try {
    const student = await Student.findById(student_id);
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    const currentTime = moment().tz("Asia/Karachi").format("HH:mm");
    const currentDay = moment().tz("Asia/Karachi").format("YYYY-MM-DD");

    const timetable = await TimeTable.find({
      day: currentDay,
      batch: student.batch,
      start_time: { $lte: currentTime },
      end_time: { $gte: currentTime },
    })
      .populate("batch")
      .populate("course")
      .exec();
    if (!timetable) {
      return res
        .status(400)
        .json({ message: "No class is scheduled at the moment" });
    }
    const timetable_courses_ids = timetable.map((t) => t.course._id);

    const enrollment = await Enrollment.findOne({
      student: student_id,
      batch: student.batch,
    });
    if (!enrollment) {
      return res
        .status(400)
        .json({ message: "Student is not enrolled in any course" });
    }
    const enrollment_courses_ids = enrollment.courses;

    const course_id = timetable_courses_ids.find((id) =>
      enrollment_courses_ids.includes(id)
    );
    if (!course_id) {
      return res.status(400).json({
        message: "No class is scheduled for this student at the moment",
      });
    }

    const attendence = await Attendence.find({
      student: student_id,
      batch: student.batch,
      course: course_id,
      date: currentDay,
    })
      .populate("course")
      .exec();
    if (attendence.length > 0) {
      return res.status(400).json({ message: "Attendence already marked" });
    }

    const newAttendence = new Attendence({
      course: course_id,
      batch: student.batch,
      student: student_id,
      date: currentDay,
      status: "Present",
    });

    await newAttendence.save();

    res.status(200).json({
      message: "Attendence marked successfully",
      attendence: newAttendence,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendences = async (req, res) => {
  const { query, course_id, batch_id, date } = req.query;
  try {
    const searchQuery = query ? query : "";
    
    const filter = {};
    if (course_id) filter.course = course_id;
    if (batch_id) filter.batch = batch_id;
    if (date) filter.date = date;

    const attendences = await Attendence.find(filter)
      .populate("course")
      .populate("batch")
      .populate({
        path: "student",
        match: {
          name: { $regex: searchQuery, $options: "i" },
        },
      })
      .then((attendances) => {
        // Filter out attendances where student is null (didn't match the regex)
        const filteredAttendances = attendances.filter(
          (a) => a.student != null
        );
        return filteredAttendances;
      });

    res.status(200).json(attendences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
