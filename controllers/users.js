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
        res.status(200).json({ authToken });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}