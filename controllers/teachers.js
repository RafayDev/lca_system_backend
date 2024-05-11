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
      
      // Check if the teacher exists
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      // Check if the teacher has an associated image
      if (teacher.image) {
        const imageUrl = teacher.image;
  
        // Check if the image exists in Firebase Storage
        const imageRef = storage.refFromURL(imageUrl);
        const imageExists = await checkIfFileExists(imageRef);
  
        if (imageExists) {
          // Delete image from Firebase Storage
          await imageRef.delete();
        }
      }
  
      // Delete teacher from the database
      await Teacher.findByIdAndDelete(id);
  
      res.status(200).json("Teacher deleted successfully");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Function to check if a file exists in Firebase Storage
  const checkIfFileExists = async (fileRef) => {
    try {
      const fileSnapshot = await fileRef.getMetadata();
      return !!fileSnapshot;
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        return false;
      } else {
        throw error;
      }
    }
  };

export const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const { image, resume } = req.files;
  try {
    const teacher = await Teacher.findById(id);

    // Check if the teacher exists
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Check if the teacher has an associated image
    if (teacher.image) {
      const imageUrl = teacher.image;

      // Check if the image exists in Firebase Storage
      const imageRef = storage.refFromURL(imageUrl);
      const imageExists = await checkIfFileExists(imageRef);

      if (imageExists) {
        // Delete image from Firebase Storage
        await imageRef.delete();
      }
    }

    // Check if the teacher has an associated resume
    if (teacher.resume) {
      const resumeUrl = teacher.resume;

      // Check if the resume exists in Firebase Storage
      const resumeRef = storage.refFromURL(resumeUrl);
      const resumeExists = await checkIfFileExists(resumeRef);

      if (resumeExists) {
        // Delete resume from Firebase Storage
        await resumeRef.delete();
      }
    }

    // Upload image to Firebase Storage
    const imageFileName = `${Date.now()}_${image.name}`;
    const imageRef = ref(storage, `teacher_images/${imageFileName}`);
    const imageUploadTask = uploadBytes(imageRef, image.data);
    // wait for the upload task to complete
    await imageUploadTask;
    // Get the download URL of the uploaded image
    const newImagePath = await getDownloadURL(imageRef);
    // Upload resume to Firebase Storage
    const resumeFileName = `${Date.now()}_${resume.name}`;
    const resumeRef = ref(storage, `teacher_resumes/${resumeFileName}`);
    const resumeUploadTask = uploadBytes(resumeRef, resume.data);
    // wait for the upload task to complete
    await resumeUploadTask;
    // Get the download URL of the uploaded resume
    const newResumePath = await getDownloadURL(resumeRef);
    // Update teacher in the database
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
