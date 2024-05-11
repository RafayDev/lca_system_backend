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
  const { image, cnic_image, cnic_back_image } = req.files;
  try {
    //save image to public/student_images folder
    const imagePath = `public/student_images/${image.name}`;
    image.mv(imagePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    //save cnic_image to public/student_cnic_image folder
    const cnic_imagePath = `public/student_cnic_images/${cnic_image.name}`;
    resume.mv(cnic_imagePath, (err) => {
      if (err) {
        console.log(err);
      }
    });

    //save cnic_back_image to public/student_cnic_back_image folder
    const cnic_back_imagePath = `public/student_cnic_back_images/${cnic_back_image.name}`;
    cnic_back_image.mv(cnic_back_imagePath, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const newstudent = new Student({
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
      cnic_image: cnic_imagePath,
      image: imagePath,
      cnic_back_image: cnic_back_imagePath,
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
    const imagePath = `public${student.student_images.split("public")[1]}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    //delete resume from public/student_resumes folder
    const cnicPath = `public${student.student_cnic_images.split("public")[1]}`;
    if (fs.existsSync(cnicPath)) {
      fs.unlinkSync(cnicPath);
    }

    //delete cnic_back_image from public/student_cnic_back_images folder
    const cnic_back_imagePath = `public${student.student_cnic_back_images.split(
      "public"
    )[1]}`;
    if (fs.existsSync(cnic_back_imagePath)) {
      fs.unlinkSync(cnic_back_imagePath);
    }

    //delete cnic_image from public/student_cnic_images folder
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
  const { image, cnic_image } = req.files;
  try {
    const student = await Student.findById(id);
    //delete image from public/student_images folder
    const imagePath = `public${student.student_images.split("public")[1]}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    //delete resume from public/student_resumes folder
    const resumePath = `public${student.student_cnic_images.split("public")[1]}`;
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
    }

    //delete cnic_back_image from public/student_cnic_back_images folder
    const cnic_back_imagePath = `public${student.student_cnic_back_images.split(
      "public"
    )[1]}`;
    if (fs.existsSync(cnic_back_imagePath)) {
      fs.unlinkSync(cnic_back_imagePath);
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

    //save cnic_back_image to public/student_cnic_back_images folder
    const new_cnic_back_imagePath = `public/student_cnic_back_images/${cnic_image.name}`;
    cnic_image.mv(new_cnic_back_imagePath, (err) => {
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
      cnic_image: newResumePath,
      image: newImagePath,
    });

    res.status(200).json("Student updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
