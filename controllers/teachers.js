import Teacher from "../models/teachers.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const addTeacher = async (req, res) => {
    const { name, email, phone } = req.body;
    const { image, resume } = req.files;
    try {
        //save image to public/teacher_images folder
        const imagePath = `public/teacher_images/${image.name}`;
        image.mv(imagePath, (err) => {
            if (err) {
                console.log(err);
            }
        });
        //save resume to public/teacher_resumes folder
        const resumePath = `public/teacher_resumes/${resume.name}`;
        resume.mv(resumePath, (err) => {
            if (err) {
                console.log(err);
            }
        });

        const newTeacher = new Teacher({ name, email, phone, resume: resumePath, image: imagePath });
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
}

export const getTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        const teacher = await Teacher.findById(id);
        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
}


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
        await Teacher.findByIdAndUpdate(id, { name, email, phone, resume: newResumePath, image: newImagePath });
        
        res.status(200).json("Teacher updated successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

