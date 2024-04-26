import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRoutes from './routes/users.js';
import coursesRoutes from './routes/courses.js';
// import teachersRoutes from './routes/teachers.js';
// import batchesRoutes from './routes/batches.js';
const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use('/users', usersRoutes);
app.use('/courses', coursesRoutes);
// app.use('/teachers', teachersRoutes);
// app.use('/batches', batchesRoutes);

const CONNECTION_URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));
