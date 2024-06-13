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
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const imageFile = image;
    const imageFileName = `${Date.now()}_${imageFile.name}`;
    const imageRef = ref(storage, `teacher_images/${imageFileName}`);
    const imageUploadTask = uploadBytes(imageRef, imageFile.data);
    await imageUploadTask;
    const imageUrl = await getDownloadURL(imageRef);

    const resumeFile = resume;
    const resumeFileName = `${Date.now()}_${resumeFile.name}`;
    const resumeRef = ref(storage, `teacher_resumes/${resumeFileName}`);
    const resumeUploadTask = uploadBytes(resumeRef, resumeFile.data);
    await resumeUploadTask;
    const resumeUrl = await getDownloadURL(resumeRef);

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
  const { query } = req.query;
  try {
    const searchQuery = query ? query : "";
    const teachers = await Teacher.paginate(
      {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
          { phone: { $regex: searchQuery, $options: "i" } },
        ],
      },
      {
        page: parseInt(req.query.page),
        limit: parseInt(req.query.limit),
      }
    );
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
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
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
  const { image, resume } = req.files || {};

  try {
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (email && email !== teacher.email) {
      const existingTeacher = await Teacher.findOne({ email });
      if (existingTeacher) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    let newImagePath = teacher.image;
    if (image) {
      const imageFileName = `${Date.now()}_${image.name}`;
      const imageRef = ref(storage, `teacher_images/${imageFileName}`);
      const imageUploadTask = uploadBytes(imageRef, image.data);
      await imageUploadTask;
      newImagePath = await getDownloadURL(imageRef);
    }

    let newResumePath = teacher.resume;
    if (resume) {
      const resumeFileName = `${Date.now()}_${resume.name}`;
      const resumeRef = ref(storage, `teacher_resumes/${resumeFileName}`);
      const resumeUploadTask = uploadBytes(resumeRef, resume.data);
      await resumeUploadTask;
      newResumePath = await getDownloadURL(resumeRef);
    }

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
