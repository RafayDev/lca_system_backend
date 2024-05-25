import Batch from "../models/batches.js";

export const getBatches = async (req, res) => {
    try {
        const batches = await Batch.find()
        res.status(200).json(batches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getBatch = async (req, res) => {
    const { id } = req.params;
    try {
        const batch = await Batch.findById(id)
        res.status(200).json(batch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addBatch = async (req, res) => {
    const { name, description, Batch_fee, startdate, enddate } = req.body;
    try {
        const newBatch = new Batch({ name, description, Batch_fee, startdate, enddate });
        await newBatch.save();
        res.status(200).json("Batch added successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateBatch = async (req, res) => {
    const { id } = req.params;
    const { name, description, Batch_fee, startdate, enddate } = req.body;
    try {
        await Batch.findByIdAndUpdate(id, { name, description, Batch_fee, startdate, enddate });
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
export const assignCoursesToBatch = async (req, res) => {
    const { batchId, courseIds } = req.body;
    try {
        const batch = await Batch.findById(batchId);
        batch.courses = courseIds;
        await batch.save();
        res.status(200).json("Courses assigned to batch successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const assignTeachersToBatch = async (req, res) => {
    const { batchId, teacherIds } = req.body;
    try {
        const batch = await Batch.findById(batchId);
        batch.teachers = teacherIds;
        await batch.save();
        res.status(200).json("Teachers assigned to batch successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getBatchCourses = async (req, res) => {
    const { id } = req.params;
    try {
        const batch = await Batch.findById(id).populate("courses");
        res.status(200).json(batch.courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getBatchTeachers = async (req, res) => {
    const { id } = req.params;
    try {
        const batch = await Batch.findById(id).populate("teachers");
        res.status(200).json(batch.teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}