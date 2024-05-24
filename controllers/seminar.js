import Seminar from "../models/seminar.js";

export const addSeminar = async (req, res) => {
    const { name,date,time,description } = req.body;
    try {
        const newSeminar = new Seminar({ name,date,time,description });
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
    const { name,date,time,description  } = req.body;
    try {
        await Seminar.findByIdAndUpdate(id, { name,date,time,description });
        res.status(200).json("Seminar updated successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTodaySeminars = async (req, res) => {
    const date = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Karachi' });
    try {
        const seminars = await Seminar.find({ date });
        if(seminars.length > 0){
            return res.status(200).json(seminars);
        } else {
            return res.status(200).json([]);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}