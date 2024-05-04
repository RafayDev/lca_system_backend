import Teacher from "../models/teachers.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import multer from "multer";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/teacher_uploads') // Change the directory according to your needs
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  // Initialize multer
const upload = multer({ storage: storage });

export const addTeacher = async (req, res) => {
    const { name, email, phone } = req.body;
    
    // Make sure to check if files are present in the request
    if (!req.files || !req.files.resume || !req.files.image) {
      return res.status(400).json(req.body);
    }
    
    try {
      const { resume, image } = req.files;
  
      const resumePath = path.join(__dirname, "public", "teacher_resumes", resume.name);
      await resume.mv(resumePath);
  
      const imagePath = path.join(__dirname, "public", "teacher_images", image.name);
      await image.mv(imagePath);
  
      const newTeacher = new Teacher({
        name,
        email,
        phone,
        resume: resumePath,
        image: imagePath,
      });
  
      await newTeacher.save();
      res.status(200).json("Teacher added successfully");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id);
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    await Teacher.findByIdAndDelete(id);
    res.status(200).json("Teacher deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, resume, image } = req.body;
  try {
    await Teacher.findByIdAndUpdate(id, { name, email, phone, resume, image });
    res.status(200).json("Teacher updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
