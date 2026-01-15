import { model, Mongoose, Schema } from "mongoose";

const sesionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 30,
  },
});

const Sesion = model("Session", sesionSchema);

export default Sesion;
