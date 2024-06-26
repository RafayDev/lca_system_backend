import Permission from "../models/permissions.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const getPermissions = async (req, res) => {
  const { query } = req.query;
  try {
    const searchQuery = query ? query : "";
    const permissions = await Permission.paginate(
      {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
        ],
      },
      {
        page: parseInt(req.query.page),
        limit: parseInt(req.query.limit),
      }
    );
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPermission = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findById(id);
    if (!permission) {
      return res.status(400).json({ message: "Permission does not exist" });
    }
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addPermission = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newPermission = new Permission({ name, description });
    await newPermission.save();
    res.status(200).json("Permission added successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePermission = async (req, res) => {
  const { id } = req.params;
  try {
    await Permission.findByIdAndDelete(id);
    res.status(200).json("Permission deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await Permission.findByIdAndUpdate(id, { name, description });
    res.status(200).json("Permission updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
