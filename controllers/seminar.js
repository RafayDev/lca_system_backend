import Seminar from "../models/seminar.js";

export const addSeminar = async (req, res) => {
    const { name, email, phone, city, qualification, will_attend } = req.body;
    try {
        const newSeminar = new Seminar({ name, email, phone, city, qualification, will_attend });
        await newSeminar.save();
        res.status(200).json("Seminar added successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getSeminars = async (req, res) => {
    try {
        const seminars = await Seminar.find();
        res.status(200).json(seminars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getSeminar = async (req, res) => {
    const { id } = req.params;
    try {
        const seminar = await Seminar.findById(id);
        res.status(200).json(seminar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteSeminar = async (req, res) => {
    const { id } = req.params;
    try {
        await Seminar.findByIdAndDelete(id);
        res.status(200).json("Seminar deleted successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateSeminar = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, city, qualification, will_attend } = req.body;
    try {
        await Seminar.findByIdAndUpdate(id, { name, email, phone, city, qualification, will_attend });
        res.status(200).json("Seminar updated successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}