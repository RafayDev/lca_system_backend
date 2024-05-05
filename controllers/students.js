import Student from "../models/students.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const addStudent = async (req, res) => {
  const {
    name,
    email,
    phone,
    cnic,
    admission_date,
    city,
    date_of_birth,
    father_name,
    father_phone,
    latest_degree,
    university,
    completion_year,
    marks_cgpa,
  } = req.body;
  const { image, cnic_image } = req.files;
  try {
    //save image to public/student_images folder
    const imagePath = `public/student_image/${image.name}`;
    image.mv(imagePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    //save cnic_image to public/student_cnic_image folder
    const cnic_imagePath = `public/student_cnic_image/${cnic_image.name}`;
    resume.mv(cnic_imagePath, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const newstudent = new student({
      name,
      email,
      phone,
      cnic,
      admission_date,
      city,
      date_of_birth,
      father_name,
      father_phone,
      latest_degree,
      university,
      completion_year,
      marks_cgpa,
      resume: cnic_imagePath,
      image: imagePath,
    });
    await newstudent.save();
    res.status(200).json("Student Added Successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    //delete image from public/student_images folder
    const imagePath = `public${student.image.split("public")[1]}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    //delete resume from public/student_resumes folder
    const resumePath = `public${student.resume.split("public")[1]}`;
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
    }
    await student.findByIdAndDelete(id);
    res.status(200).json("student deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    cnic,
    admission_date,
    city,
    date_of_birth,
    father_name,
    father_phone,
    latest_degree,
    university,
    completion_year,
    marks_cgpa,
  } = req.body;
  const { image, resume } = req.files;
  try {
    const student = await Student.findById(id);
    //delete image from public/student_images folder
    const imagePath = `public${student.image.split("public")[1]}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    //delete resume from public/student_resumes folder
    const resumePath = `public${student.resume.split("public")[1]}`;
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
    }
    //save image to public/student_images folder
    const newImagePath = `public/student_images/${image.name}`;
    image.mv(newImagePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    //save resume to public/student_resumes folder
    const newResumePath = `public/student_cnic_image/${resume.name}`;
    resume.mv(newResumePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    await student.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      cnic,
      admission_date,
      city,
      date_of_birth,
      father_name,
      father_phone,
      latest_degree,
      university,
      completion_year,
      marks_cgpa,
      resume: newResumePath,
      image: newImagePath,
    });

    res.status(200).json("Student updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
