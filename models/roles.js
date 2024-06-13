import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const roleSchema = mongoose.Schema({
  name: String,
  description: String,
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
});

roleSchema.plugin(mongoosePaginate);

const Role = mongoose.model("Role", roleSchema);
export default Role;
