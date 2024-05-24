import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const roleSchema = mongoose.Schema({
    name: String,
    description: String,
    });
const Role = mongoose.model('Role', roleSchema);
export default Role;
