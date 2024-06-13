import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const permissionSchema = mongoose.Schema({
  name: String,
  description: String,
});

permissionSchema.plugin(mongoosePaginate);

const Permission = mongoose.model("Permission", permissionSchema);
export default Permission;
