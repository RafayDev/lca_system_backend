import Teacher from "../models/teachers.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import dotenv from "dotenv";
import { storage } from "../utils/firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const addTeacher = async (req, res) => {
  const { name, email, phone } = req.body;
  const { image, resume } = req.files;
  try {
    // Upload image to Firebase Storage
    const imageFile = image;
    const imageFileName = `${Date.now()}_${imageFile.name}`;
    const imageRef = ref(storage, `teacher_images/${imageFileName}`);
    const imageUploadTask = uploadBytes(imageRef, imageFile.data);
    // wait for the upload task to complete
    await imageUploadTask;
    // Get the download URL of the uploaded image
    const imageUrl = await getDownloadURL(imageRef);
    const resumeFile = resume;
    const resumeFileName = `${Date.now()}_${resumeFile.name}`;
    const resumeRef = ref(storage, `teacher_resumes/${resumeFileName}`);
    const resumeUploadTask = uploadBytes(resumeRef, resumeFile.data);
    // wait for the upload task to complete
    await resumeUploadTask;
    // Get the download URL of the uploaded resume
    const resumeUrl = await getDownloadURL(resumeRef);
    // Save teacher to MongoDB
    const newTeacher = new Teacher({
      name,
      email,
      phone,
      resume: resumeUrl,
      image: imageUrl,
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
    const teacher = await Teacher.findById(id);
    //delete image from public/teacher_images folder
    const imagePath = `public${teacher.image.split("public")[1]}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    //delete resume from public/teacher_resumes folder
    const resumePath = `public${teacher.resume.split("public")[1]}`;
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
    }
    await Teacher.findByIdAndDelete(id);
    res.status(200).json("Teacher deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const { image, resume } = req.files;
  try {
    const teacher = await Teacher.findById(id);
    //delete image from public/teacher_images folder
    const imagePath = `public${teacher.image.split("public")[1]}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    //delete resume from public/teacher_resumes folder
    const resumePath = `public${teacher.resume.split("public")[1]}`;
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
    }
    //save image to public/teacher_images folder
    const newImagePath = `public/teacher_images/${image.name}`;
    image.mv(newImagePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    //save resume to public/teacher_resumes folder
    const newResumePath = `public/teacher_resumes/${resume.name}`;
    resume.mv(newResumePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    await Teacher.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      resume: newResumePath,
      image: newImagePath,
    });

    res.status(200).json("Teacher updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
