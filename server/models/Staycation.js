import mongoose from "mongoose";

const staycationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    staycationtype: {
      type: String,
      required: true,
      enum: ["Food and Drinks", "Wellness", "Activities"]
    },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  },
  { timestamps: true }
);

const Staycation = mongoose.model("Staycation", staycationSchema);

export default Staycation;