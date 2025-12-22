import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    highlighticonurl: { type: String, required: true },
    isGreenIcon: { type: Boolean, default: false }, // For Wi-Fi and Blackout curtains
    isLocationType: { type: Boolean, default: false }, // For location-based highlights
    isCustomizable: { type: Boolean, default: false }, // For highlights with customizable values
    customValue: { type: String, default: '' }, // For storing custom values like distances
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  },
  { timestamps: true }
);

const Highlight = mongoose.model("Highlight", highlightSchema);

export default Highlight;