import Teacher from "../models/teachers.js";
import dotenv from "dotenv";
import { compressImage, renameFile, uploadFile } from "../utils/fileStorage.js";
import path from "path";
dotenv.config();

export const addTeacher = async (req, res) => {
  const { name, email, phone } = req.body;
  const { image, resume } = req.files;

  try {
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const filesStorageUrl = process.env.FILES_STORAGE_URL;
    const filesStoragePath = process.env.FILES_STORAGE_PATH;

    const imageFile = image;
    const imageFileExt = path.extname(imageFile.name);
    const imageFileName = `avatar_${email}${imageFileExt}`;
    await uploadFile(imageFile, imageFileName, `${filesStoragePath}/teachers/avatars`);
    const imageWebpFileName = `avatar_${email}.webp`;
    await compressImage(imageFileName, `${filesStoragePath}/teachers/avatars/${imageWebpFileName}`, 50);
    const imageUrl = `${filesStorageUrl}/files/teachers/avatars/${imageFileName}`;

    const resumeFile = resume;
    const resumeFileExt = path.extname(resumeFile.name);
    const resumeFileName = `resume_${email}${resumeFileExt}`;
    await uploadFile(resumeFile, resumeFileName, `${filesStoragePath}/teachers/resumes`);
    const resumeUrl = `${filesStorageUrl}/files/teachers/resumes/${resumeFileName}`;

    const newTeacher = new Teacher({
      name,
      email,
      phone,
      resume: resumeUrl,
      image: imageUrl,
    });
    await newTeacher.save();

    const { _id } = newTeacher;
    const teacher = await Teacher.findById(_id);

    // update the name of compressed image
    const newImageFileName = `avatar_${newTeacher._id}.webp`;
    renameFile(`${filesStoragePath}/teachers/avatars/${imageWebpFileName}`, `${filesStoragePath}/teachers/avatars/${newImageFileName}`);
    teacher.image = `${filesStorageUrl}/files/teachers/avatars/${newImageFileName}`

    // update the name of resume
    const newResumeFileName = `resume_${newTeacher._id}${resumeFileExt}`;
    renameFile(`${filesStoragePath}/teachers/resumes/${resumeFileName}`, `${filesStoragePath}/teachers/resumes/${newResumeFileName}`);
    teacher.resume = `${filesStorageUrl}/files/teachers/resumes/${newResumeFileName}`

    await teacher.save()

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

    const filesStorageUrl = process.env.FILES_STORAGE_URL;
    const filesStoragePath = process.env.FILES_STORAGE_PATH;

    let newImagePath = teacher.image;
    const newImageFileExt = path.extname(newImagePath.name);
    const newImageFileName = `avatar_${existingTeacher._id}${newImageFileExt}`;
    await uploadFile(newImagePath, newImageFileName, `${filesStoragePath}/teachers/avatars`);
    const imageWebpFileName = `avatar_${existingTeacher._id}.webp`;
    await compressImage(newImageFileName, `${filesStoragePath}/teachers/avatars/${imageWebpFileName}`, 50);
    newImagePath = `${filesStorageUrl}/files/teachers/avatars/${newImageFileName}`;

    let newResumePath = teacher.resume;
    const resumeFileExt = path.extname(newResumePath.name);
    const resumeFileName = `resume_${existingTeacher._id}${resumeFileExt}`;
    await uploadFile(newResumePath, resumeFileName, `${filesStoragePath}/teachers/resumes`);
    newResumePath = `${filesStorageUrl}/files/teachers/resumes/${resumeFileName}`;

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
