import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const roleSchema = mongoose.Schema({
    name: String,
    description: String,
    permissions:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Permission"
        }
      ],
    });
const Role = mongoose.model('Role', roleSchema);
export default Role;
