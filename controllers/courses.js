import Course from "../models/courses.js";
import Student from "../models/students.js";
import Batch from "../models/batches.js";
import Enrollment from "../models/enrollments.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const getCourses = async (req, res) => {
  const { query } = req.query;
  try {
    const searchQuery = query ? query : "";
    const courses = await Course.paginate(
      {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
        ],
      },
      {
        page: parseInt(req.query.page),
        limit: parseInt(req.query.limit),
      }
    );
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(400).json({ message: "Course does not exist" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCourse = async (req, res) => {
  const { name, description, fee } = req.body;
  try {
    const newCourse = new Course({ name, description, fee });
    await newCourse.save();
    res.status(200).json("Course added successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await Course.findByIdAndDelete(id);
    res.status(200).json("Course deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, description, fee } = req.body;
  try {
    await Course.findByIdAndUpdate(id, { name, description, fee });
    res.status(200).json("Course updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBatchAndCourses = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    const batch = await Batch.findById(student.batch);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    
    const enrollment = await Enrollment.findOne({ student: student._id, batch: student.batch });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const courseIds = enrollment.courses;

    const courses = await Course.find({ _id: { $in: courseIds } });
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "Courses not found" });
    }

    const courseNames = courses.map(course => course.name);

    res.status(200).json({ batchName: batch.name, courseNames });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
