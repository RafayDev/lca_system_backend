import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const permissionSchema = mongoose.Schema({
    name: String,
    description: String,
    });
const Permission = mongoose.model('Permission', permissionSchema);
export default Permission;
