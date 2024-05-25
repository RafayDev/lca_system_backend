import Attendee from "../models/seminarAttendees.js";

export const getAttendees = async (req, res) => {
    try {
        const attendees = await Attendee.find().populate("seminar");
        res.status(200).json(attendees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAttendee = async (req, res) => { 
    const { id } = req.params;
    try {
        const attendee = await Attendee.findById(id).populate("seminar");
        res.status(200).json(attendee);
    } catch (error) { 
        res.status(500).json({ message: error.message });
    }
}

export const createAttendee = async (req, res) => {
    const { name, email, phone, city, qualification, attend_type, seminar_id } = req.body;

    try {
        const newAttendee = new Attendee({ name, email, phone, city, qualification, attend_type, seminar: seminar_id });
        await newAttendee.save();
        res.status(201).json({ message: "Attendee created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateAttendee = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, city, qualification, seminar_id } = req.body;
    try {
        await Attendee.findByIdAndUpdate(id, { name, email, phone, city, qualification, seminar: seminar_id });
        res.status(200).json({ message: "Attendee updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteAttendee = async (req, res) => {
    const { id } = req.params;
    try {
        await Attendee.findByIdAndDelete(id);
        res.status(200).json({ message: "Attendee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAttendeesBySeminar = async (req, res) => {
    const { id } = req.params;
    try {
        const attendees = await Attendee.find({ seminar: id }).populate("seminar");
        res.status(200).json(attendees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}