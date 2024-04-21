import Course from "../models/courses.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const getCourses = async (req, res) => {
    // Check if the request contains a valid JWT token
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
    }

    try {
        // Verify the JWT token
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired token" });
            } else {
                // If token is valid, proceed to fetch courses
                const courses = await Course.find();
                res.status(200).json(courses);
            }
        });
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
    const { name, description } = req.body;
    try {
        const newCourse = new Course({ name, description });
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
    const { name, description } = req.body;
    try {
        await Course.findByIdAndUpdate(id, { name, description });
        res.status(200).json("Course updated successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

