import mongoose from 'mongoose';

const distanceSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  mainDistance: {
    type: String,
    required: true,
    trim: true
  },
  subDistances: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

const Distance = mongoose.model('Distance', distanceSchema);

export default Distance;