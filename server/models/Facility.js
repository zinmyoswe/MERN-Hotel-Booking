import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  },
  { timestamps: true }
);

const Facility = mongoose.model("Facility", facilitySchema);

export default Facility;