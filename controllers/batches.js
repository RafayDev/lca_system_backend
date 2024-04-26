import Batch from "../models/batches.js";

export const getBatches = async (req, res) => {
    try {
        const batches = await Batch.find().populate('courses');
        res.status(200).json(batches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getBatch = async (req, res) => {
    const { id } = req.params;
    try {
        const batch = await Batch.findById(id).populate('courses');
        res.status(200).json(batch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addBatch = async (req, res) => {
    const { name, description, courses } = req.body;
    try {
        const newBatch = new Batch({ name, description, courses });
        await newBatch.save();
        res.status(200).json("Batch added successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateBatch = async (req, res) => {
    const { id } = req.params;
    const { name, description, courses } = req.body;
    try {
        await Batch.findByIdAndUpdate(id, { name, description, courses });
        res.status(200).json("Batch updated successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteBatch = async (req, res) => {
    const { id } = req.params;
    try {
        await Batch.findByIdAndDelete(id);
        res.status(200).json("Batch deleted successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}