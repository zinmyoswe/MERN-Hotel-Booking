import mongoose from "mongoose";

const nearbyPlacesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    distance: { type: String, required: true }, // e.g., "60 m", "2.2 km"
    icon: { type: String, required: true }, // e.g., "houseicon", "shopping icon", "location icon"
    type: { 
      type: String, 
      required: true, 
      enum: ["Walkable places", "Popular landmarks"] 
    },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  },
  { timestamps: true }
);

const NearbyPlaces = mongoose.model("NearbyPlaces", nearbyPlacesSchema);

export default NearbyPlaces;