import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        const data = { user: { id: newUser._id } };
        const authToken = jwt.sign(data, JWT_SECRET);
        res.status(200).json({ authToken });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const data = { user: { id: user._id } };
        const authToken = jwt.sign(data, JWT_SECRET);
        //set token in cookies
        res.cookie("authToken", authToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        res.status(200).json({ authToken });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(200).json("User added successfully");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await User.findByIdAndUpdate
            (id, { name, email, password: hashedPassword, role });
        res.status(200).json("User updated successfully");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json("User deleted successfully");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}