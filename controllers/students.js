import Student from "../models/students.js";
import Batch from "../models/batches.js";
import User from "../models/users.js";
import { sendWelcomeEmail } from "../utils/email.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import { storage } from "../utils/firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import dotenv from "dotenv";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// const crypto = require("crypto");

export const addStudent = async (req, res) => {
  const {
    name,
    email,
    phone,
    batch: batchId,
    paid_fee,
    pending_fee,
  } = req.body;

  const admission_date = req.body.admission_date || new Date();

  try {
    // Check if the email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(400).json({ message: "Invalid batch provided" });
    }

    const total_fee = batch.total_fee;

    // Generate a random password
    const randomPassword = crypto.randomBytes(8).toString("hex"); // Generates a random 16-character password

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Save the hashed password
      role: 'student', // Assign the role
    });

    await newUser.save();

    const newStudent = new Student({
      name,
      email,
      phone,
      batch: batchId,
      admission_date,
      total_fee,
      paid_fee,
      pending_fee,
      password: hashedPassword, // Save the hashed password
    });

    await newStudent.save();

    await generateQrCode(newStudent._id);

    // Send welcome email to the student with the random password
    await sendWelcomeEmail(email, name, randomPassword);

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
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    await Student.findByIdAndDelete(id);
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
    batch,
    paid_fee,
    pending_fee,
    total_fee,
  } = req.body;
  const { image, cnic_image, cnic_back_image } = req.files;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the new email is already in use by another student
    if (email && email !== student.email) {
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Save image to Firebase storage
    const imageFile = image;
    const imageFileName = `${Date.now()}_${imageFile.name}`;
    const imageRef = ref(storage, `student_images/${imageFileName}`);
    const imageUploadTask = uploadBytes(imageRef, imageFile.data);
    await imageUploadTask;
    const imagePath = await getDownloadURL(imageRef);

    // Save CNIC image to Firebase storage
    const cnicImageFile = cnic_image;
    const cnicImageFileName = `${Date.now()}_${cnicImageFile.name}`;
    const cnicImageRef = ref(
      storage,
      `student_cnic_images/${cnicImageFileName}`
    );
    const cnicImageUploadTask = uploadBytes(cnicImageRef, cnicImageFile.data);
    await cnicImageUploadTask;
    const cnic_imagePath = await getDownloadURL(cnicImageRef);

    // Save CNIC back image to Firebase storage
    const cnicBackImageFile = cnic_back_image;
    const cnicBackImageFileName = `${Date.now()}_${cnicBackImageFile.name}`;
    const cnicBackImageRef = ref(
      storage,
      `student_cnic_back_images/${cnicBackImageFileName}`
    );
    const cnicBackImageUploadTask = uploadBytes(
      cnicBackImageRef,
      cnicBackImageFile.data
    );
    await cnicBackImageUploadTask;
    const cnic_back_imagePath = await getDownloadURL(cnicBackImageRef);

    // Update the student record
    await Student.findByIdAndUpdate(id, {
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
      batch,
      cnic_image: cnic_imagePath,
      image: imagePath,
      cnic_back_image: cnic_back_imagePath,
      paid_fee,
      pending_fee,
      total_fee,
    });

    res.status(200).json("Student updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateQrCode = async (studentId) => {
  let newQrCode = null;
  try {
    // Generate QR code
    QRCode.toString(
      studentId.toString(),
      {
        errorCorrectionLevel: "H",
        type: "svg",
      },
      async function (err, data) {
        if (err) throw err;
        await Student.findByIdAndUpdate(studentId, { qrcode: data });
        newQrCode = data;
      }
    );
  } catch (error) {
    console.log(error);
  }
  return newQrCode;
};

export const getQrCode = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await generateQrCode(student._id);

    res.status(200).json((await Student.findById(student._id)).qrcode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
