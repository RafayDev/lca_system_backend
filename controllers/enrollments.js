import Enrollment from "../models/enrollments.js";

export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find();
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createEnrollment = async (req, res) => {
  const { student_id, enrollments } = req.body;
  try {
    for (const enrollment of enrollments) {
      const { batch, courses, fees } = enrollment;

      await Enrollment.updateOne(
        { student: student_id, batch },
        {
            $set: {
                courses,
                fees,
            },
        },
        { upsert: true }
      );
    }

    res.status(201).json({ message: "Enrollment created successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getEntrollmentbyStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const enrollment = await Enrollment.find({ student: id });
    res.status(200).json(enrollment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
